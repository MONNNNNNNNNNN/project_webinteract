// Rebuilds the chatbot's knowledge base from the content tables.
//
// The pages read site_* live; the chatbot reads kb_chunks, which is a derived
// copy. Without this, an admin who corrected a fee saw the Tuition page change
// while the chatbot kept quoting the old amount until someone ran
// scripts/build-kb.js from a terminal. FAQs need none of this — search_kb()
// unions the faqs table at query time.
//
// Same code as the script (shared/kbChunks.js + api/_lib/kbSync.js): ~119 rows
// in three upserts, measured well inside the budget below.

import { readSession, sessionsDisabled, SESSIONS_DISABLED_MESSAGE } from "../_lib/session.js";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, hasSupabaseAdmin } from "../_lib/env.js";
import { readContentRows, syncChunks, countBySource } from "../_lib/kbSync.js";
import { buildChunks } from "../../shared/kbChunks.js";

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
  const signal = AbortSignal.timeout(BUDGET_MS);
  const ctx = { url: SUPABASE_URL, key: SUPABASE_SERVICE_ROLE_KEY, signal };

  try {
    const chunks = buildChunks(await readContentRows(ctx));
    const { upserted, deleted } = await syncChunks({ ...ctx, chunks });
    res.status(200).json({ upserted, deleted, bySource: countBySource(chunks), ms: Date.now() - started });
  } catch (err) {
    const detail = err.name === "TimeoutError" ? `Supabase did not finish within ${BUDGET_MS / 1000}s` : err.message;
    console.error("[rebuild-kb] failed:", detail);
    // A failure part-way leaves a mix of old and new chunks, all individually
    // valid. Running it again converges, because every write is idempotent.
    res.status(502).json({ error: "Rebuild failed — safe to retry", detail });
  }
}
