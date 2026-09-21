# IWP26-XX — DME Explorer
### Progress Presentation Slide Content — EN 842300 Interactive Web Programming

> **Fill in before presenting:** group number (`XX`), advisor name, presentation
> date, and Thanasoonton's task list + the % split on Slide 11. Everything else is
> ready to paste.
>
> **Budget: 10 minutes + 3 min Q&A.** 15 slides. Seconds are marked per slide and
> total 9:25, leaving ~35s of slack. Slides 4, 5 and 9 are visual — talk over the
> screenshots, do not read them.
>
> **Screenshots** are in `docs/progress/screenshots/`, captured from production at
> 1440px (desktop, @2x) and 390px (mobile, @3x). Filenames are named per slide below.
>
> **Font rule for whoever builds the slides:** body text ≥ 20pt, table text ≥ 18pt,
> code ≥ 16pt. Never shrink text to fit — cut words instead. Screenshots must be
> cropped to the region being discussed, not pasted full-page and scaled down.

---

## Slide 1 — Cover  *(15s)*

**DME Explorer**
*An Interactive Web Guide to Digital Media Engineering at Khon Kaen University*

- Group IWP26-XX
- Amon Oswald Hackl — 673040671-2
- Thanasoonton Chewakietyingyong — 673040460-5
- EN 842300 Interactive Web Programming · Advisor: [name]
- **Live:** https://dmeexplorer.vercel.app

> **Say:** "Everything you'll see today is deployed and public — you can open it on
> your phone while we present."

---

## Slide 2 — Agenda  *(10s)*

Where we are → Interface → Functions & APIs → Live demo → Team & GitHub →
Gen AI usage → What's next

> **Say:** One sentence. "Progress, interface, a live demo, then how we worked."

---

## Slide 3 — Where we are against the proposal  *(45s)*

| Proposed feature | Status | Note |
|---|---|---|
| Curriculum Roadmap | **Done** | 75 courses, 4-year plan, 4 elective tracks |
| Tuition & Fees | **Done** | 3 student types × 2 periods, live from the database |
| Career Explorer | **Done** | Live JSearch listings, cached and quota-capped |
| Student Projects | **Done** | Real entries marked "Real", placeholders labelled |
| 3D CDLC Walkthrough | **Done** | In-browser, first-person; DME Lab marked "soon" |
| AI FAQ Assistant | **Done** | Retrieval over 119 knowledge chunks + optional Gemini |
| Admin Panel | **Done** | 10 content tabs, authenticated, live on Postgres |

**Three scope decisions we own:**
1. **Alumni stories cut** — we could not verify or maintain personal narratives.
2. **Tuition & Fees added** — not in the original proposal; it answers the question
   that decides applications.
3. **3D moved in-app** — the proposal planned a separate build embedded in an
   `<iframe>`; it is now React Three Fiber inside the app, so it shares the
   navigation, styling and deploy.

> **Say:** "Seven of seven features are built and deployed. The interesting part is
> the three things we changed our minds about." Then land decision 3.

---

## Slide 4 — Interface: desktop  *(60s)*

**Insert:** `desktop-home.png`, `desktop-curriculum-tracks.png`, `desktop-tuition-international-4y.png`

Three things to point at:

- **One icon vocabulary, one file.** `src/lib/topicIcons.js` defines every icon the
  site uses — elective tracks, credit categories, career interests, student types,
  fee rows. "AI" is the same purple brain on the Curriculum page and on a job card.
  When a subject looks the same everywhere, icons become a language instead of
  decoration.
- **Every page carries real KKU data**, not lorem ipsum: 75 real courses with Thai
  and English descriptions, the real fee structure, 19 real lecturers.
- **Dark mode throughout**, chosen by the OS, with no flash of the wrong theme on
  load (the theme is applied before React mounts).

> **Say:** Pick the Curriculum tracks screenshot. "Same four track colours and icons
> appear on the job listings page — that consistency is deliberate, it's one file."

