// DME Explorer chatbot — retrieval first, generation optional.
//
// Retrieval decides *what* is true: api/_lib/knowledgeBase.js finds the relevant
// chunks and this file filters them by confidence. Only then, and only if
// GEMINI_API_KEY is set, is a model asked to phrase them.
//
// The model never answers from its own knowledge. It is handed the retrieved
// text and told to decline anything the text does not cover, so it can rephrase
// a fee but cannot invent one.
//
// Without a key — or when Gemini is slow, rate-limited, or returns nothing — the
// chunk is served verbatim. That is a complete answer, just a less conversational
// one, and it costs nothing per query and cannot hallucinate at all. Every path
// out of this handler is a real answer; the model only changes how it reads.

import { hasSupabase, hasGeminiKey } from "./_lib/env.js";
import { FAQ_FACTS, FALLBACK_ANSWER } from "./_lib/mockData.js";
import { searchKnowledge, logUnansweredQuestion, formatContext } from "./_lib/knowledgeBase.js";
import { generateAnswer, rewriteQuery } from "./_lib/gemini.js";

const MAX_CHUNKS = 4;

// Whole-request budget against Vercel Hobby's 10s hard kill. Retrieval spends
// what it needs first and the model gets the remainder, so a slow database
// costs answer style rather than the whole response.
const TOTAL_BUDGET_MS = 8500;
// Below this there is not enough left for a useful completion, so skip the call
// rather than start one that will be aborted mid-stream.
const MIN_MODEL_MS = 2000;

// Below this, search_kb matched only incidentally. Saying "I don't know" beats
// confidently pasting an unrelated course description.
const MIN_SCORE = 0.12;

// Above this the match is strong enough to stand on the score alone.
//
// Between the two, the score is ambiguous and needs corroboration. Measured on
// the real corpus: "Do you have a swimming pool?" scored 0.375 against the
// laptop FAQ purely because trigram matched the filler phrase "you have" inside
// "You do not have to buy", and "Where is the canteen?" scored 0.333 against the
// admissions FAQ. Genuine answers scored 0.39 to 1.0 — the bands overlap, so no
// single threshold separates them. Lexical overlap does: "swimming pool" shares
// no content word with a laptop answer, while "computer vision" shares two with
// its matches.
const STRONG_SCORE = 0.5;

// Question scaffolding carries no subject matter, so it must not be what makes a
// chunk look relevant.
const STOPWORDS = new Set([
  "the", "and", "for", "are", "you", "your", "have", "has", "had", "does", "did",
  "what", "when", "where", "which", "who", "whom", "why", "how", "can", "could",
  "should", "would", "will", "with", "from", "this", "that", "there", "here",
  "about", "into", "much", "many", "any", "all", "not", "but", "get", "got",
  "need", "want", "know", "tell", "give", "make", "take", "was", "were", "been",
  "its", "his", "her", "their", "our", "out", "off", "per", "than", "then",
]);

// Compared on a prefix so inflection and mild typos still line up: "cambodian"
// matches "Cambodia", "fees" matches "fee".
const PREFIX_LEN = 5;

function significantTokens(message) {
  return message
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));
}

/**
 * Does this chunk actually contain something the question asked about?
 *
 * Thai has no word boundaries, so tokenising it this way produces nothing
 * useful. Thai queries skip the check and lean on trigram, which handles them
 * well — "การประมวลผลภาพ" scores 1.0 against the right course.
 */
function overlapCount(chunk, tokens) {
  if (!tokens.length) return 0;
  const hay = `${chunk.title} ${chunk.content_en || ""} ${chunk.content_th || ""}`.toLowerCase();
  return tokens.filter((t) => hay.includes(t.slice(0, PREFIX_LEN))).length;
}

function sharesSubject(chunk, tokens) {
  return overlapCount(chunk, tokens) > 0;
}

