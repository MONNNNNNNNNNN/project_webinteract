# DME Explorer

Interactive web guide to the Digital Media Engineering (DME) program at Khon Kaen
University, built for prospective and first-year students. Course project for
EN 842300 Interactive Web Programming.

## Purpose

Prospective and first-year DME students currently piece information together from
static faculty pages, PDF curriculum docs, and word of mouth. DME Explorer gives
them one interactive, up-to-date resource: curriculum roadmap, tuition calculator,
live job-market data, student project showcase, an AI FAQ chatbot, and a 3D
walkthrough of the CDLC facility.

## Finalized scope (read this before touching scope — don't re-derive from the PDFs)

The two source documents (`DME_Explorer_ProposalV2.pdf`, the original proposal, and
`Studio_4_Final_Report__A.pdf`, a prior semester's Studio 4 project used as a data
source) are **not** the current scope by themselves. The scope actually being built
is the original proposal **minus** the removal below **plus** the addition below:

- **Removed vs. the original proposal:** the alumni-stories feature is cut
  entirely — both the admin-managed alumni content and the "read alumni stories"
  student use case. Don't re-add an alumni admin panel or alumni page.
- **Added vs. the original proposal:** a Tuition & Fees page. Not in the original
  proposal at all — added based on the Studio 4 report (pages ~38-39). Data lives
  in `docs/reference/tuition-data.md`.
- **Curriculum categorization:** major electives use the Studio 4 report's
  4-category system — **AI / Digital Media / Interactive / Software** — because it
  matches the real KKU DME major-elective tracks (Studio 4 report pages ~15-19,
  25-27). Data lives in `docs/reference/curriculum-data.md`.
- **3D CDLC simulation:** originally planned as a separate static build from a
  teammate (Thanasoonton), embedded via `<iframe>` — that plan changed. It's now
  built directly in-app: `src/components/ThreeDViewer.jsx` (React Three Fiber),
  loading a `.glb` model from `public/3d/` with first-person walk controls
  (desktop: pointer-lock + WASD; touch: orbit/drag) rendered on the
  `src/pages/ThreeDWorld.jsx` route. The old iframe handoff doc
  (`docs/3d-integration-handoff.md`) and the `public/cdlc-sim/` directory it
  described are both deleted — that path is gone, not merely unused. The
  three.js/`@react-three/*` deps are React-18-pinned
  (`@react-three/fiber@^8`, `@react-three/drei@^9`) since fiber v9 needs React 19.

See `docs/demo-script.md` for how this all gets presented — it's a useful map of
which features are considered "high risk" for a live demo (JSearch API, the 3D
build) and already has fallback plans baked in.

## Tech stack

- **Frontend:** React 18 + Vite 5 + Tailwind CSS 3, React Router 6
- **Backend:** Vercel Serverless Functions (Node.js) under `api/`
- **Database:** Supabase / Postgres, migrations in `supabase/migrations/`
- **Hosting:** Vercel (Hobby tier — see `vercel.json`)
- **Version control:** GitHub

Two free-tier constraints worth remembering (from the original proposal, section 7):
Vercel Hobby functions have a 10-second execution timeout (which is why the
chatbot answers by retrieval rather than by calling a model — see below), and
Supabase free-tier projects pause
after 7 days of inactivity (manual restart needed before a demo after a break).

## Folder structure

