# shared/

Plain data modules, imported by **both** the frontend and the ops scripts.
No React, no server code, no side effects — just exported constants and two
pure formatting helpers.

They live outside `src/` and `api/` because they are consumed from both
directions, and burying them in `src/lib/` hid that. `src/lib/` is now
browser-only.

Each file does three jobs:

| job | who reads it |
|---|---|
| seed the Postgres tables | `scripts/seed-content.js` |
| runtime fallback when Supabase is unreachable | `src/pages/*.jsx` |
| source of the chatbot's 119 knowledge chunks | `scripts/build-kb.js` |

**After editing anything here, re-run `node scripts/build-kb.js`** — otherwise
the pages update but the chatbot keeps answering from the previous version.

`curriculumData.js` marks a few course codes `[unclear]` where the source
screenshot was obscured. Those markers are load-bearing: they mean "verify
against the official curriculum before publishing". Do not tidy them away.
