-- Widen job_cache's primary key from (id) to (interest, id).
--
-- One posting can legitimately come back from two different interest
-- queries — a Unity role matches both "game developer" and "software
-- developer". With id as the sole key, the second query's upsert rewrote
-- the existing row's interest instead of adding a second one, so the
-- posting silently disappeared from the first interest's list. Caught by
-- the accumulation test before this ever ran against live data.

alter table job_cache drop constraint job_cache_pkey;
alter table job_cache add primary key (interest, id);
