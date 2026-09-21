// Handler tests for the Unanswered -> FAQ feature. fetch is stubbed: no network.
const root = new URL("../../", import.meta.url).pathname; // repo root
const mode = process.argv[2];
let pass = 0, fail = 0;
const check = (name, ok, extra = "") => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"} ${name}${extra ? " — " + extra : ""}`); };

function mock(req) {
  const out = { status: 200, body: null };
  const res = { setHeader() {}, status(c) { out.status = c; return res; }, json(b) { out.body = b; } };
  return { req: { headers: {}, query: {}, body: {}, ...req }, res, out };
}
async function call(file, req) {
  const m = await import(root + file);
  const { req: r, res, out } = mock(req);
  await m.default(r, res);
  return out;
}

let geminiReply = null; // (url, body) => Response
let lastGeminiBody = null;
globalThis.fetch = async (url, opts = {}) => {
  url = String(url);
  if (url.includes("generativelanguage")) {
    lastGeminiBody = JSON.parse(opts.body);
    return geminiReply(url, lastGeminiBody, opts);
  }
  if (url.includes("/rpc/search_kb")) {
    return new Response(JSON.stringify([
      { id: "faq:1", source: "faq", title: "How do I apply to DME?", content_en: "Two main routes: TCAS and Quota.", content_th: "", score: 0.6 },
    ]), { status: 200 });
  }
  if (url.includes("/rest/v1/kb_chunks")) return new Response("[]", { status: 200 });
  throw new Error("unexpected fetch " + url);
};
const gemOk = (text) => () => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] }), { status: 200 });

const { createSessionCookie } = await import(root + "api/_lib/session.js");
const cookie = createSessionCookie("admin@dme.kku.ac.th").split(";")[0];
const authed = { headers: { cookie } };

