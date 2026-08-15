-- Shared server-side cache for JSearch job listings.
--
-- Two problems this solves: (1) RapidAPI's free JSearch tier has a small
-- monthly request quota, and every page view was burning one call, and
-- (2) each live call only returns ~10 listings, so the user saw a small
-- list that got *replaced* on refresh rather than growing.
--
-- Rows accumulate: a live fetch upserts into this table, so repeated
-- refreshes over days build up a larger pool of listings than any single
-- JSearch response contains. Serverless functions are stateless, so this
-- has to live in Postgres — module-level memory only survives within one
-- warm instance and isn't shared between users.

-- Note: the primary key here is widened to (interest, id) by migration
-- 0006 — see that file for why id alone was wrong.
create table job_cache (
  id text primary key,               -- JSearch job_id
  -- One of the four Career Explorer tracks, or the literal 'all' for the
  -- unfiltered query. api/_lib/jobCache.js always writes this column
  -- explicitly (the default below never fires) and uses the 'all' sentinel
  -- rather than an empty string, because PostgREST's `?interest=eq.` with
  -- no value is ambiguous as a filter.
  interest text not null default '',
  title text not null,
  company text,
  location text,
  posted_at text,
  url text,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index job_cache_interest_idx on job_cache (interest, last_seen_at desc);

-- One row per interest, recording when we last actually called JSearch.
-- This is the quota guard: api/careers.js refuses to make a live call
-- again until MIN_LIVE_INTERVAL has passed, even on explicit refresh.
create table job_fetch_meta (
  interest text primary key,
  last_fetch_at timestamptz not null default now(),
  fetch_count integer not null default 1
);

alter table job_cache enable row level security;
alter table job_fetch_meta enable row level security;

-- Readable by anyone (the Career Explorer page is public). No write
-- policies on purpose: writes only happen from api/careers.js using the
-- service role key, which bypasses RLS. Clients can never poison the cache.
create policy "job cache is viewable by everyone" on job_cache
  for select using (true);

create policy "job fetch meta is viewable by everyone" on job_fetch_meta
  for select using (true);
