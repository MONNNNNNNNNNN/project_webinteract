// Optional generation layer for the chatbot.
//
// This sits *in front of* retrieval, never instead of it. api/_lib/knowledgeBase.js
// still decides which chunks are relevant; Gemini only turns those chunks into a
// sentence. If it is unconfigured, slow, rate-limited or returns nothing, the
// caller falls back to serving the chunk verbatim — which is a complete answer
// on its own, just a less conversational one.
//
// That ordering is the whole safety argument. The model is never asked what it
// knows about DME; it is handed the text and asked to phrase it. Anything it
// cannot see in the context, it is told to decline — or, when drafting an FAQ
// for an admin, to mark as a gap for the admin to fill.

import { GEMINI_API_KEY, GEMINI_MODEL } from "./env.js";

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

// The free tier is metered per minute and per day. Exceeding it returns 429,
// which is not an error worth surfacing — it is a signal to fall back.
const RATE_LIMITED = 429;

export const SYSTEM_PROMPT = `You are the assistant for DME Explorer, a guide to the Digital Media Engineering programme at Khon Kaen University.

You will be given reference documents. They are your only source of information.

Rules:
- Answer using only what appears in the documents. If they cover the topic only partly, answer with what they do cover rather than declining — a student asking "is it hard to get in" is served by being told how admission actually works. Decline only when the documents are genuinely unrelated to the question, and then point to the International Affairs Division on +66 (0) 4320 2059 or enforeign@kku.ac.th.
- Never state a course code, fee amount, date, staff name or figure that is not in the documents. Do not round, convert or estimate numbers — repeat them exactly as written.
- Answer in the language named in the ANSWER LANGUAGE line of the user turn. Ignore the language of the documents themselves — they are often Thai even when the question is not.
- Two to four sentences. No preamble, no bullet lists, no markdown.
- Write as a helpful person would speak, not as a document extract.`;

function buildUserTurn(context, question, language) {
  // Stated rather than inferred. Asked "How much does a Cambodian student pay?"
  // in English against mostly-Thai retrieved text, the model answered in Thai.
  return `<reference_documents>
${context}
</reference_documents>

ANSWER LANGUAGE: ${language}

Question: ${question}`;
}

const REWRITE_PROMPT = `You turn a student's question into search keywords for a Thai university programme's knowledge base.

Output ONLY the keywords, space separated, no punctuation, no explanation, at most 8 words.

Use the vocabulary a curriculum document would use, not the student's casual phrasing:
- "is it hard to get in" -> apply TCAS quota applicants routes
- "what do I need to bring" -> laptop software equipment CDLC
- "can I work abroad" -> cooperative education internship placement
- "who teaches AI" -> lecturer specialty artificial intelligence machine learning

If the question is not about the programme at all, output exactly: NONE`;

// For turning an unanswered question into an FAQ. The published answer is read
// by prospective students as fact, so the model gets the same "documents only"
// rule as the chatbot — but instead of declining, it marks each missing fact
// as a placeholder the admin must fill. See shared/faqDraft.js.
const DRAFT_PROMPT = `You draft FAQ answers for DME Explorer, a guide to the Digital Media Engineering programme at Khon Kaen University. A programme administrator reviews and edits every draft before it is published, and the published answer is shown to prospective students as fact.

You will be given reference documents. They are your only source of facts.

Rules:
- Use only facts that appear in the documents. Never add facts from your own knowledge of KKU, Khon Kaen, Thailand or universities in general — not even ones you are confident about.
- Wherever the answer needs a fact the documents do not contain, write a placeholder in exactly this form: [ADMIN: what is needed]. Example: "The nearest canteen is [ADMIN: building and floor of the nearest canteen]."
- If the documents do not cover the question at all, write a short answer that is mostly placeholders. Do not refuse and do not pad.
- If the question is not about the programme, the university or student life, reply with exactly: [ADMIN: out of scope — consider dismissing this question instead]
- Repeat any number, fee, course code or name exactly as written in the documents.
- Answer in the language named in the ANSWER LANGUAGE line. Two to four sentences, plain text, no markdown, no preamble.`;

