import { JSEARCH_API_KEY, hasJSearchKey, hasSupabaseAdmin } from "./_lib/env.js";
import { MOCK_JOBS } from "./_lib/mockData.js";
import {
  readCachedJobs,
  upsertJobs,
  readFetchMeta,
  touchFetchMeta,
  pruneStaleJobs,
  consumeFetchBudget,
} from "./_lib/jobCache.js";

// How long a cached list is served without touching JSearch at all.
//
// This number is set by the monthly budget, not by how fresh listings feel.
// App.jsx prefetches 5 buckets ("All" + the 4 interests) and each keeps its own
// job_fetch_meta row, so live calls land at 5 x (24h / TTL) per day. At a 6h TTL
// that is 20/day = 600/month against a 170 cap: the ceiling bound around day 9
// and the cache sat frozen for the rest of every month. At 24h it is 5/day =
// 150/month, which fits with headroom for manual refreshes.
// Changing this, MONTHLY_LIVE_BUDGET, or the bucket count means redoing that sum.
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
// Hard floor between live calls — applies even to an explicit refresh.
// This is the actual quota guard: RapidAPI's free JSearch tier is metered
// monthly, so a user hammering the refresh button must not drain it.
const MIN_LIVE_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
// Hard ceiling on live calls per calendar month. Spacing calls out is not
// the same as capping them — the RapidAPI BASIC plan allows 200/month and
// ran dry under the interval alone. Set below the plan limit so a miscount
// or a manual test can't push it over.
const MONTHLY_LIVE_BUDGET = 170;
// Headroom above the even daily share, for manual refreshes and the first
// cold-cache fetch of each bucket.
const PACE_SLACK = 5;
// Live JSearch returns ~10 rows per call; the cache accumulates far more.
const MAX_JOBS = 60;

/**
 * How much of the month's budget may be spent by the end of today (UTC, to
 * match the 'YYYY-MM' key consume_job_fetch_budget() writes).
 *
 * A cap alone does not stop a burst: the 10-minute floor still lets the
 * refresh button spend 5 buckets x 6 calls an hour, which empties 170 in about
 * six hours and leaves the cache frozen for the rest of the month. Passing a
 * pro-rata limit to the same atomic function paces the month without a
 * migration — a refresh storm can only spend today's share. Scheduled use is 5
 * calls a day, which stays under ceil(170 x day / 31) at every day of every
 * month, so the TTL path is never blocked by this.
 */
function pacedBudgetLimit(now = new Date()) {
  const day = now.getUTCDate();
  const daysInMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)).getUTCDate();
  return Math.min(MONTHLY_LIVE_BUDGET, Math.ceil((MONTHLY_LIVE_BUDGET * day) / daysInMonth) + PACE_SLACK);
}

