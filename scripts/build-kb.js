// Ingestion for the RAG chatbot's knowledge base (see
// supabase/migrations/0010_kb_chunks.sql).
//
// Reads the static data modules under src/lib/, turns them into retrievable
// chunks, and upserts them into kb_chunks. Chunk ids are derived from the source
// record rather than generated, so re-running this is idempotent: existing rows
// are updated in place and rows whose ids are no longer produced are deleted.
//
// Run:  node scripts/build-kb.js            (writes to Supabase)
//       node scripts/build-kb.js --dry-run  (builds and counts, no network)
//
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment. The
// service role key is used because kb_chunks has no write policy — see the
// migration.

import { STUDY_PLAN, ELECTIVE_COURSES } from "../shared/curriculumData.js";
import { COURSE_DESCRIPTIONS } from "../shared/courseDescriptions.js";
import { STUDENT_TYPES, FEE_BREAKDOWN, MEKONG_COUNTRIES, formatBaht } from "../shared/tuitionData.js";
import { LECTURERS } from "../shared/staffData.js";

const DRY_RUN = process.argv.includes("--dry-run");

// Codes the curriculum uses as placeholders for "student picks one", not real
// courses. They must not become chunks — several share the same string and would
// collide on the primary key.
const PLACEHOLDER_CODE = /^(EN XX XXXX|XX XXXX|IC 011 10X|EN \[unclear\])$/;

function slug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Course code -> { name, credits }, which live in curriculumData, not in the descriptions. */
function buildCourseIndex() {
  const index = new Map();
  STUDY_PLAN.forEach((yearBlock) => {
    yearBlock.semesters.forEach((sem) => {
      sem.courses.forEach((c) => {
        if (!PLACEHOLDER_CODE.test(c.code)) index.set(c.code, { name: c.name, credits: c.credits });
      });
    });
  });
  Object.values(ELECTIVE_COURSES).forEach((list) => {
    list.forEach((c) => {
      if (!PLACEHOLDER_CODE.test(c.code)) index.set(c.code, { name: c.name, credits: c.credits });
    });
  });
  return index;
}

function courseChunks(courseIndex) {
  return Object.entries(COURSE_DESCRIPTIONS).map(([code, details]) => {
    const meta = courseIndex.get(code);
    const name = meta?.name || code;
    const parts = [`${code} — ${name}.`];
    if (meta?.credits) parts.push(`Credits: ${meta.credits}.`);
    if (details.prerequisites) parts.push(`Prerequisites: ${details.prerequisites}.`);
    parts.push(details.descriptionEn);

    return {
      id: `course:${code}`,
      source: "course",
      title: `${code} — ${name}`,
      content_en: parts.join(" "),
      content_th: details.descriptionTh || "",
      metadata: {
        code,
        name,
        credits: meta?.credits || null,
        prerequisites: details.prerequisites || null,
      },
    };
  });
}

function studyPlanChunks() {
  const chunks = [];
  STUDY_PLAN.forEach((yearBlock) => {
    yearBlock.semesters.forEach((sem) => {
      const lines = sem.courses.map(
        (c) => `${c.code} ${c.name} (${c.credits} credits, ${c.type})`
      );
      chunks.push({
        id: `study_plan:y${yearBlock.year}:${slug(sem.name)}`,
        source: "study_plan",
        title: `Year ${yearBlock.year} ${sem.name} study plan`,
        content_en: [
          `Digital Media Engineering year ${yearBlock.year}, ${sem.name}.`,
          sem.totalAccumulated ? `Accumulated credits by end of this semester: ${sem.totalAccumulated}.` : "",
          `Courses: ${lines.join("; ")}.`,
        ]
          .filter(Boolean)
          .join(" "),
        content_th: "",
        metadata: { year: yearBlock.year, semester: sem.name },
      });
    });
  });
  return chunks;
}

function electiveTrackChunks() {
  return Object.entries(ELECTIVE_COURSES).map(([track, list]) => ({
    id: `elective_track:${slug(track)}`,
    source: "elective_track",
    title: `${track} major elective track`,
    content_en:
      `The ${track} track is one of four DME major elective tracks (AI, Digital Media, Interactive, Software). ` +
      `Courses in this track: ${list.map((c) => `${c.code} ${c.name} (${c.credits})`).join("; ")}.`,
    content_th: "",
    metadata: { track, courseCount: list.length },
  }));
}