```
api/                        Vercel serverless functions
  careers.js                 JSearch listings, cache-first (see Job caching below)
  chat.js                    ChatWidget answers via Claude, grounded in kb_chunks
  admin/                     login / logout / session / faqs CRUD
  content/[type].js          Generic CRUD over admin-editable tables (see below)
  _lib/                      env.js (key flags), session.js (HMAC cookie),
                             jobCache.js (Supabase job cache), mockData.js,
                             knowledgeBase.js (chatbot retrieval)
scripts/build-kb.js         Rebuilds the chatbot knowledge base from shared/
src/
  pages/                    One file per route
    Admin/                  Admin routes (live — Supabase Auth + session cookie)
      ContentManager.jsx      Generic table editor, driven by contentSchemas.js
      contentSchemas.js        One schema entry per admin-editable domain
  components/               Navbar, Footer, ChatWidget, ComingSoon, etc.
  lib/                      Static data modules (curriculumData.js, tuitionData.js,
                             staffData.js) that the real-content pages import as
                             seed/fallback — see Admin-editable content below —
                             plus careersCache.js (localStorage job cache) and
                             contentClient.js (useContent() hook for those tables)
supabase/
  migrations/                0001-0015: programs, courses, student_status,
                             fee_detail, faqs, job_cache, job_fetch_budget,
                             kb_chunks, site_projects/news/staff/tuition/curriculum,
                             search fixes + chat_misses (see Chatbot KB below)
  APPLY_ALL.sql               Generated bundle of a migration range for pasting into
                             the Supabase SQL Editor by hand. Regenerate by hand —
                             nothing keeps it in sync with new migration files.
docs/reference/             Extracted source data — read these instead of the PDFs
  curriculum-data.md         Full 4-year study plan + 4 elective-track course lists
  tuition-data.md            Full fee breakdown per student type / period
docs/proposal/, docs/project-report/   Course deliverables (EN 842300 proposal
                             slides, final report + Figma prototype assets)
public/3d/                  .glb model assets for ThreeDViewer
```

Everything else at repo root that isn't listed above or in `.gitignore`
(`history-docs/`, `network-review/`, `output/`, `study/`, `web-review/`,
`mindflux-*`, the `*.whl` files, the Kurose/Ross networking textbook PDF under
`docs/`, `skills-lock.json`, `claude-code-skills-workflow-reference.md`) is
scratch material from unrelated coursework sharing this working directory —
not part of DME Explorer, untracked, and not something to fix, reference, or
clean up unless asked.

## Data sourcing

`docs/reference/curriculum-data.md` and `docs/reference/tuition-data.md` were
transcribed directly from screenshots inside `Studio_4_Final_Report__A.pdf`
(pages 15-19, 25-27 for curriculum; 38-39 for tuition). **Read those markdown
files, not the PDF** — they're the source of truth for `shared/curriculumData.js`
and `shared/tuitionData.js`. A few course codes in the curriculum data are marked
`[unclear]` where the source screenshot was obscured by a UI tooltip or rendered
ambiguously at low resolution — flagged inline, verify against the official KKU
curriculum before publishing.

## Page status

**Real content, fully self-contained (no env vars needed):** Home, CurriculumRoadmap,
TuitionFees, AboutDME, Contact — all now sourced from real KKU data (see git log),
not the original placeholder/demo copy this section used to describe.
StudentProjects has a mix of real (marked "Real") and placeholder entries.
`ThreeDWorld.jsx` is a real, working first-person walkthrough (see 3D section above),
no env vars needed.

**Live but falls back to simulated data without a key:**
- `CareerExplorer.jsx` — needs `JSEARCH_API_KEY`, else shows simulated listings
- `ChatWidget.jsx` (floating component, not a route) — answers from `kb_chunks`
  when Supabase is configured, else from six built-in facts. Needs no provider
  key at all — see Chatbot knowledge base below

**Live against Supabase:** `Admin/AdminLogin.jsx` + `Admin/AdminDashboard.jsx`
authenticate through Supabase Auth and persist FAQs to Postgres. The demo
credential path in `api/admin/login.js` only engages when Supabase env vars are
absent, so it's unreachable in production.

## Job caching (Career Explorer)

RapidAPI's free JSearch tier is metered monthly and returns only ~10 listings per
call, so listings are cached in two places rather than fetched per page view:

