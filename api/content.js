// Admin-editable site content — one handler for every content domain rather
// than a near-identical file per table.
//
// Mirrors api/admin/faqs.js: GET is public and reads with the anon key,
// mutations require the admin session cookie and write with the service role
// key, Supabase failures surface as 502 with a detail.
//
// `type` arrives as a query parameter rather than a path segment. It was
// api/content/[type].js, which works locally but is not routed by Vercel: in
// production every /api/content/<anything> fell through to the SPA rewrite and
// returned index.html with a 200, including paths that should have 400'd. The
// static function paths route fine, so it is the dynamic segment specifically.
// A query parameter needs only plain filesystem matching, which demonstrably
// works.
//
// It is never interpolated into SQL, a table name, or a column list — only ever
// used as a key into CONTENT_TYPES below, and anything not in that map is
// rejected before a request is built.

import { randomUUID } from "node:crypto";
import { readSession, sessionsDisabled, SESSIONS_DISABLED_MESSAGE } from "./_lib/session.js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, hasSupabase, hasSupabaseAdmin } from "./_lib/env.js";

const CONTENT_TYPES = {
  projects: {
    table: "site_projects",
    columns: ["title", "category", "image_url", "icon_name", "is_real", "description", "sort_order"],
    required: ["title", "category"],
  },
  news: {
    table: "site_news",
    columns: ["tag", "title", "image_url", "is_real", "description", "sort_order"],
    required: ["tag", "title"],
  },
  staff: {
    table: "site_staff",
    columns: ["name", "title", "education", "specialty", "photo_url", "profile_url", "room", "sort_order"],
    required: ["name"],
  },
  student_types: {
    table: "site_student_types",
    // `id` is a client-supplied text key here ('thai'), not a generated uuid, so
    // it is settable on create. It is stripped from updates below — the primary
    // key is the WHERE clause, never a column this endpoint patches.
    columns: ["id", "label", "semester_fee", "has_living_cost", "sort_order"],
    required: ["id", "label"],
  },
  courses: {
    table: "site_courses",
    // Keyed by course code, not a generated uuid. Settable on create, stripped
    // on update — see pk handling below.
    pk: "code",
    columns: ["code", "name", "credits", "description_en", "description_th", "prerequisites", "sort_order"],
    required: ["code", "name"],
  },
  study_plan: {
    table: "site_study_plan",
    columns: [
      "year",
      "semester_name",
      "total_accumulated",
      "course_code",
      "course_name",
      "credits",
      "course_type",
      "sort_order",
    ],
    required: ["year", "semester_name", "course_code", "course_name", "course_type"],
  },
  elective_courses: {
    table: "site_elective_courses",
    columns: ["track", "course_code", "course_name", "credits", "sort_order"],
    required: ["track", "course_code", "course_name"],
  },
  chat_misses: {
    table: "chat_misses",
    // Questions the chatbot could not answer. Not public: these are visitors'
    // own words, and chat_misses has no select policy, so the read goes through
    // the service role behind an admin session like the writes do.
    privateRead: true,
    // Rows are written by api/chat.js, never by hand. An admin reads the list
    // and dismisses entries once the gap is filled with an FAQ.
    methods: ["GET", "DELETE"],
    columns: ["question"],
    required: ["question"],
    order: "asked_at.desc",
  },
  fee_rows: {
    table: "site_fee_rows",
    columns: [
      "student_type_id",
      "period",
      "item",
      "item_type",
      "amount",
      "excluded_from_total",
      "sort_order",
    ],
    required: ["student_type_id", "period", "item", "item_type"],
  },
};

const BOOLEAN_COLUMNS = new Set(["is_real", "has_living_cost", "excluded_from_total"]);
const INTEGER_COLUMNS = new Set(["sort_order", "amount", "semester_fee", "year", "total_accumulated"]);
// Mirrors the CHECK constraints in migration 0013. These are figures a
// prospective student budgets against, so a typo must be rejected rather than
// coerced to something plausible.
const NON_NEGATIVE_COLUMNS = new Set(["amount", "semester_fee", "year", "total_accumulated"]);
const MAX_BULK_IDS = 200;

