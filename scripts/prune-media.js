// Delete files in the site-media bucket that no content row points at.
//
// Uploading and saving are two separate steps: the file goes to Storage the
// moment it is picked, and the row is written only when the admin presses Save.
// So an orphan is produced by the ordinary flow — pick a photo, change your
// mind, pick a different one — not just by deleting a row.
//
// Run:  node scripts/prune-media.js                 list what would go
//       node scripts/prune-media.js --apply         delete it
//       node scripts/prune-media.js --grace-hours 0 ignore the safety window
//
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.

const APPLY = process.argv.includes("--apply");
const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "site-media";

// Matches api/upload.js. A file outside these prefixes is not something this
// tool put there, so it is not something this tool should remove.
const FOLDERS = ["news", "projects", "staff", "misc"];

// Every column that can hold a media URL. Miss one and this deletes a file that
// is still on the site, so the list is explicit rather than inferred.
const REFERENCES = [
  ["site_news", ["image_url"]],
  ["site_projects", ["image_url"]],
  ["site_staff", ["photo_url"]],
  // FAQ answers are free text an admin might paste a URL into.
  ["faqs", ["question", "answer"]],
];

// An upload exists before the row that references it does. Without a window,
// running this while someone has a half-filled form open deletes the photo they
// just chose, and the form still holds a URL that now 404s.
function graceHours() {
  const i = process.argv.indexOf("--grace-hours");
  if (i === -1) return 24;
  const n = Number(process.argv[i + 1]);
  return Number.isFinite(n) && n >= 0 ? n : 24;
}

function headers(extra = {}) {
  return { apikey: KEY, Authorization: `Bearer ${KEY}`, "content-type": "application/json", ...extra };
}

async function call(method, path, body) {
  const res = await fetch(`${URL}/${path}`, {
    method,
    headers: headers(),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function listFolder(folder) {
  const out = [];
  // The list endpoint pages; a bucket that has been in use for a year will not
  // fit in one response.
  for (let offset = 0; ; offset += 100) {
    const rows = await call("POST", `storage/v1/object/list/${BUCKET}`, {
      prefix: folder,
      limit: 100,
      offset,
      sortBy: { column: "created_at", order: "asc" },
    });
    if (!rows?.length) break;
    rows.forEach((r) =>
      out.push({
        path: `${folder}/${r.name}`,
        size: r.metadata?.size ?? 0,
        createdAt: r.created_at ? Date.parse(r.created_at) : 0,
      })
    );
    if (rows.length < 100) break;
  }
  return out;
}

async function referencedPaths() {
  const referenced = new Set();
  for (const [table, columns] of REFERENCES) {
    const rows = await call("GET", `rest/v1/${table}?select=${columns.join(",")}`);
    for (const row of rows || []) {
      for (const col of columns) {
        const v = row[col];
        if (typeof v !== "string" || !v) continue;
        // Match the object path however the URL is written — public URL, signed
        // URL, or a bare path someone typed by hand.
        for (const m of v.matchAll(new RegExp(`${BUCKET}/([^\\s"'?)]+)`, "g"))) {
          referenced.add(decodeURIComponent(m[1]));
        }
      }
    }
  }
  return referenced;
}

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)}MB`;

async function main() {
  if (!URL || !KEY) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.");
  const grace = graceHours();
  const cutoff = Date.now() - grace * 3600 * 1000;

  const objects = (await Promise.all(FOLDERS.map(listFolder))).flat();
  const referenced = await referencedPaths();

  const orphans = objects.filter((o) => !referenced.has(o.path));
  const tooNew = orphans.filter((o) => o.createdAt > cutoff);
  const removable = orphans.filter((o) => o.createdAt <= cutoff);

  console.log(`  in bucket:    ${objects.length} files, ${mb(objects.reduce((n, o) => n + o.size, 0))}`);
  console.log(`  referenced:   ${objects.length - orphans.length}`);
  console.log(`  orphaned:     ${orphans.length}`);
  if (tooNew.length) {
    console.log(`  held back:    ${tooNew.length} newer than ${grace}h — may belong to an unsaved form`);
  }
  console.log(`  removable:    ${removable.length} files, ${mb(removable.reduce((n, o) => n + o.size, 0))}`);

  removable.slice(0, 20).forEach((o) => console.log(`     ${o.path}  ${mb(o.size)}`));
  if (removable.length > 20) console.log(`     … and ${removable.length - 20} more`);

  if (!removable.length) {
    console.log("\n  nothing to do.");
    return;
  }
  if (!APPLY) {
    console.log("\n  dry run — nothing deleted. Pass --apply to delete.");
    return;
  }

  await call("DELETE", `storage/v1/object/${BUCKET}`, { prefixes: removable.map((o) => o.path) });
  console.log(`\n  deleted ${removable.length} files, freed ${mb(removable.reduce((n, o) => n + o.size, 0))}.`);
}

main().catch((err) => {
  console.error(`[prune-media] ${err.message}`);
  process.exitCode = 1;
});
