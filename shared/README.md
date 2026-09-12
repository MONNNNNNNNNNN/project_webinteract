# shared/

Modules imported by **both** the frontend and the ops/server code. No React, no
network, no side effects.

They live outside `src/` and `api/` because they are consumed from both
directions, and burying them in `src/lib/` hid that. `src/lib/` is now
browser-only.

| file | job |
|---|---|
| `curriculumData.js`, `courseDescriptions.js`, `tuitionData.js`, `staffData.js` | seed data and runtime fallback |
| `locations.js` | the rooms, for Contact (map) and 3D World (models) |
| `kbChunks.js` | the chatbot's chunk builder, plus `staticRows()` |

The four data files do two jobs:

| job | who reads it |
|---|---|
| seed the Postgres tables | `scripts/seed-content.js`, via `staticRows()` |
| runtime fallback when Supabase is unreachable | `src/pages/*.jsx` |

**The live site does not render these files. It renders the `site_*` tables.**
Editing a file here changes the fallback only. Live content is changed in the
admin dashboard, and re-seeding from these files overwrites those edits.

The chatbot's 119 knowledge chunks are built from the tables by `kbChunks.js`,
so they match the pages. Saving in the admin dashboard rebuilds them
automatically. After re-seeding from these files, run `node scripts/build-kb.js`.
`build-kb.js --dry-run` builds from these files instead, for a count with no
network.

`curriculumData.js` marks a few course codes `[unclear]` where the source
screenshot was obscured. Those markers are load-bearing: they mean "verify
against the official curriculum before publishing". Do not tidy them away.
