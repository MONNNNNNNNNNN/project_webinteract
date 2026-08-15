-- Hard monthly ceiling on live JSearch calls.
--
-- job_fetch_meta already spaces calls out (10 minutes between live fetches
-- per interest), but spacing is not a cap: five interests refreshed all day
-- still adds up to far more than the RapidAPI BASIC plan's monthly
-- allowance, which is exactly how it ran out. This table is the cap — once
-- the month's budget is spent, api/careers.js stops calling the provider
-- entirely and serves the accumulated cache until the next month.

create table job_fetch_budget (
  month text primary key,           -- 'YYYY-MM', UTC
  calls integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table job_fetch_budget enable row level security;

-- Readable by anyone (useful for a status readout); writes happen only
-- through the function below, which anon cannot execute.
create policy "job fetch budget is viewable by everyone" on job_fetch_budget
  for select using (true);

-- Check-and-increment in one statement so two concurrent serverless
-- invocations can't both read "179 used" and both decide they may call.
-- Returns allowed=false without incrementing once the cap is reached.
create or replace function consume_job_fetch_budget(p_limit integer)
returns table (allowed boolean, calls integer, month text)
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
    return query select false, coalesce(c, 0)::integer, m::text;
  end if;

  return query select true, c::integer, m::text;
end;
$$;

-- Only the server may spend budget. Without this revoke, PostgREST would
-- expose the function to anonymous callers, who could drain the month's
-- allowance with a loop of /rest/v1/rpc/ requests.
revoke all on function consume_job_fetch_budget(integer) from public;
grant execute on function consume_job_fetch_budget(integer) to service_role;