- **Server** — `api/_lib/jobCache.js` writes into the `job_cache` table, which
  **accumulates**: each live fetch upserts on `(interest, id)`, so repeated
  refreshes build a larger pool than any single JSearch response. `job_fetch_meta`
  records the last live call per interest and enforces a 10-minute floor between
  them (a refresh inside that window is served from cache with an explanatory
  `note`). Cached lists are served untouched for 24 hours — that TTL is derived
  from the budget, not picked for freshness: `App.jsx` prefetches 5 buckets
  ("All" + 4 interests), so one live window per bucket per day is 5 × 30 = 150
  calls/month, which fits under `MONTHLY_LIVE_BUDGET` (170). A 6h TTL needed 600
  and exhausted the cap around day 9 of every month, freezing the cache for the
  rest of it. Change one of those numbers and you must change the other. Rows
  unseen for 30 days are pruned after a successful fetch. This layer is shared across all users —
  serverless functions are stateless, so process memory would not help.
- **Monthly ceiling** — `job_fetch_budget` plus the `consume_job_fetch_budget()`
  function cap live calls at `MONTHLY_LIVE_BUDGET` (170, under the BASIC plan's
  200). Spacing calls out is not the same as capping them: the plan ran dry under
  the 10-minute floor alone. The check-and-increment happens in one SQL statement
  so concurrent invocations can't both claim the last call, and the function is
  revoked from `anon`/`authenticated` so only the server can spend budget. If the
  budget can't be read the code fails *closed* — Supabase being down means the
  result couldn't be cached anyway, so a live call would be quota spent for
  nothing.
- **Browser** — `shared/careersCache.js` persists each interest's list to
  localStorage (30 min fresh, discarded after 7 days) so a reload or a return
  visit paints instantly and, inside the fresh window, makes no request at all.

The unfiltered "All" query is keyed under the sentinel `'all'`, not `''`, because
PostgREST's `?interest=eq.` with no value is ambiguous. `jobCache.js` maps it back
to `""` on the way out, so the sentinel never reaches the client.

## Chatbot knowledge base (RAG)

`api/chat.js` used to answer from ~15 lines of facts hardcoded into its system
prompt. It now retrieves from `kb_chunks`, so it can answer about a specific
course, lecturer, or fee row. Retrieval is Postgres full-text search — **no
embeddings, no pgvector, no embedding provider.** The corpus is ~120 chunks of
mostly exact-term queries, where FTS is competitive and costs nothing per query.

- **Ingestion** — `node scripts/build-kb.js` reads the `shared/*.js` data
  modules and upserts chunks keyed on a stable derived id (`course:EN 843 402`),
  deleting any row whose id it no longer produces. Idempotent; `--dry-run` builds
  and counts without touching the network. Needs `SUPABASE_SERVICE_ROLE_KEY`.
  **Re-run it after editing any file in `shared/`** — nothing does this
  automatically.
- **Two matchers, because Thai and English cannot share one.** English uses
  `to_tsvector('english', …)` + `ts_rank_cd` with normalization flag 32, which
  bounds the score to 0..1. Thai uses `pg_trgm`, because Postgres ships no Thai
  text-search config and Thai has no spaces between words, so `to_tsvector` would
  collapse a whole phrase into one dead token. Specifically `word_similarity()`
  / `<%`, not `similarity()` / `%`: the latter compares whole strings and
  collapses toward zero as lengths diverge, so a short question would never clear
  the threshold against a 400-character course description.
- **Course codes bypass ranking.** The `english` tokenizer shreds `EN 843 402`
  into `en`/`843`/`402`, which matches dozens of chunks and ranks the intended
  course nowhere. `knowledgeBase.js` regexes the message for a code and fetches
  that chunk by exact id, placing it at rank 1 regardless of what the ranker said.
- **`faqs` is unioned in at query time, not copied.** The admin dashboard edits
  those rows, so a copy would go stale on the first correction. This way an admin
  edit changes the chatbot immediately — no re-ingest, no redeploy.
