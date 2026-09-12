// Re-seed the admin-editable content tables from the static modules in shared/.
//
// The migrations in supabase/migrations/ carry the same seed data, but applying
// them means pasting SQL into the Supabase editor, and that round trip mangled
// every non-ASCII character on the first run: UTF-8 bytes were decoded as CP1252
// and re-encoded, so "—" became "â€”" and the Thai course descriptions became
// unrecoverable. kb_chunks came through clean because scripts/build-kb.js writes
// it over PostgREST from Node. This does the same for the content tables.
//
// Run:  node scripts/seed-content.js --dry-run
//       node scripts/seed-content.js --apply
//
// DESTRUCTIVE. Tables keyed by a generated uuid cannot be matched back to their
// source record, so they are emptied and rewritten. Any edit made in the admin
// dashboard to staff, tuition, the study plan or the elective tracks is lost.
// site_courses is keyed by course code and is upserted in place.
//
// The rows come from staticRows() in shared/kbChunks.js — the same function the
// chatbot's dry run builds from, so a seed and a knowledge build cannot disagree
// about what the static content is. Re-run scripts/build-kb.js afterwards.
//
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.

import { staticRows } from "../shared/kbChunks.js";

const APPLY = process.argv.includes("--apply");
const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function headers(extra = {}) {
  return {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    "content-type": "application/json",
    ...extra,
  };
}

async function call(method, path, body) {
  const res = await fetch(`${URL}/rest/v1/${path}`, {
    method,
    // merge-duplicates makes the on_conflict upserts idempotent; without it a
    // second run fails on the primary key instead of updating in place.
    headers: headers({ Prefer: "resolution=merge-duplicates,return=minimal" }),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

/** Empty a table and rewrite it. Only for tables keyed by a generated uuid. */
async function replaceAll(table, rows) {
  // PostgREST refuses an unfiltered delete, so match every row on a column that
  // is never null.
  await call("DELETE", `${table}?id=not.is.null`);
  for (let i = 0; i < rows.length; i += 50) {
    await call("POST", table, rows.slice(i, i + 50));
  }
}

async function main() {
  const d = staticRows();
  const plan = [
    ["site_courses", d.courses, "upsert on code"],
    ["site_staff", d.staff, "replace"],
    ["site_student_types", d.studentTypes, "upsert on id"],
    ["site_fee_rows", d.feeRows, "replace"],
    ["site_study_plan", d.studyPlan, "replace"],
    ["site_elective_courses", d.electives, "replace"],
  ];
  plan.forEach(([t, rows, how]) => console.log(`  ${t.padEnd(22)} ${String(rows.length).padStart(3)} rows  (${how})`));

  if (!APPLY) {
    console.log("\n  dry run — nothing written. Pass --apply to write.");
    return;
  }
  if (!URL || !KEY) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.");

  // Fee rows reference student types, so student types must exist first and
  // fee rows must be cleared before the types they point at.
  await call("DELETE", "site_fee_rows?id=not.is.null");
  await call("POST", "site_student_types?on_conflict=id", d.studentTypes);
  for (let i = 0; i < d.feeRows.length; i += 50) {
    await call("POST", "site_fee_rows", d.feeRows.slice(i, i + 50));
  }

  for (let i = 0; i < d.courses.length; i += 25) {
    await call("POST", "site_courses?on_conflict=code", d.courses.slice(i, i + 25));
  }
  await replaceAll("site_staff", d.staff);
  await replaceAll("site_study_plan", d.studyPlan);
  await replaceAll("site_elective_courses", d.electives);

  console.log("\n  written. Now run node scripts/build-kb.js so the chatbot matches.");
}

main().catch((err) => {
  console.error(`[seed-content] ${err.message}`);
  process.exitCode = 1;
});