/**
 * One generateContent call.
 *
 * Never throws: every caller has a path that works without the model, so a
 * failure is reported as a reason rather than raised. `text` is null exactly
 * when `reason` is set.
 */
async function callGemini({ system, text, timeoutMs, temperature, maxOutputTokens, label }) {
  if (!GEMINI_API_KEY) return { text: null, reason: "no_key" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${ENDPOINT}/${GEMINI_MODEL}:generateContent`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        // Header rather than ?key=, so the key never lands in a URL, a proxy
        // log or an error message that quotes the request line.
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text }] }],
        generationConfig: { temperature, maxOutputTokens },
      }),
      signal: controller.signal,
    });

    if (res.status === RATE_LIMITED) {
      console.warn(`[${label}] Gemini free-tier rate limit hit`);
      return { text: null, reason: "rate_limited" };
    }
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[${label}] Gemini ${res.status}: ${detail.slice(0, 200)}`);
      return { text: null, reason: `http_${res.status}` };
    }

    const data = await res.json();
    const out = (data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "").trim();
    if (!out) {
      // Empty candidate: usually a safety block or the output budget consumed
      // before any visible token. Either way there is nothing to show.
      console.warn(
        `[${label}] Gemini returned no text (finishReason=${data.candidates?.[0]?.finishReason || "unknown"})`
      );
      return { text: null, reason: "empty" };
    }
    return { text: out, reason: null };
  } catch (err) {
    const timedOut = err.name === "AbortError";
    console.error(`[${label}] Gemini call failed:`, timedOut ? "timed out" : err.message);
    return { text: null, reason: timedOut ? "timeout" : "error" };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Turn a question that retrieved nothing into better search terms.
 *
 * This is the safe way to use a model when the knowledge base comes up empty.
 * The alternative — letting it answer from its own training — would have it
 * inventing KKU course codes and fees it has never seen. Here it only supplies
 * vocabulary; the retrieved documents still decide what is true, and if the
 * second search also finds nothing the user still gets an honest "I don't know".
 *
 * Returns null when there is nothing useful to retry with.
 */
export async function rewriteQuery(question, timeoutMs) {
  const { text } = await callGemini({
    system: REWRITE_PROMPT,
    text: question,
    timeoutMs,
    temperature: 0,
    maxOutputTokens: 200,
    label: "chat",
  });
  if (!text || text.toUpperCase().startsWith("NONE")) return null;
  // Guard against the model ignoring the format and returning a sentence.
  return text.split(/\s+/).slice(0, 8).join(" ");
}

/**
 * Phrase an answer from the retrieved context.
 *
 * Returns the text, or null when the caller should fall back. Every failure
 * here has a working answer waiting behind it, so escalating would trade a
 * slightly worse reply for no reply at all.
 */
export async function generateAnswer(context, question, timeoutMs, language = "English") {
  const { text } = await callGemini({
    system: SYSTEM_PROMPT,
    text: buildUserTurn(context, question, language),
    timeoutMs,
    // Low but not zero: the task is rephrasing supplied text, not invention,
    // and determinism is worth more than variety here.
    temperature: 0.2,
    // Generous headroom. On models that reason before answering, the thinking
    // tokens draw from this same budget, so a tight cap can return an empty
    // candidate rather than a short answer.
    maxOutputTokens: 800,
    label: "chat",
  });
  return text;
}

/**
 * Draft an FAQ answer for an admin to edit, from the retrieved context.
 *
 * Returns { text, reason } rather than bare text, because unlike the chatbot
 * there is no silent fallback — the admin needs to know why nothing came back.
 */
export async function draftFaqAnswer(context, question, timeoutMs, language = "English") {
  return callGemini({
    system: DRAFT_PROMPT,
    text: `<reference_documents>
${context || "(none — nothing in the knowledge base matched this question)"}
</reference_documents>

ANSWER LANGUAGE: ${language}

Visitor's question: ${question}`,
    timeoutMs,
    temperature: 0.2,
    maxOutputTokens: 800,
    label: "draft",
  });
}
