// Rebuilds the chatbot's knowledge base from the content tables, on demand.
//
// Normally unnecessary: api/content.js rebuilds automatically after every
// save to a table the chatbot reads. This endpoint is the Retry behind the
// warning an admin sees when that automatic rebuild failed — the save went
// through, the chatbot's copy (kb_chunks) did not follow. FAQs never need it;
// search_kb() unions the faqs table at query time.

import { readSession, sessionsDisabled, SESSIONS_DISABLED_MESSAGE } from "../_lib/session.js";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, hasSupabaseAdmin } from "../_lib/env.js";
import { rebuildKnowledge } from "../_lib/kbSync.js";

// Vercel Hobby kills the function at 10s. Abort first so the admin gets an
// explanation rather than a platform timeout page.
const BUDGET_MS = 8500;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  if (sessionsDisabled) {
    res.status(503).json({ error: SESSIONS_DISABLED_MESSAGE });
    return;
  }
  if (!readSession(req)) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  if (!hasSupabaseAdmin) {
    res.status(503).json({ error: "Rebuilding the chatbot needs Supabase to be configured." });
    return;
  }

  const started = Date.now();
  try {
    const result = await rebuildKnowledge({
      url: SUPABASE_URL,
      key: SUPABASE_SERVICE_ROLE_KEY,
      signal: AbortSignal.timeout(BUDGET_MS),
    });
    res.status(200).json({ ...result, ms: Date.now() - started });
  } catch (err) {
    const detail = err.name === "TimeoutError" ? `Supabase did not finish within ${BUDGET_MS / 1000}s` : err.message;
    console.error("[rebuild-kb] failed:", detail);
    // A failure part-way leaves a mix of old and new chunks, all individually
    // valid. Running it again converges, because every write is idempotent.
    res.status(502).json({ error: "Rebuild failed — safe to retry", detail });
  }
}
