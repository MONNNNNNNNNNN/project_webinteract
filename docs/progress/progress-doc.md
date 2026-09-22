# DME Explorer — Progress Report

**Course:** EN 842300 Interactive Web Programming · **Group:** IWP26-XX · **Advisor:** [name]
**Members:** Amon Oswald Hackl (673040671-2) · Thanasoonton Chewakietyingyong (673040460-5)
**Live application:** https://dmeexplorer.vercel.app
**Repository:** https://github.com/MONNNNNNNNNNN/project_webinteract
**Date:** [presentation date]

> Paste into Google Docs: headings, tables and bold all carry over. Replace every
> `[bracketed]` placeholder first.

---

## 1. Summary

DME Explorer is an interactive web guide to the Digital Media Engineering programme
at Khon Kaen University, built for prospective and first-year students. The
information those students need already exists — in faculty pages, PDF curriculum
documents and conversations with seniors — but it is scattered and static. This
project is the interface layer that joins curriculum, cost, career and facility
into one application.

All seven features proposed at the start of the term are built, deployed and
publicly reachable. The work since the proposal has been less about adding features
and more about making them trustworthy: moving content out of the code into a
database with an admin interface, making the AI assistant answer from that same
data, and closing security and quota defects found in review.

---

## 2. Current status against the proposal

| Proposed feature | Status | Detail |
|---|---|---|
| Curriculum Roadmap | Complete | 75 courses with Thai and English descriptions, 4-year study plan, 4 elective tracks |
| Tuition & Fees | Complete | 3 student types × 2 periods, served from the database |
| Career Explorer | Complete | Live job listings via JSearch, cached and quota-capped |
| Student Projects | Complete | Real entries labelled "Real"; placeholders marked as such |
| 3D CDLC Walkthrough | Complete | First-person in-browser walkthrough; DME Lab shown as "soon" |
| AI FAQ Assistant | Complete | Retrieval over 119 knowledge chunks, optional Gemini phrasing |
| Admin Panel | Complete | 10 content tabs, authenticated, writing to Postgres |

### Scope changes, and why

1. **Alumni stories were cut.** Personal narratives could not be verified or
   maintained to the standard the rest of the data is held to.
2. **Tuition & Fees was added.** It was not in the original proposal. It answers one
   of the questions that actually decides an application.
3. **The 3D walkthrough moved in-app.** The proposal planned a separate static build
   embedded through an `<iframe>`. It is now React Three Fiber inside the
   application, sharing its navigation, styling and deployment.
4. **The AI assistant was restructured.** The proposal named Claude Haiku as the
   answering model. The assistant now *retrieves* the answer from the project's own
   data first, and a model is optional: with a Gemini key it rephrases the retrieved
   text, without one the text is served as-is. This removed the model as a point of
   failure and made the free tier sufficient.

---

## 3. User interface

Screenshots: `docs/progress/screenshots/` — desktop captured at 1440px, mobile at 390px.

### Design decisions worth noting

- **A single icon vocabulary.** `src/lib/topicIcons.js` is the only place icons are
  chosen — for elective tracks, credit categories, career interests, student types
  and fee rows. The "AI" track is the same purple brain icon on the Curriculum page
  and on a job listing. Consistency here is what turns icons into a language rather
  than decoration.
- **Every resolver has a fallback.** Icons are chosen from admin-editable free text,
  so an unrecognised value resolves to a generic icon, never to a gap in the layout.
- **Real data throughout.** 75 real courses, the real fee structure, 19 real
  lecturers from the department directory.
- **Dark mode**, applied before the application mounts so there is no flash of the
  wrong theme.

### Responsive behaviour

| Width | Behaviour |
|---|---|
| ≥1024px | Full navigation bar with an animated active-page indicator |
| <1024px | Navigation collapses into a menu button |
| Any | Fee tables scroll horizontally rather than compressing columns |
| Any | Card grids step 3 → 2 → 1 columns |
| 3D page | Pointer-lock + WASD on desktop; drag-to-look and pinch-to-zoom on touch devices, detected at runtime |

Mobile is treated as the primary case, since most prospective students browse on a
phone.

---

## 4. Main functions and API integration

### Four external integrations, each with a fallback