if (mode === "nosb") {
  // --- gemini.js refactor keeps both chat helpers' contracts
  const g = await import(root + "api/_lib/gemini.js");
  geminiReply = gemOk("apply TCAS quota routes extra words beyond eight here");
  check("rewriteQuery trims to 8 words", (await g.rewriteQuery("how get in", 1000)) === "apply TCAS quota routes extra words beyond eight");
  geminiReply = gemOk("NONE");
  check("rewriteQuery NONE -> null", (await g.rewriteQuery("weather", 1000)) === null);
  geminiReply = gemOk("Tuition is ฿50,000.");
  check("generateAnswer returns text", (await g.generateAnswer("ctx", "q", 1000)) === "Tuition is ฿50,000.");
  geminiReply = () => new Response("{}", { status: 429 });
  check("generateAnswer 429 -> null", (await g.generateAnswer("ctx", "q", 1000)) === null);
  const r429 = await g.draftFaqAnswer("", "q", 1000);
  check("draft 429 -> reason rate_limited", r429.text === null && r429.reason === "rate_limited");
  geminiReply = () => new Response(JSON.stringify({ candidates: [{ finishReason: "SAFETY" }] }), { status: 200 });
  check("draft empty -> reason empty", (await g.draftFaqAnswer("", "q", 1000)).reason === "empty");
  geminiReply = (u, b, opts) => new Promise((_, rej) => opts.signal.addEventListener("abort", () => rej(Object.assign(new Error("aborted"), { name: "AbortError" }))));
  check("draft timeout -> reason timeout", (await g.draftFaqAnswer("", "q", 50)).reason === "timeout");

  // --- draft endpoint, no Supabase: no retrieval, placeholders expected
  check("draft 401 without session", (await call("api/admin/draft-answer.js", { method: "POST", body: { question: "x" } })).status === 401);
  check("draft 405 on GET", (await call("api/admin/draft-answer.js", { method: "GET", ...authed })).status === 405);
  check("draft 400 empty question", (await call("api/admin/draft-answer.js", { method: "POST", ...authed, body: { question: " " } })).status === 400);
  geminiReply = gemOk("The canteen is [ADMIN: building and floor].");
  let o = await call("api/admin/draft-answer.js", { method: "POST", ...authed, body: { question: "Where is the canteen?" } });
  check("draft 200 without Supabase", o.status === 200 && o.body.needsInput === true && o.body.sources.length === 0, JSON.stringify(o.body));
  check("draft prompt says no documents matched", lastGeminiBody.contents[0].parts[0].text.includes("nothing in the knowledge base matched"));
  check("draft prompt is the DRAFT prompt", lastGeminiBody.system_instruction.parts[0].text.includes("[ADMIN: what is needed]"));
  geminiReply = () => new Response("{}", { status: 429 });
  o = await call("api/admin/draft-answer.js", { method: "POST", ...authed, body: { question: "Where is the canteen?" } });
  check("draft 502 with readable rate-limit message", o.status === 502 && /free-tier limit/.test(o.body.error), o.body.error);

  // --- session endpoint exposes canDraft
  o = await call("api/admin/session.js", { method: "GET", ...authed });
  check("session canDraft true with key+session", o.body.canDraft === true);
  o = await call("api/admin/session.js", { method: "GET" });
  check("session canDraft false without session", o.body.canDraft === false);

  // --- FAQ placeholder guard
  o = await call("api/admin/faqs.js", { method: "POST", ...authed, body: { question: "Canteen?", answer: "It is [ADMIN: where]." } });
  check("faq POST refuses [ADMIN:", o.status === 400 && /placeholder/.test(o.body.error));
  o = await call("api/admin/faqs.js", { method: "POST", ...authed, body: { question: "Canteen?", answer: "it is [ admin  where" } });
  check("faq POST refuses loose variant", o.status === 400);
  o = await call("api/admin/faqs.js", { method: "PUT", ...authed, body: { id: "what-is-dme", answer: "[ADMIN: x]" } });
  check("faq PUT refuses [ADMIN:", o.status === 400);
  o = await call("api/admin/faqs.js", { method: "POST", ...authed, body: { question: "Canteen?", answer: "Level 1 of the Engineering canteen building." } });
  check("faq POST clean answer -> 201", o.status === 201, JSON.stringify(o.body));

  // --- bulk dismiss in the simulated store
  await import(root + "api/content.js");
  const store = globalThis[Symbol.for("dme.content.simStore")];
  store.chat_misses = ["a", "b", "c", "d"].map((id) => ({ id, question: "Do you have a swimming pool?", asked_at: new Date().toISOString() }));
  o = await call("api/content.js", { method: "DELETE", ...authed, query: { type: "chat_misses", ids: "a,b" } });
  check("bulk delete ids=a,b", o.status === 200 && o.body.deleted === 2 && store.chat_misses.length === 2);
  o = await call("api/content.js", { method: "DELETE", ...authed, query: { type: "chat_misses", id: "c" } });
  check("single id still works", o.status === 200 && o.body.deleted === 1);
  o = await call("api/content.js", { method: "DELETE", ...authed, query: { type: "chat_misses", ids: "zz,yy" } });
  check("unknown ids -> 404", o.status === 404);
  o = await call("api/content.js", { method: "DELETE", ...authed, query: { type: "chat_misses", ids: Array.from({ length: 201 }, (_, i) => `x${i}`).join(",") } });
  check(">200 ids -> 400", o.status === 400);
  o = await call("api/content.js", { method: "DELETE", query: { type: "chat_misses", ids: "d" } });
  check("bulk delete needs session", o.status === 401);
}

if (mode === "sb") {
  // Retrieval runs first and its titles are handed to Gemini and back to the admin.
  geminiReply = gemOk("You can apply through TCAS or Quota. [ADMIN: current TCAS round dates]");
  let o = await call("api/admin/draft-answer.js", { method: "POST", ...authed, body: { question: "How do I get into DME?" } });
  check("draft with retrieval returns sources", o.status === 200 && o.body.sources[0] === "How do I apply to DME?", JSON.stringify(o.body));
  const turn = lastGeminiBody.contents[0].parts[0].text;
  check("retrieved doc is in the Gemini context", turn.includes("Two main routes: TCAS and Quota.") && turn.includes("ANSWER LANGUAGE: English"));
  geminiReply = gemOk("สมัครได้ผ่าน TCAS");
  await call("api/admin/draft-answer.js", { method: "POST", ...authed, body: { question: "สมัครเรียนยังไง" } });
  check("Thai question -> ANSWER LANGUAGE: Thai", lastGeminiBody.contents[0].parts[0].text.includes("ANSWER LANGUAGE: Thai"));
}

console.log(`\n${mode}: ${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;
