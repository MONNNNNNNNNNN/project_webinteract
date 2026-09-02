// Supabase-backed cache for JSearch job listings — see
// supabase/migrations/0005_job_cache.sql for the rationale and schema.
//
// Reads use the anon key (RLS allows public select), writes use the
// service role key (no write policy exists, so only the server can write).

import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } from "./env.js";

// Every outbound call is time-boxed: Vercel Hobby kills the function at
// 10s, and a hung Supabase/JSearch request must not eat that whole budget
// when we still have a usable cached list to fall back on.
const CACHE_TIMEOUT_MS = 3000;

// Listings older than this are dropped on the next live fetch. Postings get
// filled and taken down; without pruning the table would only ever grow and
// slowly fill up with dead links.
const STALE_AFTER_DAYS = 30;

// PostgREST's `?col=eq.` with an empty value is ambiguous, so the
// unfiltered "All" query is stored under a sentinel rather than "". No
// real interest is named "all", and toClientJob maps it back on the way out.
const ALL_KEY = "all";

/** DB-side key for an interest ("" is the unfiltered query). */
function interestKey(interest) {
  return interest || ALL_KEY;
}

function restHeaders(key) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "content-type": "application/json",
  };
}

async function timedFetch(url, options = {}, timeoutMs = CACHE_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

const JOB_COLUMNS = "id,interest,title,company,location,posted_at,url,first_seen_at,last_seen_at";

function toClientJob(row) {
  return {
    id: row.id,
    title: row.title,
    company: row.company,
    location: row.location,
    interest: row.interest === ALL_KEY ? "" : row.interest || "",
    postedAt: row.posted_at,
    url: row.url,
  };
}

/** Accumulated listings for an interest, newest-seen first. */
export async function readCachedJobs(interest, limit = 60) {
  const url =
    `${SUPABASE_URL}/rest/v1/job_cache` +
    `?interest=eq.${encodeURIComponent(interestKey(interest))}` +
    `&select=${JOB_COLUMNS}&order=last_seen_at.desc,first_seen_at.desc&limit=${limit}`;

  const res = await timedFetch(url, { headers: restHeaders(SUPABASE_ANON_KEY) });
  if (!res.ok) throw new Error(`job_cache select ${res.status}`);
  const rows = await res.json();
  return rows.map(toClientJob);
}

/**
 * Upsert a live JSearch batch. Existing ids get their fields and
 * last_seen_at refreshed; new ids are appended — this is what makes the
 * list grow across refreshes instead of being replaced.
 */
export async function upsertJobs(interest, jobs) {
  if (!jobs.length) return 0;

  const now = new Date().toISOString();
  const key = interestKey(interest);
  const rows = jobs.map((j) => ({
    id: j.id,
    interest: key,
    title: j.title,
    company: j.company,
    location: j.location,
    posted_at: j.postedAt,
    url: j.url,
    last_seen_at: now,
  }));

  // on_conflict names the composite key explicitly — the same posting can
  // appear under more than one interest and must be stored once per interest.
  const res = await timedFetch(`${SUPABASE_URL}/rest/v1/job_cache?on_conflict=interest,id`, {
    method: "POST",
    headers: {
      ...restHeaders(SUPABASE_SERVICE_ROLE_KEY),
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(rows),
  });
  if (!res.ok) throw new Error(`job_cache upsert ${res.status}`);
  return rows.length;
}

/**
 * Drop listings not seen in a live response for STALE_AFTER_DAYS. Called
 * after a successful fetch, so it costs nothing on the common cached path.
 */
export async function pruneStaleJobs(interest) {
  const cutoff = new Date(Date.now() - STALE_AFTER_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const url =
    `${SUPABASE_URL}/rest/v1/job_cache` +
    `?interest=eq.${encodeURIComponent(interestKey(interest))}` +
    `&last_seen_at=lt.${encodeURIComponent(cutoff)}`;

  const res = await timedFetch(url, {
    method: "DELETE",
    headers: { ...restHeaders(SUPABASE_SERVICE_ROLE_KEY), Prefer: "return=minimal" },
  });
  if (!res.ok) throw new Error(`job_cache prune ${res.status}`);
}

/**
 * Spend one live call from the current month's budget.
 *
 * Atomic on the database side (see 0007_job_fetch_budget.sql) — two
 * concurrent invocations cannot both be told they may call. Returns
 * `{ allowed, calls, month }`.
 */
export async function consumeFetchBudget(limit) {
  const res = await timedFetch(`${SUPABASE_URL}/rest/v1/rpc/consume_job_fetch_budget`, {
    method: "POST",
    headers: restHeaders(SUPABASE_SERVICE_ROLE_KEY),
    body: JSON.stringify({ p_limit: limit }),
  });
  if (!res.ok) throw new Error(`job_fetch_budget rpc ${res.status}`);
  const rows = await res.json();
  const row = Array.isArray(rows) ? rows[0] : rows;
  if (!row) throw new Error("job_fetch_budget rpc returned no row");
  return { allowed: row.allowed, calls: row.calls, month: row.month };
}

/** When JSearch was last actually called for this interest, or null. */
export async function readFetchMeta(interest) {
  const url =
    `${SUPABASE_URL}/rest/v1/job_fetch_meta` +
    `?interest=eq.${encodeURIComponent(interestKey(interest))}&select=interest,last_fetch_at,fetch_count`;

  const res = await timedFetch(url, { headers: restHeaders(SUPABASE_ANON_KEY) });
  if (!res.ok) throw new Error(`job_fetch_meta select ${res.status}`);
  const rows = await res.json();
  return rows[0] || null;
}

/** Record that a live JSearch call just happened. */
export async function touchFetchMeta(interest, previous) {
  const res = await timedFetch(`${SUPABASE_URL}/rest/v1/job_fetch_meta`, {
    method: "POST",
    headers: {
      ...restHeaders(SUPABASE_SERVICE_ROLE_KEY),
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({
      interest: interestKey(interest),
      last_fetch_at: new Date().toISOString(),
      fetch_count: (previous?.fetch_count || 0) + 1,
    }),
  });
  if (!res.ok) throw new Error(`job_fetch_meta upsert ${res.status}`);
}