| Integration | Purpose | Behaviour on failure |
|---|---|---|
| JSearch (RapidAPI) | Live job listings per interest track | Accumulated cache, then representative listings |
| Supabase / PostgREST | All site content | Pages render the data bundled at build time |
| Google Gemini (optional) | Phrases the chatbot's retrieved text | Retrieved text served verbatim |
| Supabase Storage | Admin image and video upload | Upload rejected with a readable message; nothing else affected |

### Job-listing quota management

The free JSearch tier allows 200 calls per month and returns about 10 listings per
call. Three measures keep the application inside that:

1. **Three cache layers.** Browser localStorage (30 minutes) → a shared server cache
   (24 hours) → a 10-minute floor between live calls for any one interest.
2. **A monthly ceiling of 170 calls**, enforced by a single atomic database
   statement so two simultaneous requests cannot both claim the last call.
3. **Pro-rata pacing.** A given day may only spend `ceil(170 × day ÷ days_in_month) + 5`.
   Without this, repeated use of the refresh button could spend about 30 calls an
   hour and exhaust the month in roughly six hours.

The cache **accumulates** rather than replacing: each live call adds new listings to
the pool, so the list grows across refreshes.

### The AI assistant

- Retrieval is **Postgres full-text search** over 119 knowledge chunks — no
  embeddings and no vector database. The corpus is dominated by exact terms (course
  codes, fee amounts, lecturer names) where full-text search is competitive and free.
- **Thai and English need different matchers.** English uses stemmed full-text
  search; Thai uses trigram similarity, because Thai is written without spaces
  between words, so a whole phrase would otherwise collapse into a single token.
- **The model never answers from its own knowledge.** It receives retrieved text and
  is instructed to decline anything the text does not cover.
- Every request is time-boxed to 8.5 seconds against the hosting platform's
  10-second limit; retrieval runs first and the model gets whatever remains.

### Admin content management

Ten content types (courses, study plan, elective tracks, student types, fee rows,
staff, projects, news, FAQs, unanswered questions) are edited through one
schema-driven screen. Saving content the chatbot reads **rebuilds the chatbot's
knowledge in the same request**, so the assistant cannot contradict the website.

---

## 5. Generative AI usage

### Templates used

**Template 32 — Interface Layout** (admin screen)

> "Suggest a user interface layout for an admin content management screen in a React
> web application that needs to include these features: list existing rows, create,
> edit and delete, across 10 different content types, with validation and a clear
> save state."

| AI suggested | We implemented | Reason |
|---|---|---|
| One screen per content type | One screen with 10 tabs | Ten near-identical screens multiply bugs |
| A hand-written form per type | Forms rendered from a schema | A new content type is a ~15-line entry, no new UI code |
| A modal for editing | Inline form above the list | On a phone a modal hides the list being edited |
| Delete button | Delete with confirmation | There is no undo on a fee row |

**Template 15 — Feature Implementation Request** (unanswered questions → FAQ)

Used to build the flow that turns a question the chatbot could not answer into a
published FAQ. Delivered: duplicate questions grouped and counted; publishing writes
an FAQ the chatbot uses on the next message; Gemini drafts the answer **only** from
retrieved knowledge, marking every missing fact as `[ADMIN: …]`; publishing is
blocked while any placeholder remains, enforced both in the browser and on the
server.

The template's "edge cases" section produced the most valuable result. Asked "Where
is the canteen?", an unconstrained model invents a building; the implemented version
returns `[ADMIN: building and floor]` for a human to fill in.

**Template 30 — User Flow Optimization** (keeping the chatbot correct)

| Before | After |
|---|---|
| Edit a fee, then remember to press "Rebuild chatbot knowledge" | Edit a fee and save; the chatbot updates in the same request |
| Forgetting meant the chatbot contradicted the site | Forgetting is impossible; a failed update shows a warning with Retry |

Manual steps between "a fee changes" and "the chatbot reports the new fee": **3 → 0**.

### Effectiveness, and its limits

An AI review of the whole repository found three genuine defects that manual work
had missed:

1. Any account registered with the authentication provider could obtain admin
   access; sign-ups were open.
2. The job-listing quota could be drained by anyone through an unvalidated query
   parameter.
3. Editing one student type could overwrite a different row, because a form field
   could redirect the update.

All three are fixed and covered by tests.

The same review also reported that the chatbot's knowledge was stale in 25 places.
On inspection, the only difference was the database storing JSON keys in a different
order — there was no defect. Acting on it would have meant rewriting correct code.

### How AI output is validated

- **69 automated checks** in the repository (`tests/`), written alongside the
  features: 48 API-level tests with the network stubbed (`npm test`), and 21
  browser tests driving the real interface.
