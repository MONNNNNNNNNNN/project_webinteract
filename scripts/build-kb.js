// Ingestion for the RAG chatbot's knowledge base (see
// supabase/migrations/0010_kb_chunks.sql).
//
// Reads the site_* content tables — what the pages actually render — turns
// them into retrievable chunks, and upserts them into kb_chunks. It used to
// read shared/*.js instead, so an admin's correction reached the page but never
// the chatbot. The dashboard's "Rebuild chatbot knowledge" button runs the same
// code (api/admin/rebuild-kb.js); this is the terminal equivalent.
//
// Run:  node scripts/build-kb.js            site_* tables -> kb_chunks
//       node scripts/build-kb.js --dry-run  builds from shared/ and counts, no network
//
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment. The
// service role key is used because kb_chunks has no write policy — see the
// migration.

import { buildChunks, staticRows } from "../shared/kbChunks.js";
import { readContentRows, syncChunks, countBySource } from "../api/_lib/kbSync.js";

const DRY_RUN = process.argv.includes("--dry-run");

function report(chunks) {
  Object.entries(countBySource(chunks))
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([source, n]) => console.log(`  ${source.padEnd(16)} ${n}`));
  console.log(`  ${"TOTAL".padEnd(16)} ${chunks.length}`);
}

async function main() {
  if (DRY_RUN) {
    const chunks = buildChunks(staticRows());
    console.log("Chunks built from shared/:");
    report(chunks);
    console.log("\n--dry-run: nothing read or written.");
    return;
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (or pass --dry-run).");
  }

  const chunks = buildChunks(await readContentRows({ url, key }));
  console.log("Chunks built from the site_* tables:");
  report(chunks);

  const { upserted, deleted } = await syncChunks({ url, key, chunks });
  console.log(`\nUpserted ${upserted} chunks, deleted ${deleted} stale.`);
}

main().catch((err) => {
  console.error(`[build-kb] ${err.message}`);
  process.exitCode = 1;
});
