// Handler tests for the automatic chatbot rebuild. fetch is stubbed: no network.
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

const { staticRows } = await import(root + "shared/kbChunks.js");
const rows = staticRows();
const TABLE_ROWS = {
  site_courses: rows.courses, site_study_plan: rows.studyPlan, site_elective_courses: rows.electives,
  site_student_types: rows.studentTypes, site_fee_rows: rows.feeRows, site_staff: rows.staff,
};

let log = [];
let failTable = null;   // make this table's select fail
let clockJump = 0;      // advance Date.now during the write
const realNow = Date.now;
let offset = 0;
Date.now = () => realNow() + offset;

globalThis.fetch = async (url, opts = {}) => {
  url = String(url);
  const method = opts.method || "GET";
  const path = url.replace(/^https:\/\/fake\.supabase\.co/, "");
  log.push(`${method} ${decodeURIComponent(path).slice(0, 70)}`);
  const json = (b, s = 200) => new Response(JSON.stringify(b), { status: s });

  const table = path.match(/^\/rest\/v1\/(\w+)/)?.[1];
  if (table === "kb_chunks") {
    if (method === "POST") return new Response(null, { status: 201 });
    if (method === "GET") return json([{ id: "course:OLD 000 000" }, { id: "course:EN 843 402" }]);
    if (method === "DELETE") return new Response(null, { status: 204 });
  }
  if (TABLE_ROWS[table] && method === "GET") {
    if (failTable === table) return new Response("boom", { status: 500 });
    return json(TABLE_ROWS[table]);
  }
  if (method === "POST" || method === "PATCH") {
    offset += clockJump;
    return json([{ id: "row-1", ...JSON.parse(opts.body || "{}") }]);
  }
  if (method === "DELETE") return json([{ id: "row-1" }]);
  throw new Error("unexpected " + method + " " + url);
};

const { createSessionCookie } = await import(root + "api/_lib/session.js");
const authed = { headers: { cookie: createSessionCookie("admin@dme.kku.ac.th").split(";")[0] } };
const kbCalls = () => log.filter((l) => l.includes("kb_chunks"));

if (mode === "sb") {
  log = [];
  let o = await call("api/content.js", { method: "POST", ...authed, query: { type: "courses" }, body: { code: "EN 999 999", name: "New course" } });
  check("course save -> 201 with kb.ok", o.status === 201 && o.body.kb?.ok === true, JSON.stringify(o.body.kb));
  check("rebuild upserted all 119 chunks", o.body.kb?.upserted === 119);
  check("stale chunk deleted", o.body.kb?.deleted === 1 && log.some((l) => l.startsWith("DELETE /rest/v1/kb_chunks") && l.includes("OLD 000 000")));
  check("write happens before the rebuild reads", log[0].startsWith("POST /rest/v1/site_courses"), log[0]);

  log = [];
  o = await call("api/content.js", { method: "POST", ...authed, query: { type: "projects" }, body: { title: "T", category: "Award" } });
  check("project save -> no kb field, no rebuild", o.status === 201 && !("kb" in JSON.parse(JSON.stringify(o.body))) && kbCalls().length === 0, `kb calls: ${kbCalls().length}`);

  log = [];
  o = await call("api/content.js", { method: "PUT", ...authed, query: { type: "fee_rows" }, body: { id: "row-1", amount: 51000 } });
  check("fee row edit -> kb.ok", o.status === 200 && o.body.kb?.ok === true);

  log = [];
  o = await call("api/content.js", { method: "DELETE", ...authed, query: { type: "staff", id: "row-1" } });
  check("staff delete -> kb.ok", o.status === 200 && o.body.kb?.ok === true);

  log = [];
  o = await call("api/content.js", { method: "DELETE", ...authed, query: { type: "chat_misses", ids: "a,b" } });
  check("chat_misses dismiss -> no rebuild", o.status === 200 && !("kb" in JSON.parse(JSON.stringify(o.body))) && kbCalls().length === 0, `kb calls: ${kbCalls().length}`);

  failTable = "site_staff";
  o = await call("api/content.js", { method: "POST", ...authed, query: { type: "courses" }, body: { code: "EN 999 998", name: "Other" } });
  check("rebuild failure still reports the save", o.status === 201 && o.body.item && o.body.kb?.ok === false, JSON.stringify(o.body.kb));
  check("failure names the cause", /site_staff select 500/.test(o.body.kb?.error || ""));
  failTable = null;

  log = [];
  clockJump = 8000;
  o = await call("api/content.js", { method: "POST", ...authed, query: { type: "courses" }, body: { code: "EN 999 997", name: "Slow" } });
  clockJump = 0;
  check("slow save skips rebuild, says so", o.status === 201 && o.body.kb?.ok === false && /too long/.test(o.body.kb.error) && kbCalls().length === 0, JSON.stringify(o.body.kb));

  o = await call("api/admin/rebuild-kb.js", { method: "POST", ...authed });
  check("Retry endpoint rebuilds", o.status === 200 && o.body.upserted === 119 && o.body.bySource?.course === 75, JSON.stringify(o.body).slice(0, 120));
  o = await call("api/admin/rebuild-kb.js", { method: "POST" });
  check("Retry endpoint needs session", o.status === 401);
}

if (mode === "nosb") {
  const o = await call("api/content.js", { method: "POST", ...authed, query: { type: "courses" }, body: { code: "EN 999 999", name: "Sim" } });
  check("simulated store save -> no kb field", o.status === 201 && o.body.simulated === true && !("kb" in o.body));
}

console.log(`\n${mode}: ${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;