---

## Slide 5 — Interface: responsive  *(45s)*

**Insert:** `desktop-home.png` beside `mobile-home.png`, plus `mobile-nav-open.png`

| Width | What changes |
|---|---|
| ≥1024px | Full navigation bar with an animated active-page indicator |
| <1024px | Navigation collapses to a menu button; the indicator is dropped, not shrunk |
| Tables | Fee tables scroll horizontally instead of squeezing columns |
| Grids | 3 columns → 2 → 1 (projects, courses, job cards) |
| 3D page | Desktop uses pointer-lock + WASD; **touch devices switch to drag-to-look and pinch-to-zoom** — detected at runtime, because a walk control with no keyboard is unusable |

**Why it matters here:** most prospective students browse on a phone. Mobile is the
primary case, not an afterthought.

> **Say:** Hold up your phone with the live site open. One sentence on the 3D
> control switch — it's the detail that shows responsiveness was designed, not just
> a CSS breakpoint.

---

## Slide 6 — Template 32 in action: the admin layout  *(45s)*

**Prompt (Template 32 — Interface Layout), used verbatim:**

> "Suggest a user interface layout for an **admin content management screen** in a
> **React web application** that needs to include these features: *list existing
> rows, create, edit and delete, across 10 different content types (courses, fees,
> staff, news, projects…), with validation and a clear save state.*"

| AI suggested | We shipped | Why we changed it |
|---|---|---|
| A separate screen per content type | **One screen, 10 tabs** | Ten near-identical screens is ten places for a bug to hide |
| Hand-written form per type | **Forms render from a schema** (`contentSchemas.js`) | Adding a content type is now a ~15-line schema entry, no new UI code |
| A modal per edit | Inline form above the list | On a phone, a modal over a list hides the thing you're editing |
| "Delete" button | Delete **with confirmation** | There is no undo on a fee row |

**Kept from the AI:** the tab grouping, the list-above-form ordering, and the
"simulated / persisted" status line.

> **Say:** "We used the layout as inspiration, exactly as the template says — the
> structural change from ten screens to one schema-driven screen was ours."

---

## Slide 7 — Main functions and API integration  *(75s)*

**Four integrations, each with a fallback designed at the same time:**

| Integration | What it does | What happens when it fails |
|---|---|---|
| **JSearch** (RapidAPI) | Live job listings per interest track | Serves the accumulated cache, then representative listings — the page never breaks |
| **Supabase / PostgREST** | All content: courses, fees, staff, projects | Pages fall back to the data bundled at build time |
| **Google Gemini** (optional) | Phrases the chatbot's retrieved text as prose | Serves the retrieved text verbatim — still a real answer |
| **Supabase Storage** | Admin image/video upload | Browser uploads directly via a one-shot signed URL |

**The engineering worth showing — the job quota:**
the free tier allows 200 calls/month. Our budget is **170**, and calls are **paced
pro-rata**: a day can only spend `ceil(170 × day ÷ days_in_month) + 5`.

- Without pacing, the refresh button alone could spend 30 calls an hour and empty
  the month in about six hours.
- Three cache layers sit in front of it: browser localStorage (30 min) → shared
  server cache (24 h) → a 10-minute floor between live calls.
- The cache **accumulates**: each live call adds to the pool rather than replacing
  it, so the list grows over time instead of resetting.

**Real API data is messy — and we found it while making these slides.** JSearch
aggregates job boards, so one opening comes back under several ids: the
"3D & Animation" filter was showing **14 cards for 2 real jobs**. Ids can't detect
it — they genuinely differ — so the server now collapses by title + company. All
five filters are duplicate-free as of this deploy.

> **Say:** "Any project can call an API. The part we're proud of is that this one
> cannot run out of quota before the month ends." Give the six-hours line.

---

## Slide 8 — Feature built with Template 15: Unanswered → FAQ  *(60s)*

