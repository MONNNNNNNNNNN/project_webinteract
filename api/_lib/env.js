export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";
export const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY || "";
export const SUPABASE_URL = process.env.SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";
export const SESSION_SECRET = process.env.SESSION_SECRET || "dev-only-insecure-secret-change-me";

export const ADMIN_DEMO_EMAIL = process.env.ADMIN_DEMO_EMAIL || "admin@dme.kku.ac.th";
export const ADMIN_DEMO_PASSWORD = process.env.ADMIN_DEMO_PASSWORD || "demo1234";

export const hasAnthropicKey = Boolean(ANTHROPIC_API_KEY);
export const hasJSearchKey = Boolean(JSEARCH_API_KEY);
export const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