- **Page copy is duplicated into `scripts/build-kb.js`.** The `facts`, `channels`,
  and curriculum-overview prose live in JSX, which a plain Node script cannot
  import. If that page copy changes, the script must be updated by hand; nothing
  catches the drift.
- **Generation is optional and sits in front of retrieval, never instead of it.**
  With `GEMINI_API_KEY` set, the retrieved chunks are handed to Gemini
  (`gemini-3.5-flash-lite` by default, free tier) to be phrased as prose. The
  model is never asked what it knows about DME — it gets the text and is told to
  decline anything the text does not cover, so it can rephrase a fee but cannot
  invent one. Without a key, or when Gemini is slow, rate-limited (429) or
  returns an empty candidate, the chunk is served verbatim and the response
  carries `generated: false`. Every path out of `api/chat.js` is a real answer;
  the model only changes how it reads. Budget is 8.5s total against Vercel's 10s
  kill, retrieval first, model gets the remainder, skipped below 2s left.
- **Retrieval alone still works.** `api/chat.js` returns the best-matching
  chunk's text verbatim; there is no generation step. That means it cannot invent
  a fee, a course code, or a lecturer, and it needs no API key, no budget cap, and
  no timeout juggling — measured 0.1–1.7s per answer. The cost is real: it cannot
  merge two chunks, cannot answer "compare the Mekong and international rates",
  and reads like documentation rather than conversation.
- **Confidence floor.** `MIN_SCORE = 0.12`. Below it, `search_kb` matched on an
  incidental shared word rather than the subject, so the reply is "I don't have
  that" plus the official contacts — better than confidently pasting an unrelated
  course description. An exact course-code hit is looked up rather than ranked and
  carries no score, so it is treated as fully confident.
- **Answers follow the question's language.** Any Thai character in the message
  selects `content_th` when the chunk has one.