- Behaviour checked against the live database, read-only, before shipping.
- Linting and a production build on every change.
- Guardrails that matter are enforced **server-side** (placeholder blocking, quota
  cap, admin allowlist) rather than as instructions in a prompt, because a prompt is
  not a control.

**Reflection.** AI was fastest where the specification was clear and the result was
checkable, and least reliable exactly where checking was hardest. That asymmetry,
rather than any single feature, shaped the architecture: the parts that must not
fail are enforced by code and tested, not by wording in a prompt.

---

## 6. Team contribution

| Member | Completed | Current responsibility | Share |
|---|---|---|---|
| Amon Oswald Hackl (673040671-2) | Application code across 10 routes and 10 API endpoints, 16 database migrations, deployment, security hardening, AI integration | Backend, data integrity, releases | XX% |
| Thanasoonton Chewakietyingyong (673040460-5) | *[fill in: 3D scan and model, Figma wireframes and prototype, content verification, device testing]* | *[fill in]* | XX% |

**Note on the commit history:** all commits are authored from a single account.
*[State the true reason: design and 3D assets live outside the code repository, or
the work was paired on one machine.]*

---

## 7. Version control and collaboration

- **65 commits** on `main`; 221 tracked files; approximately 8,400 lines of
  application code and a 500-line test suite.
- **Feature branches**, never direct commits to `main`: `fix/scrutinize-findings`,
  `feat/unanswered-to-faq`, `feat/auto-rebuild-kb`, `fix/careers-duplicate-postings`.
- **5 pull requests**, all merged by rebase to keep history linear, each with a
  written description of the change and its rationale.
- **Deploy previews** build every pull request before merge, so a broken build
  cannot reach production.

Commit messages state what changed and why, for example:
*"Close the admin, quota and row-overwrite holes the review found"*,
*"Build the chatbot's knowledge from the tables the site renders"*.

### Repository structure

| Directory | Contents |
|---|---|
| `src/` | React frontend: pages, components, browser-side helpers |
| `api/` | Serverless functions; every secret stays here |
| `shared/` | Data modules used by both the frontend and the scripts |
| `supabase/` | 16 schema migrations |
| `scripts/` | Operational scripts: knowledge build, content seed, media cleanup |
| `tests/` | 48 API checks (`npm test`) and 21 browser checks |
| `docs/` | Proposal, report, reference data, this document |

---

## 8. Plan to completion

| Target date | Task |
|---|---|
| [week 13] | User testing with 5 students; act on what they stumble over |
| [week 13] | Verify the course codes currently marked `[unclear]` against the official curriculum |
| [week 14] | Thai-language pass over the assistant's answers |
| [week 14] | Final report; record a demo video as a presentation fallback |
| [week 15] | Final presentation |

---

## 9. Challenges and solutions

| Challenge | Solution |
|---|---|
| The job API quota was exhausted around day 9 of the month | Three cache layers plus pro-rata pacing; the budget can no longer run dry mid-month |
| The chatbot contradicted the website after an admin edit | Knowledge is rebuilt from the same tables the pages render, automatically on every save |
| A model that invents facts is worse than no model | Retrieval decides the facts; the model only rephrases, and unknown facts become explicit placeholders |
| A 10-second limit on serverless functions | Every external call is time-boxed, with a fallback answer prepared before the call is made |
| Content changes required a developer and a redeploy | Content moved into the database behind an admin interface |
| The job API returns one opening under several ids, so the same job appeared as several cards | The server collapses listings by title and company; "3D & Animation" went from 14 cards to the 2 real postings |

---

## 10. Resources and data sources

Every fact the application shows comes from one of these. "Verified" means the
figure was checked against the source document or a live read, not assumed.