/**
 * Second-stage ranking: how many of the question's own words a chunk contains.
 *
 * The database score saturates on long questions. Asked "How much does a
 * Cambodian student pay per semester?", the International and Mekong chunks both
 * scored exactly 0.5000, and the tie broke on `id` — so `international` sorted
 * above `mekong` alphabetically and a Cambodian student was quoted ฿65,000
 * instead of ฿50,000. Asked the single word "Cambodian", Mekong scored 0.9 and
 * won outright, so the signal was there; the extra words drowned it.
 *
 * Counting matched terms breaks that tie on meaning rather than on alphabet.
 * Score still leads — this only reorders chunks the database rated equally.
 */
function rerank(chunks, tokens) {
  if (!tokens.length) return chunks;
  return [...chunks].sort((a, b) => {
    const byScore = confidenceOf(b) - confidenceOf(a);
    if (Math.abs(byScore) > 0.001) return byScore;
    return overlapCount(b, tokens) - overlapCount(a, tokens);
  });
}

const CONTACT_LINE =
  "For anything not covered here, contact the International Affairs Division on +66 (0) 4320 2059 or enforeign@kku.ac.th.";

// Any Thai character means the user wrote Thai, so prefer the Thai side of a
// chunk when it has one.
const THAI_CHARS = /[฀-๿]/;

// "hi" retrieves nothing, and without this the very first message a visitor
// sends is answered with "I don't have that detail" — the worst possible
// opening for a guide aimed at people who have not decided to apply yet.
const GREETINGS = [
  "hi", "hii", "hello", "helo", "hey", "yo", "howdy", "hiya",
  "good morning", "good afternoon", "good evening",
  "สวัสดี", "สวัสดีครับ", "สวัสดีค่ะ", "หวัดดี", "ดีครับ", "ดีค่ะ",
];

const GREETING_REPLY_EN =
  "Hello. I can answer questions about the DME programme at Khon Kaen University — courses and the study plan, tuition and fees, lecturers, admissions, internships and co-op. What would you like to know?";
const GREETING_REPLY_TH =
  "สวัสดีครับ ถามเกี่ยวกับหลักสูตร DME มหาวิทยาลัยขอนแก่นได้เลย ทั้งรายวิชาและแผนการเรียน ค่าเล่าเรียน อาจารย์ การรับสมัคร การฝึกงานและสหกิจศึกษา อยากทราบเรื่องอะไรครับ";

/** True when the whole message is a greeting, not merely one that starts with it. */
function isGreeting(message) {
  const cleaned = message.toLowerCase().replace(/[!.?,ๆฯ\s]+$/g, "").trim();
  return GREETINGS.includes(cleaned);
}

/** Keyword match over the six built-in facts. Used only when Supabase is absent. */
function faqReply(message) {
  const lower = message.toLowerCase();
  const hit = FAQ_FACTS.find((f) => f.keywords.some((k) => lower.includes(k)));
  return hit ? hit.answer : FALLBACK_ANSWER;
}

/**
 * An exact course-code hit is fetched by id and carries no relevance score —
 * it is not ranked, it is looked up, and naming a course code is an unambiguous
 * request. Treat it as fully confident.
 */
function confidenceOf(chunk) {
  return typeof chunk.score === "number" ? chunk.score : 1;
}

function buildReply(chunks, message) {
  const preferThai = THAI_CHARS.test(message);
  const top = chunks[0];
  const body = preferThai && top.content_th ? top.content_th : top.content_en || top.content_th;

  const related = chunks
    .slice(1)
    .map((c) => c.title)
    .filter(Boolean);

  const parts = [body.trim()];
  if (related.length) {
    parts.push(
      preferThai
        ? `เรื่องที่เกี่ยวข้อง: ${related.join(" · ")}`
        : `Related: ${related.join(" · ")}`
    );
  }
  return parts.join("\n\n");
}

