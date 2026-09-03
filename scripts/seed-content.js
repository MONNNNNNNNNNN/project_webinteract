// Re-seed the admin-editable content tables from the static modules in src/lib/.
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
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.

import { STUDY_PLAN, ELECTIVE_COURSES } from "../shared/curriculumData.js";
import { COURSE_DESCRIPTIONS } from "../shared/courseDescriptions.js";
import { STUDENT_TYPES, FEE_BREAKDOWN } from "../shared/tuitionData.js";
import { LECTURERS } from "../shared/staffData.js";

const APPLY = process.argv.includes("--apply");
const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const PLACEHOLDER_CODE = /^(EN XX XXXX|XX XXXX|IC 011 10X|EN \[unclear\])$/;

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

function courseIndex() {
  const index = new Map();
  const add = (c) => {
    if (!PLACEHOLDER_CODE.test(c.code)) index.set(c.code, c);
  };
  STUDY_PLAN.forEach((y) => y.semesters.forEach((s) => s.courses.forEach(add)));
  Object.values(ELECTIVE_COURSES).forEach((l) => l.forEach(add));
  return index;
}

function build() {
  const idx = courseIndex();

  const courses = Object.entries(COURSE_DESCRIPTIONS).map(([code, d], i) => ({
    code,
    name: idx.get(code)?.name || code,
    credits: idx.get(code)?.credits || null,
    description_en: d.descriptionEn || "",
    description_th: d.descriptionTh || "",
    prerequisites: d.prerequisites || null,
    sort_order: (i + 1) * 10,
  }));

  const staff = LECTURERS.map((l, i) => ({
    name: l.name,
    title: l.title || "",
    education: l.education || "",
    specialty: l.specialty || "",
    photo_url: l.photo || null,
    profile_url: l.profile || null,
    room: l.room || null,
    sort_order: (i + 1) * 10,
  }));

  const studentTypes = STUDENT_TYPES.map((s, i) => ({
    id: s.id,
    label: s.label,
    semester_fee: s.semesterFee,
    has_living_cost: s.hasLivingCost,
    sort_order: (i + 1) * 10,
  }));

  const feeRows = [];
  STUDENT_TYPES.forEach((s) =>
    Object.entries(FEE_BREAKDOWN[s.id]).forEach(([period, list]) =>
      list.forEach((r, i) =>
        feeRows.push({
          student_type_id: s.id,
          period,
          item: r.item,
          item_type: r.type,
          amount: r.amount,
          excluded_from_total: Boolean(r.excludedFromTotal),
          sort_order: (i + 1) * 10,
        })
      )
    )
  );

  const studyPlan = [];
  STUDY_PLAN.forEach((y) =>
    y.semesters.forEach((sem) =>
      sem.courses.forEach((c, i) =>
        studyPlan.push({
          year: y.year,
          semester_name: sem.name,
          total_accumulated: sem.totalAccumulated ?? null,
          course_code: c.code,
          course_name: c.name,
          credits: c.credits || null,
          course_type: c.type,
          sort_order: (i + 1) * 10,
        })
      )
    )
  );

  const electives = [];
  Object.entries(ELECTIVE_COURSES).forEach(([track, list]) =>
    list.forEach((c, i) =>
      electives.push({
        track,
        course_code: c.code,
        course_name: c.name,
        credits: c.credits || null,
        sort_order: (i + 1) * 10,
      })
    )
  );

  return { courses, staff, studentTypes, feeRows, studyPlan, electives };
}

async function main() {
  const d = build();
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

  console.log("\n  written.");
}

main().catch((err) => {
  console.error(`[seed-content] ${err.message}`);
  process.exitCode = 1;
});
