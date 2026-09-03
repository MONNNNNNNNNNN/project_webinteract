// Retrieval for the RAG chatbot — see supabase/migrations/0010_kb_chunks.sql
// for the schema and the ranking rationale.
//
// Reads use the anon key: kb_chunks and faqs are both publicly selectable, and
// search_kb() spends nothing, so there is no reason to reach for the service
// role here.

import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, hasSupabaseAdmin } from "./env.js";

// Every outbound call is time-boxed. Vercel Hobby kills the function at 10s, and
// a sleeping Supabase must cost the user a fallback answer rather than a
// platform timeout.
const SEARCH_TIMEOUT_MS = 2000;

// A course code, however the user spaces it: "EN843402", "EN 843 402",
// "en 843402". Captured so it can be normalized to the stored form.
const COURSE_CODE_RE = /\b(EN|IC)\s*(\d{3})\s*(\d{3})\b/i;

function restHeaders() {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "content-type": "application/json",
  };
}

async function timedFetch(url, options = {}, timeoutMs = SEARCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** "EN843402" -> "EN 843 402", matching how build-kb.js writes the id. */
export function extractCourseCode(message) {
  const match = COURSE_CODE_RE.exec(message || "");
  if (!match) return null;
  return `${match[1].toUpperCase()} ${match[2]} ${match[3]}`;
}

/**
 * Fetch one course chunk by its exact id.
 *
 * This exists because the 'english' tokenizer shreds "EN 843 402" into the
 * useless tokens "en", "843", "402", which match dozens of unrelated chunks and
 * rank the intended course nowhere near the top. A user naming a course code is
 * unambiguous about what they want, so the code path bypasses ranking entirely.
 */
async function fetchCourseByCode(code) {
  const url =
    `${SUPABASE_URL}/rest/v1/kb_chunks` +
    `?id=eq.${encodeURIComponent(`course:${code}`)}` +
    `&select=id,source,title,content_en,content_th,metadata`;

  const res = await timedFetch(url, { headers: restHeaders() });
  if (!res.ok) throw new Error(`kb_chunks course lookup ${res.status}`);
  const rows = await res.json();
  return rows[0] || null;
}

async function callSearchKb(query, limit) {
  const res = await timedFetch(`${SUPABASE_URL}/rest/v1/rpc/search_kb`, {
    method: "POST",
    headers: restHeaders(),
    body: JSON.stringify({ p_query: query, p_limit: limit }),
  });
  if (!res.ok) throw new Error(`search_kb rpc ${res.status}`);
  const rows = await res.json();
  return Array.isArray(rows) ? rows : [];
}

/**
 * Chunks relevant to a message, best first.
 *
 * Returns [] rather than throwing when retrieval fails — the caller still has a
 * useful ungrounded answer to give, and a chatbot that 500s because the database
 * is asleep is worse than one that admits it doesn't know.
 */
export async function searchKnowledge(message, limit = 6) {
  const query = (message || "").trim();
  if (!query) return [];

  const code = extractCourseCode(query);

  // Both requests go out together: the exact lookup is cheap and independent of
  // the ranked search, and serializing them would double the latency inside an
  // already tight budget.
  const [exact, ranked] = await Promise.allSettled([
    code ? fetchCourseByCode(code) : Promise.resolve(null),
    callSearchKb(query, limit),
  ]);

  if (exact.status === "rejected") {
    console.error("[chat] course-code lookup failed:", exact.reason?.message);
  }
  if (ranked.status === "rejected") {
    console.error("[chat] search_kb failed:", ranked.reason?.message);
  }

  const exactHit = exact.status === "fulfilled" ? exact.value : null;
  const rankedRows = ranked.status === "fulfilled" ? ranked.value : [];

  const seen = new Set();
  const merged = [];
  // The exact course match goes first unconditionally, whatever the ranker said.
  if (exactHit) {
    seen.add(exactHit.id);
    merged.push(exactHit);
  }
  rankedRows.forEach((row) => {
    if (seen.has(row.id)) return;
    seen.add(row.id);
    merged.push(row);
  });

  return merged.slice(0, limit);
}

// Only questions in this range are worth logging: shorter is a stray keystroke,
// longer is a paste or an attempt to fill the table with junk.
const LOGGABLE_MIN = 3;
const LOGGABLE_MAX = 300;

/**
 * Record a question the knowledge base could not answer.
 *
 * This is the feedback loop: every miss is a student stating exactly what the
 * content lacks, and without it that signal is lost and coverage stays
 * guesswork. Writes use the service role because chat_misses has no select
 * policy — visitors' own words should not be world-readable.
 *
 * Never throws and is never awaited for correctness. Failing to log a miss must
 * not cost the user their reply.
 */
export async function logUnansweredQuestion(message) {
  const question = (message || "").trim();
  if (!hasSupabaseAdmin) return;
  if (question.length < LOGGABLE_MIN || question.length > LOGGABLE_MAX) return;

  try {
    const res = await timedFetch(`${SUPABASE_URL}/rest/v1/chat_misses`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "content-type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ question }),
    });
    if (!res.ok) throw new Error(`chat_misses insert ${res.status}`);
  } catch (err) {
    console.error("[chat] could not log unanswered question:", err.message);
  }
}

// A course chunk carries a full English description and a full Thai one. Sending
// both sides of four of them was pushing a single request past 9s against
// Vercel's 10s kill, so the context is trimmed to the side that matches the
// question and each document is capped.
const MAX_DOC_CHARS = 1200;

/**
 * Chunks as a labelled context block for the model, plus the titles used.
 *
 * `preferThai` selects which side of a bilingual chunk to send. The other side
 * is not a translation the model needs — it is the same fact again, at double
 * the token cost and roughly double the latency.
 */
export function formatContext(chunks, { preferThai = false } = {}) {
  const blocks = chunks.map((c) => {
    const primary = preferThai ? c.content_th : c.content_en;
    const body = (primary || c.content_en || c.content_th || "").slice(0, MAX_DOC_CHARS);
    return `<document source="${c.source}" title="${c.title}">\n${body}\n</document>`;
  });
  return {
    context: blocks.join("\n\n"),
    sources: chunks.map((c) => c.title),
  };
}