// Simulated store, mirroring api/admin/faqs.js: lets the admin UI be exercised
// with no Supabase configured.
//
// Hung off globalThis rather than held in a module-scope const because
// vite.config.js re-imports handlers with a cache-busting `?t=` query on every
// request, so module scope is re-evaluated per request and a plain `const`
// silently resets between the POST and the GET that reads it back. (api/admin/
// faqs.js has the same quirk: it hands out id `faq-7` on every create under
// `vite dev`.) On Vercel this behaves the same as module scope — one store per
// warm instance, shared with nobody.
//
// It starts empty rather than seeded, and every response from it is flagged
// `simulated: true`, which src/lib/contentClient.js treats as non-authoritative.
// The public pages therefore keep rendering their bundled static content — the
// alternative would be serving edits that exist in one serverless instance and
// not the next.
const SIM_STORE_KEY = Symbol.for("dme.content.simStore");
if (!globalThis[SIM_STORE_KEY]) {
  globalThis[SIM_STORE_KEY] = Object.fromEntries(Object.keys(CONTENT_TYPES).map((t) => [t, []]));
}
const simStore = globalThis[SIM_STORE_KEY];

function simList(type) {
  return [...simStore[type]].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
}

// Most tables key on a generated uuid `id`; site_courses keys on `code`. The
// endpoint has to know which column identifies a row before it can PATCH or
// DELETE one — hardcoding `id` silently 404s (or errors) on the others.
function pkOf(spec) {
  return spec.pk || "id";
}

function restHeaders(key) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "content-type": "application/json",
  };
}

/**
 * Keep only whitelisted columns and coerce them to the column's type.
 *
 * `partial` is set for PUT so that an omitted field means "leave it alone"
 * rather than "set it to empty".
 */
function pickColumns(spec, body, { partial }) {
  const row = {};
  const errors = [];
  spec.columns.forEach((col) => {
    if (!(col in body)) return;
    const raw = body[col];
    if (BOOLEAN_COLUMNS.has(col)) {
      row[col] = raw === true || raw === "true";
    } else if (INTEGER_COLUMNS.has(col)) {
      // Empty means "not supplied" rather than zero — clearing a number input
      // should not silently write 0 into a fee schedule.
      if (raw === "" || raw === null || raw === undefined) return;
      const n = Number(raw);
      if (!Number.isFinite(n)) {
        errors.push(`${col} must be a number`);
        return;
      }
      if (NON_NEGATIVE_COLUMNS.has(col) && n < 0) {
        errors.push(`${col} cannot be negative`);
        return;
      }
      row[col] = Math.trunc(n);
    } else {
      row[col] = raw === null || raw === undefined ? null : String(raw);
    }
  });

  if (errors.length) return { error: errors.join("; ") };

  if (!partial) {
    const missing = spec.required.filter(
      (col) => row[col] === undefined || !String(row[col]).trim()
    );
    if (missing.length) return { error: `Missing required field(s): ${missing.join(", ")}` };
  }
  return { row };
}

async function listRows(spec) {
  const url =
    `${SUPABASE_URL}/rest/v1/${spec.table}` +
    `?select=*&order=${encodeURIComponent(spec.order || "sort_order.asc,created_at.asc")}`;
  // A private table has no select policy, so the anon key would return nothing.
  const key = spec.privateRead ? SUPABASE_SERVICE_ROLE_KEY : SUPABASE_ANON_KEY;
  const res = await fetch(url, { headers: restHeaders(key) });
  if (!res.ok) throw new Error(`${spec.table} select ${res.status}`);
  return res.json();
}

async function insertRow(spec, row) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${spec.table}`, {
    method: "POST",
    headers: { ...restHeaders(SUPABASE_SERVICE_ROLE_KEY), Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`${spec.table} insert ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const rows = await res.json();
  return rows[0];
}

async function updateRow(spec, id, patch) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${spec.table}?${pkOf(spec)}=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { ...restHeaders(SUPABASE_SERVICE_ROLE_KEY), Prefer: "return=representation" },
    body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error(`${spec.table} update ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const rows = await res.json();
  return rows[0] || null;
}

// PostgREST in.() list. Each value is double-quoted with backslash escapes, so
// a code like "EN 843 402", or anything containing a comma, stays one value.
function inList(ids) {
  return ids.map((id) => `"${id.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`).join(",");
}