- **`0015` fixed three things a real first run against student questions
  exposed.** `search_kb` ANDed every query term, so natural-language questions
  (multiple words, one of which doesn't match anything) returned nothing —
  fixed to OR terms and rank instead. English had no typo tolerance (only Thai
  had `pg_trgm`); `0015` adds a trigram index on `content_en` too, so "tuiton" /
  "leturer" now match. And a `chat_misses` table now logs every question that
  scored below `MIN_SCORE` with no admin-facing read policy — only the service
  role can read or write it — so unanswered questions are visible as a coverage
  signal instead of silently vanishing. It also seeds FAQ rows that closed the
  biggest gaps that first run found.

If a model is added later it belongs *in front of* this, not instead of it:
retrieval already works, and this stays as the fallback for when the model is
unreachable. Fallback ladder today: no Supabase → six built-in facts, flagged
`simulated: true`; nothing matched above the floor → an explicit "I don't know"
plus contacts. A user never sees a 500.

## Admin-editable content

Content that used to be a hardcoded array in a page is now a Supabase table the
admin dashboard can edit. Migrated so far: Student Projects and the Home news
carousel (`0011`), the lecturer directory (`0012`), tuition (`0013`), and the
curriculum — courses, study plan, elective tracks (`0014`). That is every
content domain; `shared/*.js` now serves only as seed and fallback.

`grandTotal()` in `shared/tuitionData.js` now takes `(rows, period)` rather than
`(statusId, period)`, so one function serves both the static `FEE_BREAKDOWN` and
rows from `site_fee_rows`. It reads either spelling of the exclusion flag.
Amounts are validated as non-negative integers in three places — the CHECK
constraint in `0013`, `pickColumns()` in the content endpoint, and the form —
because these are figures a prospective student budgets against.

- **The static array is still the source of truth for the seed and the runtime
  fallback.** `STATIC_PROJECTS` in `StudentProjects.jsx` and `STATIC_NEWS` in
  `Home.jsx` are still imported and still render first paint. `useContent()`
  (`shared/contentClient.js`) swaps in database rows only when the response is
  authoritative. Supabase free-tier projects pause after 7 days idle, so a paused
  project degrades to the site as built rather than to a blank page. Do not delete
  those arrays; if you edit one, update migration `0011` to match.
- **`simulated: true` means "not authoritative".** The client keeps its fallback.
  An authoritative empty list (`simulated: false, items: []`) *is* honoured — an
  admin who deleted every row meant it.
- **One endpoint, not one per table.** `api/content/[type].js` maps `type` through
  a whitelist to a table name and an allowed-column list. The path segment is
  never interpolated into a query, and unknown types are rejected before a request
  is built. Adding a domain is an entry there plus a schema in
  `src/pages/Admin/contentSchemas.js` — the admin UI renders itself from that.
- **Icons are names, not components.** A lucide component cannot round-trip
  through Postgres, so rows carry `icon_name` and `StudentProjects.jsx` resolves it
  through an explicit map. Unknown names render no icon rather than crashing.
- **Images are URL strings.** Vercel's runtime filesystem is read-only; there is no
  upload path.
- **The primary-key column is per-type.** Most tables key on a generated uuid
  `id`; `site_courses` keys on `code` and `site_student_types` on a text `id`.
  `pkOf(spec)` in the endpoint and `schema.idField` in the admin UI carry that —
  hardcoding `id` makes update and delete 404 or error on the odd ones out. The
  PK is stripped from every PATCH: it identifies the row, it is not a column to
  edit, and renaming a student type would orphan its fee rows.
- **`site_study_plan` and `site_elective_courses` denormalize name and credits.**
  They cannot join to `site_courses` for them: the study plan has 7 placeholder
  rows (`EN XX XXXX` four times with different credits, `XX XXXX`, `IC 011 10X`)
  and the elective tracks have 4 rows coded `EN [unclear]`. Those codes repeat,
  so they cannot be primary keys, and none have descriptions. The `[unclear]`
  markers mean "verify against the official curriculum before publishing" — they
  are load-bearing, not dirt.
- **Seed content with `node scripts/seed-content.js --apply`, not by pasting the
  migration SQL.** Pasting `0011`-`0014` into the Supabase SQL editor mangled
  every non-ASCII character: UTF-8 was decoded as CP1252 and re-encoded, so `—`
  became `â€”` and all 75 Thai course descriptions were corrupted beyond a clean
  round-trip (Thai bytes hit CP1252's undefined slots, so the mangling is lossy).
  93 rows were affected. `kb_chunks` came through clean because `build-kb.js`
  writes it over PostgREST from Node — which is exactly what `seed-content.js`
  now does for the content tables. The migrations remain the schema source of
  truth; treat their INSERTs as documentation.
  It is destructive for uuid-keyed tables (staff, fee rows, study plan, elective
  tracks are emptied and rewritten, losing admin edits); `site_courses` and
  `site_student_types` upsert in place.
- **Simulated stores hang off `globalThis`, not module scope.** `vite.config.js`
  re-imports handlers with a cache-busting `?t=` on every request, so a module-level
  `const` resets between the POST and the GET that reads it back.
  `api/admin/faqs.js` still has that quirk — under `vite dev` it hands out id
  `faq-7` on every create.

`vite.config.js` also resolves Vercel-style dynamic routes (`api/content/[type].js`)
in dev. Without that, the exact-file lookup misses, the middleware falls through,
and the SPA history fallback answers `/api/content/projects` with `index.html` —
a silent failure that looks like a broken fetch.

## Environment variables

See `.env.example`. Nothing is required for local dev — every page renders
without any env vars set, falling back to simulated listings / the hardcoded FAQ
where a provider key is missing. `JSEARCH_API_KEY` and the Supabase trio are
wired and live when present. The chatbot needs no provider key — it answers by
retrieval, not generation. Note `hasSupabaseAdmin` requires `SUPABASE_ANON_KEY` as well as
the service-role key, because the cache reads go through the anon role.