function noMatchReply(weakTitles, message) {
  const preferThai = THAI_CHARS.test(message);
  const lead = preferThai
    ? "ยังไม่มีข้อมูลเรื่องนี้"
    : "I don't have that detail in the DME information I hold.";
  const hint = weakTitles.length
    ? (preferThai ? "หัวข้อที่ใกล้เคียง: " : "Closest topics I do have: ") + weakTitles.join(" · ")
    : null;
  return [lead, hint, CONTACT_LINE].filter(Boolean).join("\n\n");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const message = (req.body?.message || "").toString().trim().slice(0, 2000);
  if (!message) {
    res.status(400).json({ error: "message is required" });
    return;
  }

  const startedAt = Date.now();

  // Greetings resolve before retrieval — there is nothing to retrieve, and a
  // refusal here reads as a broken bot rather than a scoped one.
  if (isGreeting(message)) {
    res.status(200).json({
      reply: THAI_CHARS.test(message) ? GREETING_REPLY_TH : GREETING_REPLY_EN,
      simulated: false,
      generated: false,
      sources: [],
    });
    return;
  }

  // No knowledge base to search. Degrade to the six built-in facts rather than
  // refusing everything, and flag it so the UI can badge the answer.
  if (!hasSupabase) {
    console.warn("[chat] Supabase not configured — answering from built-in facts");
    res.status(200).json({ reply: faqReply(message), simulated: true, generated: false, sources: [] });
    return;
  }

  // searchKnowledge swallows its own failures and returns [], so a sleeping
  // Supabase costs the user a fallback answer, not an error page.
  const thai = THAI_CHARS.test(message);

  const keep = (list, toks) =>
    rerank(
      list.filter((c) => {
        const score = confidenceOf(c);
        if (score < MIN_SCORE) return false;
        if (score >= STRONG_SCORE || thai) return true;
        return sharesSubject(c, toks);
      }),
      toks
    );

  let chunks = await searchKnowledge(message, MAX_CHUNKS);
  let confident = keep(chunks, thai ? [] : significantTokens(message));

  // Nothing matched. Before giving up, let the model translate the question into
  // the vocabulary the documents actually use — "is it hard to get in" finds
  // nothing, "admission requirements TCAS" finds the FAQ. The model supplies
  // search terms only; the documents still decide what is true, so a rewrite
  // that retrieves nothing still yields an honest "I don't know".
  if (!confident.length && hasGeminiKey) {
    const left = TOTAL_BUDGET_MS - (Date.now() - startedAt);
    if (left >= MIN_MODEL_MS * 2) {
      const rewritten = await rewriteQuery(message, Math.min(left - MIN_MODEL_MS, 3000));
      if (rewritten) {
        console.log(`[chat] retry with rewritten query: "${rewritten}"`);
        const retried = await searchKnowledge(rewritten, MAX_CHUNKS);
        const kept = keep(retried, significantTokens(rewritten));
        if (kept.length) {
          chunks = retried;
          confident = kept;
        }
      }
    }
  }

  if (!confident.length) {
    // Fire and forget: a failed log must not cost the user their reply, and the
    // reply does not depend on it.
    logUnansweredQuestion(message);
    res.status(200).json({
      reply: noMatchReply(chunks.map((c) => c.title).slice(0, 3), message),
      simulated: false,
      generated: false,
      sources: [],
    });
    return;
  }

  const sources = confident.map((c) => c.title);

  // Generation is a bonus layer. Everything below this point already has a
  // complete answer in hand; Gemini only makes it read better.
  if (hasGeminiKey) {
    const remaining = TOTAL_BUDGET_MS - (Date.now() - startedAt);
    if (remaining >= MIN_MODEL_MS) {
      const { context } = formatContext(confident, { includeThai: thai });
      const generated = await generateAnswer(context, message, remaining, thai ? "Thai" : "English");
      if (generated) {
        res.status(200).json({ reply: generated, simulated: false, generated: true, sources });
        return;
      }
    }
  }

  res.status(200).json({
    reply: buildReply(confident, message),
    simulated: false,
    generated: false,
    sources,
  });
}
