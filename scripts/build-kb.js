// Ingestion for the RAG chatbot's knowledge base (see
// supabase/migrations/0010_kb_chunks.sql).
//
// Reads the site_* content tables — what the pages actually render — turns
// them into retrievable chunks, and upserts them into kb_chunks. Admin saves
// already do this automatically (api/content.js); run this after writing the
// tables some other way, which in practice means after scripts/seed-content.js.
//
// Run:  node scripts/build-kb.js            site_* tables -> kb_chunks
//       node scripts/build-kb.js --dry-run  builds from shared/ and counts, no network
//
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment. The
// service role key is used because kb_chunks has no write policy — see the
// migration.

import { buildChunks, staticRows } from "../shared/kbChunks.js";
import { rebuildKnowledge, countBySource } from "../api/_lib/kbSync.js";

const DRY_RUN = process.argv.includes("--dry-run");

function report(bySource) {
  const entries = Object.entries(bySource).sort(([a], [b]) => a.localeCompare(b));
  entries.forEach(([source, n]) => console.log(`  ${source.padEnd(16)} ${n}`));
  console.log(`  ${"TOTAL".padEnd(16)} ${entries.reduce((sum, [, n]) => sum + n, 0)}`);
}

async function main() {
  if (DRY_RUN) {
    console.log("Chunks built from shared/:");
    report(countBySource(buildChunks(staticRows())));
    console.log("\n--dry-run: nothing read or written.");
    return;
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (or pass --dry-run).");
  }

  const { upserted, deleted, bySource } = await rebuildKnowledge({ url, key });
  console.log("Chunks built from the site_* tables:");
  report(bySource);
  console.log(`\nUpserted ${upserted} chunks, deleted ${deleted} stale.`);
}

main().catch((err) => {
  console.error(`[build-kb] ${err.message}`);
  process.exitCode = 1;
});
