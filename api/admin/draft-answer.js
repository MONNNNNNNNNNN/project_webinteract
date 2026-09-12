// Drafts an FAQ answer for a question the chatbot could not answer.
//
// Retrieval runs first, exactly as for a visitor, and Gemini sees only what it
// found. So the draft can reuse wording the knowledge base already holds, and
// every fact it lacks comes back as an "[ADMIN: …]" placeholder instead of a
// guess. Nothing is published here: the admin edits the draft, and
// api/admin/faqs.js refuses to save it while any placeholder remains.

import { readSession, sessionsDisabled, SESSIONS_DISABLED_MESSAGE } from "../_lib/session.js";
import { hasGeminiKey, hasSupabase } from "../_lib/env.js";
import { searchKnowledge, formatContext } from "../_lib/knowledgeBase.js";
import { draftFaqAnswer } from "../_lib/gemini.js";
import { hasAdminPlaceholder } from "../../shared/faqDraft.js";

// Against Vercel Hobby's 10s kill: retrieval is capped at 2s by
// knowledgeBase.js, and the model gets what is left.
const BUDGET_MS = 8500;
const MAX_CHUNKS = 4;
const THAI_CHARS = /[฀-๿]/;

const REASONS = {
  rate_limited: "Gemini's free-tier limit is reached. Try again in a minute, or write the answer by hand.",
  timeout: "Gemini took too long. Try again, or write the answer by hand.",
  empty: "Gemini returned nothing for this question. Write the answer by hand.",
};

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
  if (!hasGeminiKey) {
    res.status(503).json({ error: "Drafting needs GEMINI_API_KEY to be set." });
    return;
  }

  const question = (req.body?.question || "").toString().trim().slice(0, 300);
  if (!question) {
    res.status(400).json({ error: "question is required" });
    return;
  }

  const started = Date.now();
  const thai = THAI_CHARS.test(question);

  // searchKnowledge never throws — a sleeping Supabase just means no context,
  // and the draft comes back as placeholders.
  const chunks = hasSupabase ? await searchKnowledge(question, MAX_CHUNKS) : [];
  const { context } = formatContext(chunks, { includeThai: thai });

  const { text, reason } = await draftFaqAnswer(
    context,
    question,
    BUDGET_MS - (Date.now() - started),
    thai ? "Thai" : "English"
  );

  if (!text) {
    res.status(502).json({ error: REASONS[reason] || "Gemini could not draft an answer. Write it by hand." });
    return;
  }

  res.status(200).json({
    draft: text,
    // Shown under the draft, so the admin can see what it was built from — and
    // that an empty list means every fact in it has to come from them.
    sources: chunks.map((c) => c.title),
    needsInput: hasAdminPlaceholder(text),
  });
}