| Resource | What it provides | Source | Where it lives | Status |
|---|---|---|---|---|
| KKU DME programme page | International and Mekong tuition rates, enrolment fee, insurance and living-cost ranges | https://www.en.kku.ac.th/web/en/beng-dme/ | `shared/tuitionData.js` | Verified against the page |
| Course Map 2026 (Cooperative Education, DME) | The 4-year study plan: courses, credits, semester ordering, accumulated credits | Programme PDF, dated 04-06-26 | `shared/curriculumData.js` | Verified; supersedes the Studio 4 study plan |
| TQF.2 curriculum document (มคอ.2, 2022) | 75 course descriptions in Thai and English, prerequisites | Official curriculum document, gear.kku.ac.th | `shared/courseDescriptions.js` | Transcribed in full |
| Studio 4 Final Report (A) | Thai tuition rate; the 4 elective-track groupings | Prior semester's student project, pages 15–19, 25–27, 38–39 | `docs/reference/*.md` | **Thai rate to confirm with the faculty** |
| Computer Engineering staff directory | 19 lecturers: title, education, specialty, room, profile link | https://gear.kku.ac.th/index.php/staff?lang=en | `shared/staffData.js` | Transcribed; emails deliberately omitted |
| JSearch API (RapidAPI) | Live job listings, filtered to Thailand | https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch | `api/careers.js`, cached in Postgres | Live, quota-capped at 170 calls/month |
| Google Gemini API | Optional phrasing of retrieved chatbot text; FAQ drafts | https://aistudio.google.com | `api/_lib/gemini.js` | Live, free tier, optional |
| Supabase (PostgreSQL, Auth, Storage) | All site content, admin accounts, uploaded media | https://supabase.com | `supabase/migrations/`, 16 migrations | Live |
| CDLC 3D scan | The `.glb` model behind the walkthrough | Scanned by the team | `public/3d/` | Early test scan, stated as such on the page |
| Google Maps embeds | Room locations and directions on Contact | Google Maps place IDs | `shared/locations.js` | Verified by opening each link |
| KKU student services | Laptop loans, dormitories, TCAS/quota admission routes | https://digital.kku.ac.th, https://activerecruit.kku.ac.th | Seeded FAQ rows | From official pages |
| Course prompt templates | Templates 15, 30 and 32 used for AI-assisted work | Course handout (shared Google Doc) | Quoted in §5 | Used verbatim |

### Technology

| Layer | Choice | Version | Why |
|---|---|---|---|
| Frontend | React + Vite | 18 / 5 | Component reuse across 10 routes; fast rebuilds |
| Styling | Tailwind CSS | 3 | One design system, no separate CSS codebase |
| Routing | React Router | 6 | Single-page navigation |
| 3D | three.js + React Three Fiber | 0.169 / 8 | WebGL in-browser, no plugin; pinned to React 18 |
| Animation | Framer Motion | 12 | Page and component transitions |
| Icons | lucide-react | 1.25 | One icon vocabulary across the site |
| Backend | Vercel Serverless Functions | Node 18+ | No server to operate; secrets stay server-side |
| Database | Supabase PostgreSQL | — | Managed Postgres, auth and storage in one free tier |
| Search | Postgres full-text + pg_trgm | — | Chatbot retrieval without an embedding provider |
| Hosting / VCS | Vercel + GitHub | — | Deploy on push, preview per pull request |

---

## Appendix A — Curriculum: 4-year study plan

Source: *International Program Course Map — Cooperative Education 2026 (DME)*. 120 credits total.
Codes shown as `EN XX XXXX` are the curriculum's own placeholders for a free choice.

**Year 1 — Semester 1** · accumulated credits: 16

| Code | Course | Credits | Type |
|---|---|---|---|
| EN 001 205 | Engineering Skills Development (audit, non-credit) | 1 | Gen Ed |
| EN 841 001 | Introduction to Digital Media | 3 | Compulsory |
| EN 841 009 | Digital Media Mathematics | 3 | Fundamental |
| EN 811 300 | Fundamentals of Computer Programming | 3 | Fundamental |
| EN 841 011 | Graphics Design | 3 | Compulsory |
| EN 841 012 | Digital Media Studio 1 | 1 | Compulsory |
| IC 011 016 | Information Literacy | 3 | Gen Ed |

**Year 1 — Semester 2** · accumulated credits: 32

| Code | Course | Credits | Type |
|---|---|---|---|
| EN 841 010 | Statistics for Data Science | 3 | Fundamental |
| EN 842 314 | Interaction Programming | 3 | Compulsory |
| EN 841 013 | Digital Media Studio 2 | 1 | Compulsory |
| EN XX XXXX | Elective Course | 6 | Elective |
| IC 011 002 | Academic English | 3 | Gen Ed |

**Year 2 — Semester 1** · accumulated credits: 48