function tuitionChunks() {
  const chunks = [];
  STUDENT_TYPES.forEach((type) => {
    Object.entries(FEE_BREAKDOWN[type.id]).forEach(([period, rows]) => {
      const lines = rows.map((r) => `${r.item}: ${formatBaht(r.amount)} (${r.type})`);
      // Nationality adjectives, not just country names. A student asks "how much
      // do I pay as a Cambodian", and the English stemmer treats "cambodian" and
      // "cambodia" as different lexemes — so without this the query missed the
      // Mekong chunk entirely and the shorter Thai chunk won on term density,
      // quoting ฿45,000 to someone who owes ฿50,000.
      const mekongNote =
        type.id === "mekong"
          ? ` The Mekong Region rate applies to students from ${MEKONG_COUNTRIES.join(", ")}.` +
            " Cambodian, Chinese, Lao, Laotian, Burmese, Myanmar and Vietnamese students pay this Mekong Region rate."
          : "";
      const thaiNote =
        type.id === "thai" ? " This rate applies to Thai nationals only." : "";
      const intlNote =
        type.id === "international"
          ? " This rate applies to international students from outside Thailand and outside the Mekong Region." +
            " Foreign students from other regions and other countries pay this rate."
          : "";
      chunks.push({
        id: `tuition:${type.id}:${slug(period)}`,
        source: "tuition",
        title: `${type.label} tuition and fees — ${period}`,
        content_en:
          `${type.label} at Digital Media Engineering, Khon Kaen University. ` +
          `Tuition per semester: ${formatBaht(type.semesterFee)}. ` +
          `${period} breakdown: ${lines.join("; ")}.${thaiNote}${mekongNote}${intlNote}`,
        content_th: "",
        metadata: { studentType: type.id, period, semesterFee: type.semesterFee },
      });
    });
  });
  return chunks;
}

function staffChunks() {
  return LECTURERS.map((l) => ({
    id: `staff:${slug(l.name)}`,
    source: "staff",
    title: `${l.title} ${l.name}`,
    content_en:
      `${l.title} ${l.name} is a lecturer in the Department of Computer Engineering, which runs the DME program. ` +
      `Specialty: ${l.specialty}. Education: ${l.education}.` +
      (l.room ? ` Room: ${l.room}.` : "") +
      (l.profile ? ` Profile: ${l.profile}` : " Contact via the department directory at https://gear.kku.ac.th/index.php/staff?lang=en"),
    content_th: "",
    metadata: { name: l.name, specialty: l.specialty, profile: l.profile || null },
  }));
}

// Transcribed from src/pages/AboutDME.jsx, src/pages/Contact.jsx, and
// src/pages/CurriculumRoadmap.jsx. Those are JSX and cannot be imported by a
// plain Node script, and this task's scope does not permit editing them, so the
// copy is duplicated here. If that page copy changes, this must be updated too —
// there is no check that catches the drift.
const PAGE_CHUNKS = [
  {
    id: "page:about:what-is-dme",
    source: "page",
    title: "What is DME?",
    content_en:
      "Digital Media Engineering (DME) is an international undergraduate program at Khon Kaen University's Faculty of Engineering that blends software engineering fundamentals with digital media production — 3D/animation, interactive media, AI, and game/software development.",
    content_th: "",
    metadata: { page: "About DME" },
  },
  {
    id: "page:about:what-do-we-learn",
    source: "page",
    title: "What do DME students learn?",
    content_en:
      "Students build a foundation in programming, data structures, and computer graphics in Years 1-2, then specialize in Years 3-4 through elective tracks: AI, Digital Media, Interactive, or Software.",
    content_th: "",
    metadata: { page: "About DME" },
  },
  {
    id: "page:about:vision-mission",
    source: "page",
    title: "DME vision and mission",
    content_en:
      "To produce engineers who can design, build, and ship digital media products end-to-end — combining engineering rigor with creative and interactive media skills that the games, animation, and software industries need.",
    content_th: "",
    metadata: { page: "About DME" },
  },
  {
    id: "page:about:why-choose-dme",
    source: "page",
    title: "Why choose DME at KKU?",
    content_en:
      "DME-specific facilities (CDLC, Mac labs, VR/broadcast classrooms), an updated curriculum aligned with industry tools (Unity, Unreal, Adobe Suite, Figma, Blender), and a curriculum designed around 4 real specialization tracks rather than a generic CS degree.",
    content_th: "",
    metadata: { page: "About DME" },
  },
  {
    id: "page:contact:channels",
    source: "page",
    title: "Contact and admissions channels",
    content_en:
      "Faculty of Engineering, Khon Kaen University. Address: 123 Mittraphap Road, Nai Muang Sub-district, Muang District, Khon Kaen 40002, Thailand. " +
      "Faculty phone: +66 (0) 4300 9700 ext. 50215 or 45641. International Affairs Division (admissions and registration): +66 (0) 4320 2059. " +
      "Email: enforeign@kku.ac.th. Facebook: facebook.com/EngineeringKKU.",
    content_th: "",
    metadata: { page: "Contact" },
  },
  {
    id: "page:curriculum:overview",
    source: "page",
    title: "What you'll study in DME",
    content_en:
      "Digital Media Engineering students specialize in developing, implementing, and optimizing technology systems for creating, processing, delivering, and displaying digital content. " +
      "Core responsibilities: designing applications, implementing streaming technologies, developing interactive experiences, and building asset management systems. " +
      "Key competencies: audio/video programming, streaming protocols, interactive media development, user experience design, and virtual and augmented reality. " +
      "The program is 120 credits over 4 years on the Cooperative Education track: General Education 30, Basic Engineering 15, Core Engineering 36, Elective Engineering minimum 27, Field Experience 6, Free Elective minimum 6.",
    content_th: "",
    metadata: { page: "Curriculum Roadmap" },
  },
];

