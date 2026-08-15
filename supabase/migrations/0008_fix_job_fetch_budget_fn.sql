-- Fixes two defects in 0007's consume_job_fetch_budget():
--
-- 1. `returns table (allowed boolean, calls integer, month text)` put OUT
--    parameters named `calls` and `month` in scope inside the function body,
--    where the statement also names the columns `calls` and `month`. Postgres
--    rejected every call with 42702 "column reference month is ambiguous".
--    Returning json sidesteps the name collision entirely.
--
-- 2. `revoke all ... from public` did not remove access: Supabase grants
--    EXECUTE to the `anon` and `authenticated` roles explicitly, and a revoke
--    from PUBLIC leaves role-level grants intact. The function stayed callable
--    over PostgREST by anonymous visitors, who could have drained the month's
--    provider budget with a loop of /rest/v1/rpc/ requests. The revoke below
--    names those roles.

-- `create or replace` cannot change a function's return type, and 0007's
-- version returned a table rather than json, so the old signature has to go
-- first. Nothing reads this function's output but api/_lib/jobCache.js.
drop function if exists consume_job_fetch_budget(integer);

create function consume_job_fetch_budget(p_limit integer)
returns json
language plpgsql
as $$
declare
  m text := to_char(now() at time zone 'utc', 'YYYY-MM');
  c integer;
begin
  insert into job_fetch_budget as b (month, calls, updated_at)
  values (m, 1, now())
  on conflict (month) do update
    set calls = b.calls + 1, updated_at = now()
    where b.calls < p_limit
  returning b.calls into c;

  if c is null then
    -- The row existed and the guard clause blocked the update: budget spent.
    select b.calls into c from job_fetch_budget b where b.month = m;
    return json_build_object('allowed', false, 'calls', coalesce(c, 0), 'month', m);
  end if;

  return json_build_object('allowed', true, 'calls', c, 'month', m);
end;
$$;

revoke all on function consume_job_fetch_budget(integer) from public, anon, authenticated;
grant execute on function consume_job_fetch_budget(integer) to service_role;