| Code | Course | Credits | Type |
|---|---|---|---|
| EN 842 006 | Data Structures | 3 | Fundamental |
| EN 842 007 | Discrete Mathematics | 3 | Fundamental |
| EN 842 014 | Digital Media Electronics | 3 | Compulsory |
| EN 842 015 | Digital Media Studio 3 | 1 | Compulsory |
| IC 011 001 | Reading and Writing | 3 | Gen Ed |
| IC 011 10X | Second Foreign Language | 3 | Gen Ed |

**Year 2 — Semester 2** · accumulated credits: 64

| Code | Course | Credits | Type |
|---|---|---|---|
| EN 842 100 | Computer Graphics | 3 | Compulsory |
| EN 841 400 | Machine Learning | 3 | Compulsory |
| EN 842 016 | Agile Software Development | 3 | Compulsory |
| EN 842 017 | Digital Media Studio 4 | 1 | Compulsory |
| IC 011 012 | Leadership | 3 | Gen Ed |
| IC 011 018 | Logical Thinking | 3 | Gen Ed |

**Year 3 — Semester 1** · accumulated credits: 80

| Code | Course | Credits | Type |
|---|---|---|---|
| IC 011 015 | Career Preparation | 3 | Gen Ed |
| IC 011 10X | Second Foreign Language | 3 | Gen Ed |
| EN 843 008 | Digital Media Processing | 3 | Compulsory |
| EN 843 018 | Digital Media Studio 5 | 1 | Compulsory |
| EN 843 304 | Computer Networking | 3 | Compulsory |
| EN XX XXXX | Elective Course | 3 | Elective |

**Year 3 — Semester 2** · accumulated credits: 96

| Code | Course | Credits | Type |
|---|---|---|---|
| IC 011 019 | Creative Entrepreneurship | 3 | Gen Ed |
| IC 011 020 | Financial Planning | 3 | Gen Ed |
| EN 844 020 | Extended Reality | 3 | Compulsory |
| EN 843 019 | Digital Media Studio 6 | 1 | Compulsory |
| EN XX XXXX | Elective Course | 6 | Elective |

**Year 3 — Summer**

| Code | Course | Credits | Type |
|---|---|---|---|
| EN 843 796 | Practical Training (credit not counted toward total; 3rd-year students or with department permission) | 1 | Practical Training |

**Year 4 — Semester 1** · accumulated credits: 114

| Code | Course | Credits | Type |
|---|---|---|---|
| EN XX XXXX | Elective Courses | 12 | Elective |
| XX XXXX | Free Elective Courses | 6 | Free Elective |

**Year 4 — Semester 2** · accumulated credits: 120

| Code | Course | Credits | Type |
|---|---|---|---|
| EN 844 786 | Cooperative Education (interchangeable with Semester 1; 4th-year students or with department permission) | 6 | Practical Training |

## Appendix B — Major elective tracks

Source: Studio 4 Final Report (pages 15–19, 25–27), matching the four real KKU DME elective tracks.
`EN [unclear]` marks a code obscured in the source screenshot, flagged for verification before publication.

**AI track** — 11 courses

| Code | Course | Credits |
|---|---|---|
| EN 813 706 | Artificial Neural Networks | 3(3-0-6) |
| EN 813 707 | Natural Language Processing | 3(3-0-6) |
| EN [unclear] | Pattern Recognition and Its Applications | 3(3-0-6) |
| EN 842 401 | Data Visualization | 3(3-0-6) |
| EN 843 402 | Image Processing and Computer Vision | 3(3-0-6) |
| EN 843 403 | Data Science | 3(3-0-6) |
| EN 843 404 | Cognitive Computing | 3(3-0-6) |
| EN 843 405 | Deep Learning for Computer Vision | 3(3-0-6) |
| EN 843 407 | Artificial Intelligence | 3(3-0-6) |
| EN 844 306 | Information Architecture and Visualization | 3(3-0-6) |
| EN 844 406 | Interactive Data Visualization | 3(3-0-6) |

**Digital Media track** — 18 courses

