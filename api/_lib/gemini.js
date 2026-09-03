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
// cannot see in the context, it is told to decline.

import { GEMINI_API_KEY, GEMINI_MODEL } from "./env.js";

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

// The free tier is metered per minute and per day. Exceeding it returns 429,
// which is not an error worth surfacing — it is a signal to fall back.
const RATE_LIMITED = 429;

export const SYSTEM_PROMPT = `You are the assistant for DME Explorer, a guide to the Digital Media Engineering programme at Khon Kaen University.

You will be given reference documents. They are your only source of information.

Rules:
- Answer using only what appears in the documents. If they do not cover the question, say so plainly and point the user to the International Affairs Division on +66 (0) 4320 2059 or enforeign@kku.ac.th.
- Never state a course code, fee amount, date, staff name or figure that is not in the documents. Do not round, convert or estimate numbers — repeat them exactly as written.
- Reply in the same language as the question. A question in Thai gets a Thai answer.
- Two to four sentences. No preamble, no bullet lists, no markdown.
- Write as a helpful person would speak, not as a document extract.`;

function buildUserTurn(context, question) {
  return `<reference_documents>
${context}
</reference_documents>

Question: ${question}`;
}

/**
 * Phrase an answer from the retrieved context.
 *
 * Returns the text, or null when the caller should fall back. Never throws:
 * every failure here has a working answer waiting behind it, so escalating
 * would trade a slightly worse reply for no reply at all.
 */
export async function generateAnswer(context, question, timeoutMs) {
  if (!GEMINI_API_KEY) return null;

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
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: buildUserTurn(context, question) }] }],
        generationConfig: {
          // Low but not zero: the task is rephrasing supplied text, not
          // invention, and determinism is worth more than variety here.
          temperature: 0.2,
          // Generous headroom. On models that reason before answering, the
          // thinking tokens draw from this same budget, so a tight cap can
          // return an empty candidate rather than a short answer.
          maxOutputTokens: 800,
        },
      }),
      signal: controller.signal,
    });

    if (res.status === RATE_LIMITED) {
      console.warn("[chat] Gemini free-tier rate limit hit — serving retrieved text");
      return null;
    }
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[chat] Gemini ${res.status}: ${detail.slice(0, 200)}`);
      return null;
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text || "")
      .join("")
      .trim();

    if (!text) {
      // Empty candidate: usually a safety block or the output budget consumed
      // before any visible token. Either way there is nothing to show.
      console.warn(
        `[chat] Gemini returned no text (finishReason=${data.candidates?.[0]?.finishReason || "unknown"})`
      );
      return null;
    }
    return text;
  } catch (err) {
    console.error("[chat] Gemini call failed:", err.name === "AbortError" ? "timed out" : err.message);
    return null;
  } finally {
    clearTimeout(timer);
  }
}
