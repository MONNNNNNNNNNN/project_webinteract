// Reads the content tables and writes kb_chunks over PostgREST.
//
// Shared by scripts/build-kb.js (a terminal) and api/admin/rebuild-kb.js (the
// dashboard button), so both paths publish the same thing. Takes the URL and
// key as arguments rather than importing env.js, because the script reads its
// own environment.
//
// Writes go over PostgREST from Node, never through the SQL editor: pasting
// seed SQL there once decoded UTF-8 as CP1252 and destroyed every Thai string.

// The chunk builders' input, by name -> the table it comes from.
const TABLES = {
  courses: "site_courses",
  studyPlan: "site_study_plan",
  electives: "site_elective_courses",
  studentTypes: "site_student_types",
  feeRows: "site_fee_rows",
  staff: "site_staff",
};

// PostgREST caps request size; 119 rows of course descriptions is comfortably
// under it, but batching keeps that true if the corpus grows.
const BATCH = 50;

function headers(key, extra = {}) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "content-type": "application/json",
    ...extra,
  };
}

async function check(res, what) {
  if (!res.ok) throw new Error(`${what} ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res;
}

/**
 * Every content table, in the storage shape shared/kbChunks.js builds from.
 *
 * Refuses when all of them are empty. Migrations 0011-0014 create the tables
 * but the content arrives only from scripts/seed-content.js, so an all-empty
 * read almost always means "never seeded" — and publishing it would delete
 * every course, fee and lecturer the chatbot knows. One empty table is
 * honoured: an admin who deleted every row meant it.
 */
export async function readContentRows({ url, key, signal }) {
  const entries = await Promise.all(
    Object.entries(TABLES).map(async ([name, table]) => {
      const res = await check(
        await fetch(`${url}/rest/v1/${table}?select=*`, { headers: headers(key), signal }),
        `${table} select`
      );
      return [name, await res.json()];
    })
  );
  const rows = Object.fromEntries(entries);
  if (Object.values(rows).every((list) => list.length === 0)) {
    throw new Error("Every content table is empty. Seed them first: node scripts/seed-content.js --apply");
  }
  return rows;
}

/**
 * Upsert the chunks, then delete any row whose id they no longer produce.
 * Idempotent: ids are derived from the source record, never generated.
 */
export async function syncChunks({ url, key, chunks, signal }) {
  const now = new Date().toISOString();
  for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH).map((c) => ({ ...c, updated_at: now }));
    await check(
      await fetch(`${url}/rest/v1/kb_chunks?on_conflict=id`, {
        method: "POST",
        headers: headers(key, { Prefer: "resolution=merge-duplicates,return=minimal" }),
        body: JSON.stringify(batch),
        signal,
      }),
      "kb_chunks upsert"
    );
  }

  const res = await check(
    await fetch(`${url}/rest/v1/kb_chunks?select=id`, { headers: headers(key), signal }),
    "kb_chunks select"
  );
  const keep = new Set(chunks.map((c) => c.id));
  const stale = (await res.json()).map((r) => r.id).filter((id) => !keep.has(id));

  if (stale.length) {
    // PostgREST in.() needs each value quoted — ids contain spaces and colons.
    const list = stale.map((id) => `"${id.replace(/"/g, '""')}"`).join(",");
    await check(
      await fetch(`${url}/rest/v1/kb_chunks?id=in.(${encodeURIComponent(list)})`, {
        method: "DELETE",
        headers: headers(key, { Prefer: "return=minimal" }),
        signal,
      }),
      "kb_chunks delete"
    );
  }

  return { upserted: chunks.length, deleted: stale.length };
}

/** { course: 75, staff: 19, … } for a report line. */
export function countBySource(chunks) {
  return chunks.reduce((acc, c) => {
    acc[c.source] = (acc[c.source] || 0) + 1;
    return acc;
  }, {});
}
