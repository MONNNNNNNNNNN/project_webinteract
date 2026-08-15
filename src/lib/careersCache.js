// Client-side cache for the jobs fetch.
//
// Two layers, for two different reasons:
//   1. A module-level Map, so the fetch can be warmed up as soon as the app
//      mounts (see App.jsx) — well before the user clicks into Career
//      Explorer. Avoids a visible spinner on the common path.
//   2. localStorage, so the list survives a reload or a return visit
//      tomorrow. Without this, every fresh page load re-hit /api/careers
//      and, behind it, the metered JSearch quota.
//
// The server keeps its own accumulating cache (api/_lib/jobCache.js); this
// is the browser-side half of the same idea.

export const CAREER_INTERESTS = ["3D & Animation", "Game Dev", "AI & Data", "Software"];

const STORAGE_PREFIX = "dme:careers:";
const STORAGE_VERSION = 1;
// Within this window the stored list is served with no network call at all.
const FRESH_MS = 30 * 60 * 1000; // 30 minutes
// Older than this and we discard rather than showing stale postings.
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_JOBS = 60;

const cache = new Map(); // interest -> { promise, data }

function storageKey(interest) {
  return `${STORAGE_PREFIX}${interest || "all"}`;
}

function readStored(interest) {
  try {
    const raw = window.localStorage.getItem(storageKey(interest));
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (entry.v !== STORAGE_VERSION || !Array.isArray(entry.data?.jobs)) return null;
    if (Date.now() - entry.ts > MAX_AGE_MS) {
      window.localStorage.removeItem(storageKey(interest));
      return null;
    }
    return entry;
  } catch {
    // Unavailable (private mode, disabled) or corrupt — treat as empty.
    return null;
  }
}

function writeStored(interest, data) {
  try {
    window.localStorage.setItem(
      storageKey(interest),
      JSON.stringify({ v: STORAGE_VERSION, ts: Date.now(), data })
    );
  } catch {
    // Quota exceeded or unavailable — the in-memory cache still works.
  }
}

function clearStored(interest) {
  try {
    window.localStorage.removeItem(storageKey(interest));
  } catch {
    // ignore
  }
}

// Union by job id, keeping the newly-fetched ordering first, so a refresh
// grows the list instead of replacing it. Only merges like with like —
// mixing simulated listings into real ones would be misleading.
function mergeJobs(previous, next) {
  if (!previous?.jobs?.length) return next;
  if (Boolean(previous.simulated) !== Boolean(next.simulated)) return next;

  const seen = new Set(next.jobs.map((j) => j.id));
  const carried = previous.jobs.filter((j) => !seen.has(j.id));
  return { ...next, jobs: [...next.jobs, ...carried].slice(0, MAX_JOBS) };
}

function fetchCareers(interest, { refresh = false } = {}) {
  const params = new URLSearchParams();
  if (interest) params.set("interest", interest);
  if (refresh) params.set("refresh", "1");
  const qs = params.toString();

  const entry = { promise: null, data: readStored(interest)?.data || null };
  entry.promise = fetch(`/api/careers${qs ? `?${qs}` : ""}`)
    .then((res) => res.json())
    .then((data) => {
      const merged = mergeJobs(entry.data, data);
      entry.data = merged;
      writeStored(interest, merged);
      return merged;
    })
    .catch(() => {
      cache.delete(interest);
      // A stored list is better than an error screen when offline.
      const stored = readStored(interest);
      if (stored) return stored.data;
      throw new Error("careers fetch failed");
    });

  cache.set(interest, entry);
  return entry.promise;
}

export function prefetchCareers(interest = "") {
  const existing = cache.get(interest);
  if (existing) return existing.promise;

  // Recently stored — skip the network entirely. This is where the API
  // quota saving actually comes from on repeat visits.
  const stored = readStored(interest);
  if (stored && Date.now() - stored.ts < FRESH_MS) {
    const entry = { promise: Promise.resolve(stored.data), data: stored.data };
    cache.set(interest, entry);
    return entry.promise;
  }

  return fetchCareers(interest);
}

/**
 * Synchronous read for first paint — falls back to localStorage so a
 * reload renders the previous list immediately instead of a spinner.
 */
export function getCachedCareers(interest = "") {
  const inMemory = cache.get(interest)?.data;
  if (inMemory) return inMemory;
  return readStored(interest)?.data || null;
}

// Manual refresh button. Asks the server to make a live call (subject to
// its own quota floor) and merges whatever comes back into the saved list.
export function refreshCareers(interest = "") {
  cache.delete(interest);
  return fetchCareers(interest, { refresh: true });
}

/** Drops every stored list — exposed for debugging and a manual reset. */
export function clearCareersCache() {
  cache.clear();
  clearStored("");
  CAREER_INTERESTS.forEach(clearStored);
}