**The gap:** the chatbot logs every question it could not answer. Until last week
an admin could only read that list.

**Prompt (Template 15 — Feature Implementation Request), abbreviated:**

> "I need to implement **turning logged unanswered questions into published FAQs**
> for my **React + Vercel serverless + Supabase web app**. Requirements: group
> duplicate questions; publishing writes an FAQ and clears every copy; it must
> integrate with the existing `chat_misses` table and `faqs` table which the
> chatbot's search already reads live. Technical constraints: 10-second function
> limit, free-tier Gemini. Please provide: implementation approach, code with
> comments, edge cases, and how to test it."

**What shipped:**
- Duplicates grouped, most-asked first — "Do you have a swimming pool?" logged 4×
  shows once as *asked 4×*, and one click dismisses all four.
- **Answer → publish** writes the FAQ, which the chatbot uses on the *next message*
  — FAQs are read live, so no rebuild and no redeploy.
- **Gemini drafts the answer, but only from what the knowledge base already holds.**
  Any fact it cannot find comes back as `[ADMIN: …]`, and publishing is blocked
  while a placeholder remains — enforced in the browser *and* on the server.

**The edge case the template asked for, and it mattered:** asked "Where is the
canteen?", an unconstrained model would invent a building. Ours returned
`[ADMIN: building and floor]`. That is the difference between a demo and something
a real student can be shown.

> **Say:** This is the strongest slide. Land the canteen example.

---

## Slide 9 — Live demo  *(120s)*

**Fixed click order — rehearse exactly this:**

1. **Home** → scroll the news carousel *(10s)*
2. **Curriculum** → Course → Year 1 → open a course → show the Thai + English
   description from the official curriculum document *(25s)*
3. **Tuition** → International → Full 4 Years → the total recalculates *(20s)*
4. **Careers** → **Software** (34 live listings) → point at a real posting *(20s)*
5. **3D World** → walk three steps inside the CDLC *(20s)*
6. **Chatbot** → ask *"How much does an international student pay per semester?"* →
   correct figure, in prose *(15s)*
7. **Error handling, on purpose** *(10s)*: ask *"Do you have a swimming pool?"* →
   the bot says it doesn't have that and gives the International Affairs contact,
   instead of inventing an answer.

**Backups, in order:** if the network fails → the recorded walkthrough video; if the
3D model stalls → skip to the chatbot and say "it's a 40MB scan, here's the
recording"; if the job API is down → the page already shows saved listings and the
banner explains why.

> **Say:** Narrate intent, not clicks. Never say "now I'm clicking here."

---

## Slide 10 — Template 30 in action: the admin's flow  *(45s)*

**Prompt (Template 30 — User Flow Optimization), abbreviated:**

> "I need to improve the user flow for **keeping the chatbot's answers correct**.
> Current flow: 1. admin edits a fee in the dashboard. 2. admin must remember to
> press 'Rebuild chatbot knowledge'. 3. if they forget, the chatbot quotes the old
> figure. Pain points: the rebuild is invisible work with no feedback…"

| Before | After |
|---|---|
| Edit a fee → **remember** to press Rebuild | Edit a fee → **save** → the chatbot is updated in the same request |
| Unanswered questions could only be dismissed | Answer → publish as FAQ → all copies cleared |
| Forgetting = the chatbot contradicts the website | Forgetting is impossible; a failed update shows an amber warning with **Retry** |

**How we measure it:** the number of manual steps between "a fee changes" and "the
chatbot says the new fee" went from **3 to 0**. Every save now reports what the
chatbot did: *"Saved. The chatbot is updated too."*

> **Say:** "The AI's first suggestion was to rebuild on every save. We added the
> part it missed: what happens when that rebuild fails *after* the save succeeded."

---

## Slide 11 — Member contribution  *(45s)*

