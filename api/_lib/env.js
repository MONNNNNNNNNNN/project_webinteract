export const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY || "";
export const SUPABASE_URL = process.env.SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";
// Server-side only — bypasses Row Level Security, used for writes from
// api/admin/faqs.js after our own session cookie has already authorized
// the request (see api/_lib/session.js). Never expose this to the client.
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
// This literal is committed to the repo, so anyone reading it can sign a valid
// admin cookie. It stays as a local-dev convenience, but session.js refuses to
// mint or trust a session signed with it in production — see sessionsDisabled.
const FALLBACK_SESSION_SECRET = "dev-only-insecure-secret-change-me";
export const SESSION_SECRET = process.env.SESSION_SECRET || FALLBACK_SESSION_SECRET;
// False when SESSION_SECRET is unset, empty, or set to the published fallback.
export const hasSessionSecret = SESSION_SECRET !== FALLBACK_SESSION_SECRET;

export const ADMIN_DEMO_EMAIL = process.env.ADMIN_DEMO_EMAIL || "admin@dme.kku.ac.th";
export const ADMIN_DEMO_PASSWORD = process.env.ADMIN_DEMO_PASSWORD || "demo1234";

export const hasJSearchKey = Boolean(JSEARCH_API_KEY);
export const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
// Reads in jobCache.js / admin/faqs.js go through the anon role and writes
// through the service role, so both keys are required — with the anon key
// missing, every read 401s into a catch and the endpoint runs silently
// cache-less while still believing it has a cache.
export const hasSupabaseAdmin = Boolean(
  SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_SERVICE_ROLE_KEY
);