/** Delete by primary key. Returns how many rows actually went. */
async function deleteRows(spec, ids) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${spec.table}?${pkOf(spec)}=in.(${encodeURIComponent(inList(ids))})`,
    {
      method: "DELETE",
      headers: { ...restHeaders(SUPABASE_SERVICE_ROLE_KEY), Prefer: "return=representation" },
    }
  );
  if (!res.ok) throw new Error(`${spec.table} delete ${res.status}`);
  return (await res.json()).length;
}

export default async function handler(req, res) {
  const type = (req.query?.type || "").toString();
  const spec = CONTENT_TYPES[type];
  if (!spec) {
    res.status(400).json({ error: `Unknown content type: ${type || "(none)"}` });
    return;
  }

  if (spec.methods && !spec.methods.includes(req.method)) {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Public read. `simulated` tells the client the response carries no authority,
  // so it keeps rendering its bundled static fallback instead of blanking the
  // page — see src/lib/contentClient.js.
  if (req.method === "GET") {
    // A private table is admin-only even to read.
    if (spec.privateRead) {
      if (sessionsDisabled) {
        res.status(503).json({ error: SESSIONS_DISABLED_MESSAGE });
        return;
      }
      if (!readSession(req)) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }
    }
    if (!hasSupabase) {
      res.status(200).json({ items: simList(type), simulated: true });
      return;
    }
    try {
      const items = await listRows(spec);
      res.status(200).json({ items, simulated: false });
    } catch (err) {
      console.error(`[content] ${type} list failed:`, err.message);
      res.status(200).json({ items: [], simulated: true, note: "Content store unavailable." });
    }
    return;
  }

  if (sessionsDisabled) {
    res.status(503).json({ error: SESSIONS_DISABLED_MESSAGE });
    return;
  }
  if (!readSession(req)) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const useSupabase = hasSupabaseAdmin;

  try {
    if (req.method === "POST") {
      const { row, error } = pickColumns(spec, req.body || {}, { partial: false });
      if (error) {
        res.status(400).json({ error });
        return;
      }
      if (!useSupabase) {
        // Only synthesize an id for tables that actually have one; a
        // code-keyed table already carries its identifier in `row`.
        const generated = pkOf(spec) === "id" ? { id: randomUUID() } : {};
        const item = { ...generated, ...row, created_at: new Date().toISOString() };
        simStore[type].push(item);
        res.status(201).json({ item, simulated: true });
        return;
      }
      res.status(201).json({ item: await insertRow(spec, row), simulated: false });
      return;
    }

    if (req.method === "PUT") {
      const id = (req.body?.id || "").toString();
      if (!id) {
        res.status(400).json({ error: "id is required" });
        return;
      }
      const { row, error } = pickColumns(spec, req.body || {}, { partial: true });
      if (error) {
        res.status(400).json({ error });
        return;
      }
      // The primary key identifies the row; it is never a column to patch.
      // Without this, student_types (whose id is client-supplied on create)
      // would let a rename slip through and orphan its fee rows.
      delete row[pkOf(spec)];
      if (!useSupabase) {
        const idx = simStore[type].findIndex((r) => r[pkOf(spec)] === id);
        if (idx === -1) {
          res.status(404).json({ error: "Not found" });
          return;
        }
        simStore[type][idx] = { ...simStore[type][idx], ...row };
        res.status(200).json({ item: simStore[type][idx], simulated: true });
        return;
      }
      const item = await updateRow(spec, id, row);
      if (!item) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.status(200).json({ item, simulated: false });
      return;
    }

    if (req.method === "DELETE") {
      // `ids` (comma-separated) deletes several rows in one request: the
      // Unanswered tab clears a question asked four times as one entry. `id`
      // still works for a single row.
      const ids = (req.query?.ids ?? req.query?.id ?? "")
        .toString()
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (!ids.length) {
        res.status(400).json({ error: "id is required" });
        return;
      }
      // Capped so one request cannot become an unbounded filter.
      if (ids.length > MAX_BULK_IDS) {
        res.status(400).json({ error: `At most ${MAX_BULK_IDS} ids per request` });
        return;
      }
      if (!useSupabase) {
        const before = simStore[type].length;
        simStore[type] = simStore[type].filter((r) => !ids.includes(r[pkOf(spec)]));
        const deleted = before - simStore[type].length;
        if (!deleted) {
          res.status(404).json({ error: "Not found" });
          return;
        }
        res.status(200).json({ ok: true, deleted, simulated: true });
        return;
      }
      const deleted = await deleteRows(spec, ids);
      if (!deleted) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.status(200).json({ ok: true, deleted, simulated: false });
      return;
    }
  } catch (err) {
    console.error(`[content] ${type} ${req.method} failed:`, err.message);
    res.status(502).json({ error: "Content store write failed", detail: err.message });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