| Code | Course | Credits |
|---|---|---|
| EN 842 101 | 3D Modeling and Animation | 3(3-0-6) |
| EN 842 500 | Fundamental Audio Engineering | 3(2-3-6) |
| EN [unclear] | Character Animation and Control | — |
| EN 843 105 | Computer-Generated Imagery | 3(3-0-6) |
| EN 843 107 | 3D Animation Pipeline | 3(3-0-6) |
| EN 843 108 | Shading, Lighting and Rendering | 3(2-3-6) |
| EN 843 109 | 3D Modelling and Digital Sculpting | 3(3-0-6) |
| EN 843 110 | Character and Theme Design | 3(3-0-6) |
| EN 843 111 | Visual Effects | 3(2-3-6) |
| EN 843 116 | Character Rigging and Dynamics | 3(2-3-6) |
| EN 843 117 | Real-Time Rendering | 3(2-3-6) |
| EN 843 501 | Advance Audio Engineering | 3(2-3-6) |
| EN 844 112 | Advanced Computer Graphics | 3(3-0-6) |
| EN 844 113 | Digital Compositing and Post-production | 3(3-0-6) |
| EN 844 114 | Python Scripting for Animation | 3(3-0-6) |
| EN 844 115 | 3D Animation Pre-Production | 3(3-0-6) |
| EN 844 207 | Dynamic Simulation | 3(3-0-6) |
| EN 844 502 | Sound Design for Game and Animation | 3(2-3-6) |

**Interactive track** — 10 courses

| Code | Course | Credits |
|---|---|---|
| EN 841 315 | E-Sport | 3(3-0-6) |
| EN 842 316 | Advanced Digital Media Electronics | 3(3-0-6) |
| EN [unclear] | Game Programming | — |
| EN 843 201 | Game Design | 3(3-0-6) |
| EN 843 202 | Advanced Game Programming | 3(3-0-6) |
| EN 843 210 | Game Quality Assurance | 3(3-0-6) |
| EN 843 301 | User Interface and User Experience Design | 3(3-0-6) |
| EN 844 204 | Online Game Development | 3(3-0-6) |
| EN 844 209 | Serious Game | 3(3-0-6) |
| EN 844 308 | Interaction Design | 3(3-0-6) |

**Software track** — 9 courses

| Code | Course | Credits |
|---|---|---|
| EN 813 705 | Computer Technology for Education | 3(3-0-6) |
| EN 842 300 | Interactive Web Programming | 3(3-0-6) |
| EN [unclear] | Multimedia Database | — |
| EN 843 317 | Mobile Application Development | 3(3-0-6) |
| EN 843 318 | Web Application Development | 3(3-0-6) |
| EN 844 307 | Ubiquitous Computing | 3(3-0-6) |
| EN 844 309 | Computer Network Programming | 3(3-0-6) |
| EN 844 312 | Introduction to Software Engineering | 3(3-0-6) |
| EN 844 774 | Special Topics in Digital Media Engineering | 3(3-0-6) |

## Appendix C — Tuition and fees

Mekong Region rate applies to: Cambodia, China (Yunnan/Guangxi), Laos, Myanmar, Vietnam.

**Thai Students — Per Semester**

| Item | Type | Amount |
|---|---|---|
| Tuition Fee | Mandatory | ฿45,000 |
| Summer Training | One-time | ฿2,500 |
| **Total** | | **฿45,000** |

**Thai Students — Full 4 Years**

| Item | Type | Amount |
|---|---|---|
| Tuition Fee (8 semesters) | Mandatory | ฿360,000 |
| Summer Training | One-time | ฿2,500 |
| **Total** | | **฿362,500** |

**Mekong Region — Per Semester**

| Item | Type | Amount |
|---|---|---|
| Tuition Fee | Mandatory | ฿50,000 |
| Summer Training | One-time | ฿2,500 |
| Health Insurance (~฿5,000–10,000/yr) | Optional | ฿3,750 |
| Accommodation (~฿3,000–6,000/mo x4) | Optional | ฿18,000 |
| Living Costs (~฿6,000–10,000/mo x4) | Optional | ฿32,000 |
| **Total** | | **฿103,750** |

**Mekong Region — Full 4 Years**

| Item | Type | Amount |
|---|---|---|
| Tuition Fee (8 semesters) | Mandatory | ฿400,000 |
| Summer Training | One-time | ฿2,500 |
| Health Insurance (4 years) | Optional | ฿30,000 |
| Accommodation (~40 months) | Optional | ฿180,000 |
| Living Costs (~40 months) | Optional | ฿320,000 |
| **Total** | | **฿932,500** |

**International — Per Semester**

| Item | Type | Amount |
|---|---|---|
| Tuition Fee | Mandatory | ฿65,000 |
| Summer Training | One-time | ฿2,500 |
| Enrollment Fee (new students) | One-time | ฿10,000 |
| Health Insurance (~฿5,000–10,000/yr) | Optional | ฿3,750 |
| Accommodation (~฿3,000–6,000/mo x4) | Optional | ฿18,000 |
| Living Costs (~฿6,000–10,000/mo x4) | Optional | ฿32,000 |
| **Total** | | **฿118,750** |