| Member | Tasks completed | Current responsibility | Share |
|---|---|---|---|
| **Amon Oswald Hackl** (673040671-2) | Application code: 10 routes, 10 API endpoints, 16 database migrations; deployment and CI; security hardening; AI integration | Backend, data integrity, release | **XX%** |
| **Thanasoonton Chewakietyingyong** (673040460-5) | *[fill in: e.g. CDLC 3D scan and .glb model, Figma wireframes and prototype, content/data verification, device testing]* | *[fill in]* | **XX%** |

**Repository note, stated openly:** all git commits are authored from one account.
*[Choose the true sentence: "The second member's contributions are design and 3D
assets, which live outside the code repository" — or — "we pair-programmed on one
machine".]*

> **Say:** Say the split out loud and explain the commit history in one sentence.
> Examiners reward an honest 80/20 over an unconvincing 50/50.

---

## Slide 12 — GitHub collaboration  *(45s)*

**Insert:** a screenshot of the PR list (github.com/MONNNNNNNNNNN/project_webinteract/pulls?q=is%3Apr)

- **65 commits** on `main`, 221 tracked files, ~8,400 lines of application code
  plus a 500-line test suite.
- **Feature branches, never straight to main:** `fix/scrutinize-findings`,
  `feat/unanswered-to-faq`, `feat/auto-rebuild-kb`, `fix/careers-duplicate-postings`.
- **5 pull requests, all merged with rebase** to keep history linear, each with a
  written description of what changed and why.
- **Deploy previews on every PR** — Vercel builds the branch before it merges, so a
  broken build never reaches production.

**Commit message convention — what changed *and why*:**

> `Close the admin, quota and row-overwrite holes the review found`
> `Build the chatbot's knowledge from the tables the site renders`
> `Rebuild the chatbot's knowledge automatically on every admin save`

Not `update files`, `fix bug`, `asdf`.

**Repository structure:** `src/` frontend · `api/` serverless functions ·
`shared/` data used by both · `supabase/` migrations · `scripts/` operations ·
`docs/` proposal, report, reference data.

> **Say:** Open the real PR page if the network allows. One PR, scrolled, is worth
> more than the bullet list.

---

## Slide 13 — Gen AI usage and reflection  *(60s)*

**Three templates, three real uses** (slides 6, 8, 10):

| Template | Used for | Our modification |
|---|---|---|
| **32** Interface Layout | Admin screen layout | 10 screens → 1 schema-driven screen |
| **15** Feature Implementation | Unanswered → FAQ | Added the server-side placeholder block |
| **30** User Flow Optimization | Automatic chatbot rebuild | Added failure handling after a successful save |

**Where AI was genuinely effective:** an AI code review of the whole repository
found three real defects we had missed — any signed-up account could become an
admin, the job API quota could be drained by anyone, and editing one student type
could overwrite a different one. All three are fixed.

**Where it was wrong, and how we knew:** the same review reported the chatbot's
knowledge was "stale in 25 places". We checked: the difference was only Postgres
storing JSON keys in a different order. **No bug.** Had we trusted it, we would have
rewritten working code.

**How we validate every AI suggestion — evidence, not vibes:**
- **69 automated checks** in the repository, written alongside the features:
  48 API tests with the network stubbed (`npm test`), 21 browser tests driving the
  real UI.
- Every claim tested against the **live** database read-only before shipping.
- `npm run lint` and a production build on every change.

**Reflection, one sentence:** AI moved fastest on work with a clear specification
and a way to check it; it was least trustworthy exactly where checking was hardest,
which is why the guardrails (placeholder block, budget cap, allowlist) are all
*server-side* rather than prompt instructions.

> **Say:** Give the "stale in 25 places" story. Being able to say "we checked, and
> the AI was wrong" is the highest-value thing on this slide.

---

## Slide 14 — Conclusions  *(45s)*

**Completed since the proposal**
- All 7 proposed features deployed and publicly reachable
- Content moved out of the code into a database with an admin UI (16 migrations)
- Chatbot rebuilt to answer from the real curriculum, fee and staff data
- Security pass: admin allowlist, quota pacing, upload validation, security headers

**Next, with dates**

| By | Task |
|---|---|
| [date, week 13] | Real user testing with 5 students; fix what they stumble on |
| [date, week 13] | Verify the `[unclear]` course codes against the official curriculum |
| [date, week 14] | Thai language pass on the chatbot's answers |
| [date, week 14] | Final report and demo video recorded as a fallback |
| [date, week 15] | Final presentation |

**Challenges and what we did**

| Challenge | Solution |
|---|---|
| Job API quota exhausted by day 9 of the month | Three cache layers + pro-rata pacing; it now cannot run dry |
| Chatbot contradicted the website after an admin edit | Knowledge rebuilt from the same tables the pages render, automatically on save |
| A model that invents facts is worse than no model | Retrieval decides the facts; the model only rephrases, and gaps become `[ADMIN: …]` |
| 10-second serverless limit | Every external call is time-boxed with a fallback answer |

**Thank you — questions?**

---

## Slide 15 — Backup slides for Q&A  *(not presented)*

- **Quota arithmetic:** 5 prefetched buckets × 1 live window/day = 150/month against
  a 170 cap; a 6-hour cache TTL would need 600.
- **Security:** `ADMIN_EMAILS` allowlist checked at login *and* on every request, so
  removing an address ends that session; sign-ups are closed on the database.
- **Chatbot:** Postgres full-text search, no embeddings — 119 chunks where exact
  terms (course codes, fees, lecturer names) matter more than semantic similarity.
  Thai uses trigram matching because Thai has no spaces between words.
- **Limits:** Vercel Hobby allows 12 functions; we use 10.

---

## Q&A — likely questions and short answers

| Question | Answer |
|---|---|
| "Is the fee data official?" | The international rates are from the official programme page; the Thai rate comes from a prior project's report and is marked for confirmation with the faculty before public release. |
| "What if the job API is down in the demo?" | The page serves saved listings with a banner explaining why. It's designed in, not patched. |
| "How do you stop the AI inventing answers?" | It never answers from its own knowledge. It is given retrieved text and told to decline anything not in it; for admin drafts, missing facts become `[ADMIN: …]` placeholders that block publishing. |
| "Why Gemini and not Claude, as in the proposal?" | We restructured so the model is optional: retrieval answers on its own, and Gemini only rephrases. That made the free tier sufficient and removed the model as a point of failure. |
| "Who can log into the admin panel?" | Only addresses in an allowlist set on the server. A Supabase account alone is not enough — that was a real vulnerability we found and fixed. |
| "How much of this is AI-written?" | AI drafted a lot of it; every feature is covered by tests we run, and we can show one case where we rejected its conclusion after checking. |

---

## Presentation notes

**Timing:** slides sum to 9:25. If running long, compress slides 5 and 12 — both
read fine without narration. Never compress 8, 9 or 13: they carry the
functionality, the demo and the Gen AI marks.

**Assets to insert** (`docs/progress/screenshots/`):
- Slide 4 → `desktop-home.png`, `desktop-curriculum-tracks.png`, `desktop-tuition-international-4y.png`
- Slide 5 → `desktop-home.png` + `mobile-home.png` + `mobile-nav-open.png`
- Slide 6 → admin screenshot *(capture from your logged-in session)*
- Slide 8 → admin Unanswered tab with the Gemini draft open *(capture from your session)*
- Slide 9 → live; no slide asset needed beyond a title
- Slide 12 → screenshot of the merged pull-request list

**Still to fill in:** group number, advisor name, Slide 11 (partner tasks + the
split), the dates in Slide 14, and the two admin screenshots.

**Extra credit:**
- *Real user feedback (+1)* — 5 students, 3 fixed tasks, a 4-question form; put two
  quotes and one measured fix on Slide 9.
- *English without reading (+1)* — the "Say:" notes are written to be spoken. Two
  rehearsals against a timer, then present from the screenshots alone.