function buildChunks() {
  const courseIndex = buildCourseIndex();
  return [
    ...courseChunks(courseIndex),
    ...studyPlanChunks(),
    ...electiveTrackChunks(),
    ...tuitionChunks(),
    ...staffChunks(),
    ...PAGE_CHUNKS,
  ];
}

function restHeaders(key) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "content-type": "application/json",
  };
}

async function upsertChunks(url, key, chunks) {
  // PostgREST caps request size; 120 rows of course descriptions is comfortably
  // under it, but batching keeps that true if the corpus grows.
  const BATCH = 50;
  for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH).map((c) => ({ ...c, updated_at: new Date().toISOString() }));
    const res = await fetch(`${url}/rest/v1/kb_chunks?on_conflict=id`, {
      method: "POST",
      headers: { ...restHeaders(key), Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(batch),
    });
    if (!res.ok) {
      throw new Error(`kb_chunks upsert ${res.status}: ${(await res.text()).slice(0, 300)}`);
    }
  }
}

async function deleteStale(url, key, keepIds) {
  const res = await fetch(`${url}/rest/v1/kb_chunks?select=id`, { headers: restHeaders(key) });
  if (!res.ok) throw new Error(`kb_chunks select ${res.status}`);
  const existing = await res.json();
  const stale = existing.map((r) => r.id).filter((id) => !keepIds.has(id));
  if (!stale.length) return 0;

  // PostgREST in.() needs each value quoted — ids contain spaces and colons.
  const list = stale.map((id) => `"${id.replace(/"/g, '""')}"`).join(",");
  const del = await fetch(`${url}/rest/v1/kb_chunks?id=in.(${encodeURIComponent(list)})`, {
    method: "DELETE",
    headers: { ...restHeaders(key), Prefer: "return=minimal" },
  });
  if (!del.ok) throw new Error(`kb_chunks delete ${del.status}: ${(await del.text()).slice(0, 300)}`);
  return stale.length;
}

function reportCounts(chunks) {
  const bySource = chunks.reduce((acc, c) => {
    acc[c.source] = (acc[c.source] || 0) + 1;
    return acc;
  }, {});
  Object.entries(bySource)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([source, n]) => console.log(`  ${source.padEnd(16)} ${n}`));
  console.log(`  ${"TOTAL".padEnd(16)} ${chunks.length}`);
}

async function main() {
  const chunks = buildChunks();

  const ids = new Set();
  const duplicates = [];
  chunks.forEach((c) => {
    if (ids.has(c.id)) duplicates.push(c.id);
    ids.add(c.id);
  });
  if (duplicates.length) {
    throw new Error(`Duplicate chunk ids, would collide on the primary key: ${duplicates.join(", ")}`);
  }

  console.log("Chunks built:");
  reportCounts(chunks);

  if (DRY_RUN) {
    console.log("\n--dry-run: nothing written.");
    return;
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (or pass --dry-run).");
  }

  await upsertChunks(url, key, chunks);
  const deleted = await deleteStale(url, key, ids);
  console.log(`\nUpserted ${chunks.length} chunks, deleted ${deleted} stale.`);
}

main().catch((err) => {
  console.error(`[build-kb] ${err.message}`);
  process.exitCode = 1;
});