**International — Full 4 Years**

| Item | Type | Amount |
|---|---|---|
| Tuition Fee (8 semesters) | Mandatory | ฿520,000 |
| Summer Training | One-time | ฿2,500 |
| Enrollment Fee | One-time | ฿10,000 |
| Health Insurance (4 years) | Optional | ฿30,000 |
| Accommodation (~40 months) | Optional | ฿180,000 |
| Living Costs (~40 months) | Optional | ฿320,000 |
| **Total** | | **฿1,062,500** |

Per-semester totals exclude one-off charges (enrolment fee, summer training), which are shown but not owed every term.

## Appendix D — Lecturers

Source: Department of Computer Engineering staff directory, https://gear.kku.ac.th/index.php/staff?lang=en
Email addresses are obfuscated on the source site and are deliberately omitted rather than guessed.

| Name | Title | Specialty |
|---|---|---|
| Bhichate Chiewthanakul | Assoc. Prof. | Number theory, Elliptic curves, Modular forms |
| Chatchai Khunboa | Assoc. Prof. | Ad hoc Networks, Sensor Networks, Telecommunications, Computer Networks |
| Chavis Srichan | Asst. Prof. | Nanoelectronic |
| Daranee Hormdee | Asst. Prof. | Embedded Systems, Microprocessors, Micro-controller |
| Jiradej Ponsawat | Asst. Prof. | Evolutionary Processing, Bioinformatics |
| Kanda Runapongsa Saikaew | Assoc. Prof. | XML, DBMS, Web Services, Web 2.0 |
| Kitt Tientanopajai | Lecturer | Computer Networks, Information Security, Free/Open Source Software |
| Kornchawal Chaipah | Asst. Prof. | Computer Technology in Education, Computer Networks |
| Manasawee Kaenampornpan | Asst. Prof. | UX Design, HCI, Mobile & Ubiquitous Computing, Social Media & Digital Marketing, Software Engineering |
| Nawapak Eua-Anant | Lecturer | Digital Signal/Image Processing, Pattern Recognition, Artificial Neural Networks |
| Panawit Hanpinitsak | Lecturer | Computer Vision, Localization, Wireless Communication |
| Panupong Wanjantuk | Asst. Prof. | High-performance Computing, Data Mining |
| Pattarawit Polpinit | Asst. Prof. | Game Theory, Theory of Computation, Analysis of Algorithms |
| Sarun Paisarnsrisomsuk | Lecturer | Neural Networks |
| Tatpong Katanyukul | Assoc. Prof. | Machine Learning, Pattern Recognition |
| Wanida Kanarkard | Prof. | Computational Intelligence, A.I., High-performance Computing |
| Wasu Chaopanon | Lecturer | Web, HCI, Information Retrieval |
| Watis Leelapatra | Lecturer | Embedded Systems, Computer Architecture |
| Witcha Feungchan | Asst. Prof. | Games Design, Ubiquitous Computing, Virtual Reality |

## Appendix E — Rooms in the 3D walkthrough

| Room | Building | Floor | 3D model |
|---|---|---|---|
| Creative Digital Learning Center | Phiawijit Building | 2nd floor | yes |
| Digital Media Engineering Lab | Department of Computer Engineering | 4th floor | not scanned yet |

## Appendix F — Course description coverage

| Measure | Count |
|---|---|
| Courses with a full description | 75 |
| …with a Thai description | 75 |
| …with prerequisites recorded | 21 |

Descriptions are transcribed from the official TQF.2 (มคอ.2, 2022 revision) curriculum document. Full text for every course is on the Curriculum page of the application and in `shared/courseDescriptions.js`.

## Appendix G — verified figures

| Figure | Value |
|---|---|
| Commits on `main` | 66 |
| Pull requests merged | 6 |
| Public routes | 8 (plus 2 authenticated admin routes) |
| API endpoints | 10 of the 12 the hosting tier allows |
| Database migrations | 16 |
| Courses with descriptions | 75 |
| Study-plan rows | 39 |
| Elective-track courses | 48 |
| Lecturers | 19 |
| Chatbot knowledge chunks | 119 |
| Monthly live job-API budget | 170 calls, paced daily |
| Automated checks | 69 (48 API, 21 browser) |
| Tracked files | 222 |
