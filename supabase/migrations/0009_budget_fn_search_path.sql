-- Pin consume_job_fetch_budget()'s search_path.
--
-- Without it the function resolves `job_fetch_budget` against whatever
-- search_path the caller happens to have, which is Supabase's
-- function_search_path_mutable lint. Low severity here — 0008 revoked EXECUTE
-- from anon/authenticated, so only service_role can call it at all — but the
-- fix is one statement and it silences the linter.
--
-- ALTER FUNCTION ... SET is enough; no drop/recreate, so the 0008 grants stay.
alter function consume_job_fetch_budget(integer) set search_path = public;