function shuffled(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function simulatedJobs(interest) {
  const jobs = interest ? MOCK_JOBS.filter((j) => j.interest === interest) : MOCK_JOBS;
  return shuffled(jobs);
}

const INTEREST_QUERY_TERMS = {
  "3D & Animation": "3D animation artist",
  "Game Dev": "game developer",
  "AI & Data": "AI data science",
  Software: "software developer",
};

async function liveJobs(interest) {
  const term = INTEREST_QUERY_TERMS[interest] || "digital media";
  const query = `${term} jobs Thailand`;
  const url = `https://jsearch.p.rapidapi.com/search-v2?query=${encodeURIComponent(query)}&num_pages=1&country=th&date_posted=all`;

  // Time-boxed so a slow provider can't burn the 10s Hobby budget when we
  // already have a cached list ready to serve instead.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);

  let data;
  try {
    const res = await fetch(url, {
      headers: {
        "x-rapidapi-key": JSEARCH_API_KEY,
        "x-rapidapi-host": "jsearch.p.rapidapi.com",
      },
      signal: controller.signal,
    });
    if (!res.ok) {
      // Include a snippet of the provider's own explanation — the
      // difference between "quota exhausted" and "bad key" is a 429 vs a
      // 403 body, and without it the failure is unactionable from logs.
      const detail = await res.text().catch(() => "");
      throw new Error(`JSearch API ${res.status} ${detail.slice(0, 160)}`.trim());
    }
    data = await res.json();
  } finally {
    clearTimeout(timer);
  }

  const jobs = data.data?.jobs || [];

  return jobs.map((j) => ({
    id: j.job_id,
    title: j.job_title,
    company: j.employer_name,
    location: j.job_city
      ? `${j.job_city}, ${j.job_country}`
      : (j.job_location || "").split("•")[0].trim() || j.job_country || "Thailand",
    interest: interest || "",
    postedAt: j.job_posted_at_datetime_utc || j.job_posted_at || null,
    url: j.job_apply_link,
  }));
}

// No Supabase configured — the cache table doesn't exist, so behave the way
// this endpoint did before it had one: live if a key is set, else simulated.
async function withoutCache(interest, res) {
  if (hasJSearchKey) {
    try {
      const jobs = await liveJobs(interest);
      res.status(200).json({ jobs, simulated: false, source: "live", cached: false });
      return;
    } catch (err) {
      console.error("[careers] uncached live fetch failed:", err.message);
      res.status(200).json({
        jobs: simulatedJobs(interest),
        simulated: true,
        source: "simulated",
        cached: false,
        note: "Live JSearch call failed, showing simulated listings instead.",
      });
      return;
    }
  }
  res.status(200).json({ jobs: simulatedJobs(interest), simulated: true, source: "simulated", cached: false });
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const interest = (req.query?.interest || "").toString();
  const refresh = (req.query?.refresh || "").toString() === "1";

  // Closed set. Each interest is its own cache bucket with its own 10-minute
  // floor, and a bucket nobody has seen has no cache — so an open value let
  // `?interest=a1`, `?interest=a2`, … each spend a live call, and 170 requests
  // emptied the month's budget while filling job_cache with junk buckets.
  if (interest && !Object.hasOwn(INTEREST_QUERY_TERMS, interest)) {
    res.status(400).json({ error: `Unknown interest: ${interest}` });
    return;
  }

  // A plain read is safe to serve from Vercel's edge for a few minutes,
  // which cuts function invocations on top of the JSearch savings. An
  // explicit refresh must always reach the function.
  res.setHeader(
    "Cache-Control",
    refresh ? "no-store" : "public, s-maxage=300, stale-while-revalidate=3600"
  );

  if (!hasSupabaseAdmin) {
    await withoutCache(interest, res);
    return;
  }

  let cached = [];
  let meta = null;
  let liveError = null;
  try {
    [cached, meta] = await Promise.all([
      readCachedJobs(interest, MAX_JOBS),
      readFetchMeta(interest),
    ]);
  } catch (err) {
    // Cache unreachable — don't fail the page over it, but say so: a silent
    // catch here is what made the first production failure hard to diagnose.
    console.error("[careers] cache read failed:", err.message);
  }

  const sinceLastFetch = meta?.last_fetch_at
    ? Date.now() - new Date(meta.last_fetch_at).getTime()
    : Infinity;

  // Quota floor first, then any of: nothing cached yet, user asked for
  // fresh results, or the cache has gone stale.
  const shouldFetchLive =
    hasJSearchKey &&
    sinceLastFetch >= MIN_LIVE_INTERVAL_MS &&
    (cached.length === 0 || refresh || sinceLastFetch >= CACHE_TTL_MS);

  console.log(
    `[careers] interest="${interest || "all"}" cached=${cached.length} ` +
      `sinceLastFetchMs=${sinceLastFetch} jsearchKey=${hasJSearchKey} live=${shouldFetchLive}`
  );

  // The month's hard cap. Checked and spent atomically, so concurrent
  // invocations can't both slip through on the last remaining call. Failing
  // closed is deliberate: if the budget can't be read, Supabase is unwell,
  // the result couldn't be cached anyway, and a live call would be quota
  // spent for nothing.
  let budget = null;
  const budgetLimit = pacedBudgetLimit();
  if (shouldFetchLive) {
    try {
      budget = await consumeFetchBudget(budgetLimit);
    } catch (err) {
      console.error("[careers] budget check failed, skipping live call:", err.message);
      budget = { allowed: false, calls: null, month: null };
    }
    if (!budget.allowed) {
      console.warn(
        `[careers] live budget spent (${budget.calls ?? "?"}/${budgetLimit} so far this month, ` +
          `${MONTHLY_LIVE_BUDGET} cap) — serving cache`
      );
    }
  }

  const goLive = shouldFetchLive && budget?.allowed === true;

  // Hoisted out of the try below. A batch that arrived from JSearch but failed
  // to persist has already cost a call from the month's budget — throwing it
  // away and serving a staler list wastes that call for nothing.
  let live = null;
  let livePersisted = false;

  if (goLive) {
    // Record the attempt *before* making it, so a failing provider backs off
    // for the same 10 minutes a successful one does. Recording it only on
    // success meant a 429 left the cache empty and last_fetch_at unset, so
    // every subsequent request retried immediately — hammering exactly the
    // quota this cache exists to protect.
    try {
      await touchFetchMeta(interest, meta);
    } catch (err) {
      console.error("[careers] fetch-meta write failed:", err.message);
    }

    try {
      live = await liveJobs(interest);
      await upsertJobs(interest, live);
      livePersisted = true;

      // Housekeeping only — a failed prune must not cost the user their
      // freshly-fetched listings.
      try {
        await pruneStaleJobs(interest);
      } catch (err) {
        console.error("[careers] prune failed:", err.message);
      }

      // Re-read so the response is the merged, accumulated set rather than
      // just this batch — that's what makes the list grow over time.
      const merged = await readCachedJobs(interest, MAX_JOBS);
      const jobs = merged.length ? merged : live;

      res.status(200).json({
        jobs,
        simulated: false,
        source: "live",
        cached: true,
        added: live.length,
        total: jobs.length,
        lastFetchedAt: new Date().toISOString(),
        budgetUsed: budget.calls,
        budgetLimit: MONTHLY_LIVE_BUDGET,
      });
      return;
    } catch (err) {
      // Live call or cache write failed — fall through and serve whatever
      // is already cached.
      liveError = err.message;
      console.error("[careers] live fetch/cache write failed:", err.message);
    }
  }

  const budgetSpent = budget?.allowed === false;
  // Pacing blocks for the rest of the day; the hard cap for the rest of the month.
  const budgetResumes =
    budget?.calls != null && budget.calls >= MONTHLY_LIVE_BUDGET ? "next month" : "tomorrow";

  // Reached when the live call itself succeeded but a cache write or the
  // re-read after it did not. Serve the batch we hold, unioned over whatever
  // was already cached, rather than falling back past it to a staler list.
  if (live?.length) {
    const seen = new Set(live.map((j) => j.id));
    const jobs = [...live, ...cached.filter((j) => !seen.has(j.id))].slice(0, MAX_JOBS);

    res.status(200).json({
      jobs,
      simulated: false,
      source: "live",
      cached: livePersisted,
      added: live.length,
      total: jobs.length,
      lastFetchedAt: new Date().toISOString(),
      note: livePersisted
        ? undefined
        : "Live listings loaded, but saving them for next time failed.",
    });
    return;
  }

  if (cached.length) {
    const nextLiveFetchAt =
      meta?.last_fetch_at && Number.isFinite(sinceLastFetch)
        ? new Date(new Date(meta.last_fetch_at).getTime() + MIN_LIVE_INTERVAL_MS).toISOString()
        : null;

    res.status(200).json({
      jobs: cached,
      simulated: false,
      source: "cache",
      cached: true,
      total: cached.length,
      lastFetchedAt: meta?.last_fetch_at || null,
      nextLiveFetchAt,
      note: budgetSpent
        ? `Live-data budget reached — serving saved listings until ${budgetResumes}.`
        : liveError
          ? "Live job data is temporarily unavailable — serving saved listings."
          : refresh && !shouldFetchLive
            ? "Recently refreshed — serving the saved list to conserve API quota."
            : undefined,
    });
    return;
  }

  // Nothing cached and nothing live. Say which of the two it is — telling a
  // user to set JSEARCH_API_KEY when it's already set and the quota is spent
  // sends them chasing the wrong problem.
  res.status(200).json({
    jobs: simulatedJobs(interest),
    simulated: true,
    source: "simulated",
    cached: false,
    note: budgetSpent
      ? `Live-data budget reached — showing representative listings until ${budgetResumes}.`
      : hasJSearchKey
        ? "Live job data is temporarily unavailable — showing representative listings."
        : "Showing representative listings — set JSEARCH_API_KEY for live job data.",
  });
}
