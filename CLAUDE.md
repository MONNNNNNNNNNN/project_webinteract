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
chatbot retrieves first and treats model phrasing as optional, inside an 8.5s
budget — see below), and Supabase free-tier projects pause after 7 days of
inactivity (manual restart needed before a demo after a break).

## Folder structure

```
api/                        Vercel serverless functions
  careers.js                 JSearch listings, cache-first (see Job caching below)
  chat.js                    ChatWidget: retrieves from kb_chunks, optionally
                             phrased by Gemini (see Chatbot KB below)
  content.js                 Generic CRUD over admin-editable tables, ?type=
  upload.js                  Signed one-shot upload URL for the site-media bucket
  admin/                     login / logout / session / faqs CRUD / rebuild-kb
  _lib/                      env.js (key flags), session.js (HMAC cookie + admin
                             allowlist), jobCache.js (Supabase job cache),
                             mockData.js, knowledgeBase.js (retrieval),
                             gemini.js (optional phrasing), kbSync.js (writes
                             kb_chunks)
shared/                     Static content modules (seed + page fallback) and
                             kbChunks.js, the chatbot's chunk builder
scripts/                    build-kb.js (site_* tables -> kb_chunks),
                             seed-content.js, prune-media.js
src/
  pages/                    One file per route
    Admin/                  Admin routes (live — Supabase Auth + session cookie)
      ContentManager.jsx      Generic table editor, driven by contentSchemas.js
      contentSchemas.js        One schema entry per admin-editable domain
  components/               Navbar, Footer, ChatWidget, MediaView, etc.
  lib/                      Browser-side helpers only. careersCache.js
                             (localStorage job cache), contentClient.js
                             (useContent() hook), media.js (image vs video by
                             URL), topicIcons.js (the site's icon vocabulary —
                             see Icons below). The static data modules these
                             pages fall back to live in shared/, not here.
supabase/
  migrations/                0001-0016: programs, courses, student_status,
                             fee_detail, faqs, job_cache, job_fetch_budget,
                             kb_chunks, site_projects/news/staff/tuition/curriculum,
                             search fixes + chat_misses (see Chatbot KB below),
                             the site-media Storage bucket
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
authenticate through Supabase Auth and persist content to Postgres. The demo
credential path in `api/admin/login.js` only engages when Supabase env vars are
absent, so it's unreachable in production.

**Supabase Auth is not the admin check — `ADMIN_EMAILS` is.** A password grant
only proves who someone is, and sign-ups are open on the project, so without the
allowlist any registered account got full write access. `isAdminEmail()` in
`api/_lib/session.js` runs at login *and* on every request, so removing an
address revokes its live sessions. In production and preview, an unset
`ADMIN_EMAILS` (or `SESSION_SECRET`) makes every admin route fail closed with 503.
Local dev with no list accepts any account. Closing sign-ups in the Supabase
dashboard is the second layer, not a substitute.

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
- **Paced, not just capped** — `api/careers.js` passes `pacedBudgetLimit()`
  (`ceil(170 × day / daysInMonth) + 5`) as the function's `p_limit` instead of
  170. A cap alone let the refresh button spend 30 calls an hour and empty the
  month in about six hours. Pacing caps any burst at the day's share. Scheduled use
  (5/day) stays under the paced limit on every day of every month (checked over 36
  months), so the TTL path is never blocked.
- **`interest` is a closed set** — anything outside `INTEREST_QUERY_TERMS` gets
  400. Each interest is its own bucket, and an unseen bucket has no cache, so an
  open value let `?interest=a1`, `a2`, … each spend a live call.
- **Browser** — `src/lib/careersCache.js` persists each interest's list to
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

- **Ingestion reads the tables the pages render.** `shared/kbChunks.js` builds
  chunks from `site_*` rows. They are keyed on a stable derived id
  (`course:EN 843 402`), and any row whose id is no longer produced is deleted.
  It used to read `shared/*.js`, so an admin's fee correction reached the
  Tuition page but never the chatbot.
- **It rebuilds automatically on every save.** Every admin save or delete on a
  table the chatbot reads runs `rebuildKnowledge()` (`api/_lib/kbSync.js`) in
  the same request, with whatever remains of an 8.5s budget. The tables are
  courses, study plan, elective tracks, student types, fee rows and staff
  (`FEEDS_CHATBOT` in `api/content.js`).
  - The response carries `kb: { ok, … }`.
  - A failed rebuild never fails the save. The tab shows an amber warning with
    **Retry** (`POST /api/admin/rebuild-kb`).
  - It replaced a manual "Rebuild chatbot knowledge" button that people forgot
    to press.
  - Measured ~0.5s of reads plus three upserts per save.
  - Two saves racing can finish their rebuilds out of order. The next save or a
    Retry fixes it.
  - `node scripts/build-kb.js` runs the same code from a terminal. It is only
    needed after writing the tables some other way, i.e. after
    `seed-content.js`. `--dry-run` builds from `shared/` via `staticRows()`
    with no network. Every path is idempotent.
  An all-empty read is refused ("never seeded"). One empty table is honoured.
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
- **Page copy is duplicated into `shared/kbChunks.js`.** The `facts`, `channels`,
  and curriculum-overview prose live in JSX, which a plain Node module cannot
  import. If that page copy changes, `PAGE_CHUNKS` must be updated by hand;
  nothing catches the drift.
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
- **Retrieval alone still works.** With no `GEMINI_API_KEY` (or Gemini down),
  `api/chat.js` returns the best-matching chunk's text verbatim. That path cannot
  invent a fee, a course code, or a lecturer — measured 0.1–1.7s per answer. The
  cost: it cannot merge two chunks or answer "compare the Mekong and international
  rates", and it reads like documentation rather than conversation. With a key,
  a weak first retrieval (below `STRONG_SCORE`) also gets one model-rewritten
  retry. The rewrite is kept only if it scores better.
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
- **Unanswered questions become FAQs from the dashboard.**
  `src/pages/Admin/UnansweredManager.jsx` renders the Unanswered tab. It groups
  duplicate misses, most-asked first ("asked 4×"). **Answer** opens a form, and
  publishing writes an FAQ and clears every copy of the question in one request
  (`DELETE /api/content?type=chat_misses&ids=a,b,c`). FAQs are unioned live, so
  the chatbot answers from the next message, with no rebuild.
- **Gemini drafts an FAQ answer only from retrieval, never from its own
  knowledge.** `POST /api/admin/draft-answer` runs `searchKnowledge()` exactly
  as for a visitor and hands Gemini only those chunks. `DRAFT_PROMPT` in
  `gemini.js` makes it write `[ADMIN: what is needed]` for any fact it cannot
  find, instead of guessing. For "Where is the canteen?" the knowledge base has
  nothing, so a free drafter would invent a building. `shared/faqDraft.js`
  detects the placeholder. Publish stays disabled while one remains, and
  `api/admin/faqs.js` refuses one on every POST/PUT, even from the plain FAQ tab
  or a hand-made request. The button shows only when the session reports
  `canDraft` (a session exists and `GEMINI_API_KEY` is set). All three Gemini
  uses share `callGemini()`, which never throws and returns `{ text, reason }`.
  That lets the draft endpoint tell the admin *why* (rate limit, timeout, empty)
  where the chatbot just falls back silently.
- **Vercel Hobby allows 12 functions; this uses 10.** chat, careers, content,
  upload, and admin login/logout/session/faqs/rebuild-kb/draft-answer. Fold the
  next endpoint into an existing one rather than add a file.

Fallback ladder: no Supabase → six built-in facts, flagged `simulated: true`;
nothing matched above the floor → an explicit "I don't know" plus contacts;
matched but Gemini unavailable → the chunk verbatim. A user never sees a 500.
Replies separate paragraphs with blank lines; `ChatWidget` renders them with
`whitespace-pre-line`.

## Icons

`src/lib/topicIcons.js` is the whole site's icon vocabulary — elective tracks,
credit categories, career interests, student types, fee rows, company avatars.
It is one file on purpose: "AI" has to be the same purple brain on the
Curriculum tracks and on a job card, or the icons stop being a language and go
back to being decoration. Add a subject there, not next to the page that needs
it.

- **Every resolver has a fallback.** Fee rows, project `icon_name` and student
  types are all admin-editable free text, so an unrecognised value resolves to a
  generic icon or the category's own — never to a hole in the layout.
- **`companyAvatar()` derives its color from the company name, not the list
  position.** Career Explorer re-sorts on every filter change, and a tile that
  changes color when it moves reads as a different company. It takes the first
  *letter* of each word rather than the first character, because names arrive
  with punctuation attached — "Buono (Thailand) Public Company Limited"
  initialled as `B(` before that.
- **A stretched `<button>` needs `flex flex-col`, not `block`.** Chrome centres
  a button's content vertically once it has a height, and `h-full` in a grid row
  gives it one — so a card shorter than its row floated its image off the top
  edge. Hit the Student Projects cards, the year cards and the credit cards.

## Admin-editable content

Content that used to be a hardcoded array in a page is now a Supabase table the
admin dashboard can edit. Migrated so far: Student Projects and the Home news
carousel (`0011`), the lecturer directory (`0012`), tuition (`0013`), and the
curriculum — courses, study plan, elective tracks (`0014`). That is every
content domain; `shared/*.js` now serves only as seed and fallback. Editing a
file in `shared/` changes nothing on the live site until someone re-seeds, and
re-seeding overwrites admin edits. Change live content in the dashboard.

`grandTotal()` in `shared/tuitionData.js` now takes `(rows, period)` rather than
`(statusId, period)`, so one function serves both the static `FEE_BREAKDOWN` and
rows from `site_fee_rows`. It reads either spelling of the exclusion flag.
Amounts are validated as non-negative integers in three places — the CHECK
constraint in `0013`, `pickColumns()` in the content endpoint, and the form —
because these are figures a prospective student budgets against.

- **The static array is still the source of truth for the seed and the runtime
  fallback.** `STATIC_PROJECTS` in `StudentProjects.jsx` and `STATIC_NEWS` in
  `Home.jsx` are still imported and still render first paint. `useContent()`
  (`src/lib/contentClient.js`) swaps in database rows only when the response is
  authoritative. Supabase free-tier projects pause after 7 days idle, so a paused
  project degrades to the site as built rather than to a blank page. Do not delete
  those arrays; if you edit one, update migration `0011` to match.
- **`simulated: true` means "not authoritative".** The client keeps its fallback.
  An authoritative empty list (`simulated: false, items: []`) *is* honoured — an
  admin who deleted every row meant it.
- **One endpoint, not one per table.** `api/content.js?type=…` maps `type` through
  a whitelist to a table name and an allowed-column list. It is never
  interpolated into a query, and unknown types are rejected before a request is
  built. It was `api/content/[type].js` once; that worked under `vite dev`, but
  Vercel never routed the dynamic segment and served `index.html` with a 200
  instead. The dev middleware now resolves exact files only, so the next dynamic
  route fails locally too. Adding a domain is an entry there plus a schema in
  `src/pages/Admin/contentSchemas.js` — the admin UI renders itself from that.
- **The form's row key is locked while editing.** `ContentManager` sends
  `{ ...values, id: editingId }` and renders the `idField` input read-only. The
  reverse spread let a student type's editable Key field redirect the PUT, which
  rewrote a *different* row. Deletes ask for confirmation.
- **Icons are names, not components.** A lucide component cannot round-trip
  through Postgres, so rows carry `icon_name` and `StudentProjects.jsx` resolves it
  through an explicit map. Unknown names fall back to the category's icon.
- **Media are URL strings — image or video in the same column.** Nothing records
  which, so `MediaView` picks `<img>` or `<video>` from the extension
  (`src/lib/media.js`). Every public page rendered `<img>` before, so an uploaded
  video showed as a broken image.
- **Admin media uploads go browser -> Supabase Storage, not through Vercel.**
  `api/upload.js` checks the admin session and returns a one-shot signed URL for
  the `site-media` bucket; the browser PUTs the file straight there. Routing the
  bytes through the function would cap uploads at Vercel's ~4.5MB request body,
  which a phone video clears in seconds. The service role key never leaves the
  server — the browser only ever holds a token scoped to one object path.
  Filenames are generated, never taken from the client, and the extension comes
  from the validated MIME type rather than the supplied name. Limits: 50MB, and
  JPG/PNG/WebP/GIF/AVIF/MP4/WebM/MOV, enforced both in the endpoint and on the
  bucket. The bucket was dashboard-only config until `0016` (values read back
  from the live project). Free-tier Storage is 1GB total, so video will consume it
  quickly.
- **Uploads outlive the rows that point at them.** A file reaches Storage the
  moment it is picked; the row is written only on Save. Picking a photo and then
  changing your mind leaves an orphan through the ordinary flow, not just by
  deleting a row. `node scripts/prune-media.js` lists them, `--apply` deletes.
  It skips anything newer than 24h by default, because an upload with no row yet
  is indistinguishable from an upload for a form still open on someone's screen.
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

## Environment variables

See `.env.example`. Nothing is required for local dev — every page renders
without any env vars set, falling back to simulated listings / the hardcoded FAQ
where a provider key is missing. `JSEARCH_API_KEY` and the Supabase trio are
wired and live when present. `GEMINI_API_KEY` is optional: without it the chatbot
answers verbatim from retrieval. Note `hasSupabaseAdmin` requires
`SUPABASE_ANON_KEY` as well as the service-role key, because the cache reads go
through the anon role.

**Required in production and preview:** `SESSION_SECRET` and `ADMIN_EMAILS`.
Without either, every admin route fails closed with 503. `.env.example` does not
list `ADMIN_EMAILS` yet (the file is edit-protected for Claude). Add it by hand.

The Supabase keys are the new format (`sb_publishable_…` / `sb_secret_…`), not
JWTs; the gateway mints a short-lived JWT per request. One parallel read once got
a transient `PGRST303 "JWT issued at future"` (gateway clock skew). It did not
reproduce over 32 further parallel requests. Retry before debugging.
