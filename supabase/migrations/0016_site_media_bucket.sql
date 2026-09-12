-- The Storage bucket api/upload.js signs admin uploads into.
--
-- It was created by hand in the Supabase dashboard, so a fresh project built
-- from these migrations had every table but no bucket, and every upload failed
-- at the signing step. The values below were read back from the live project
-- (2026-09-11) and match what the code enforces:
--
--   public             true — pages render the objects by their public URL.
--   file_size_limit    50 MB, the MAX_BYTES in api/upload.js.
--   allowed_mime_types the EXTENSIONS map in api/upload.js. No SVG: an SVG is a
--                      document that can carry script, served from our origin's
--                      storage.
--
-- No storage.objects policies are needed. Reads go through the public URL, and
-- writes arrive only on a one-shot URL signed with the service role key.
--
-- Idempotent: re-applying it realigns a bucket that was edited by hand.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  52428800,
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
    'video/mp4', 'video/webm', 'video/quicktime'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
