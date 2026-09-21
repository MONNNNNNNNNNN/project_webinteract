// Tests for dedupeByPosting in api/careers.js, against the shape JSearch really
// returns (same posting, different job_id per publisher). fetch is stubbed.
const root = new URL("../../", import.meta.url).pathname; // repo root
let pass = 0, fail = 0;
const check = (name, ok, extra = "") => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"} ${name}${extra ? " — " + extra : ""}`); };

function mock(req) {
  const out = { status: 200, body: null, headers: {} };
  const res = {
    setHeader: (k, v) => (out.headers[k.toLowerCase()] = v),
    status(c) { out.status = c; return res; },
    json(b) { out.body = b; },
  };
  return { req: { headers: {}, query: {}, body: {}, ...req }, res, out };
}
async function call(file, req) {
  const m = await import(root + file);
  const { req: r, res, out } = mock(req);
  await m.default(r, res);
  return out;
}

// Four ids, two real postings — the live "Game Dev" bucket as observed.
const CACHED = [
  { id: "a1", title: "Game Programmer (Japanese Game Company)", company: "REERACOEN RECRUITMENT", location: "กรุงเทพมหานคร", interest: "Game Dev", url: "u1" },
  { id: "a2", title: "Game Programmer (Japanese Game Company)", company: "REERACOEN RECRUITMENT", location: "กรุงเทพมหานคร", interest: "Game Dev", url: "u2" },
  { id: "b1", title: "Senior Backend Developer - Gaming", company: "Yeah! Global", location: "ประเทศไทย", interest: "Game Dev", url: "u3" },
  { id: "b2", title: "senior backend developer - gaming ", company: " yeah! global", location: "ประเทศไทย", interest: "Game Dev", url: "u4" },
];

globalThis.fetch = async (url) => {
  url = String(url);
  if (url.includes("/rest/v1/job_cache")) return new Response(JSON.stringify(CACHED.map((j) => ({ ...j, posted_at: null, first_seen_at: null, last_seen_at: null }))), { status: 200 });
  if (url.includes("/rest/v1/job_fetch_meta")) return new Response(JSON.stringify([{ interest: "Game Dev", last_fetch_at: new Date().toISOString(), fetch_count: 3 }]), { status: 200 });
  throw new Error("unexpected fetch " + url);
};

const o = await call("api/careers.js", { method: "GET", query: { interest: "Game Dev" } });
const jobs = o.body.jobs;
check("served from cache", o.status === 200 && o.body.source === "cache", o.body.source);
check("4 cached rows collapse to 2 postings", jobs.length === 2, `got ${jobs.length}: ${jobs.map((j) => j.id).join(",")}`);
check("first (newest-seen) row wins", jobs[0].id === "a1" && jobs[1].id === "b1", jobs.map((j) => j.id).join(","));
check("case and whitespace differences still collapse", !jobs.some((j) => j.id === "b2"));
check("total matches what is shown", o.body.total === jobs.length);

const unknown = await call("api/careers.js", { method: "GET", query: { interest: "nonsense" } });
check("unknown interest still rejected", unknown.status === 400);

console.log(`\ncareers dedupe: ${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;
