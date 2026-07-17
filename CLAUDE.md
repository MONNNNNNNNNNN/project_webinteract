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
- **3D CDLC simulation:** built separately by a teammate (Thanasoonton) as a
  self-contained static web build (Unity WebGL or Three.js, TBD by them), dropped
  into `public/cdlc-sim/` later and embedded via `<iframe>` in
  `src/pages/ThreeDWorld.jsx`. The exact handoff contract is in
  `docs/3d-integration-handoff.md`. **Do not build any 3D viewer/loader logic** —
  the route and iframe scaffold already exist; `public/cdlc-sim/` is intentionally
  empty until the teammate's build lands.

See `docs/demo-script.md` for how this all gets presented — it's a useful map of
which features are considered "high risk" for a live demo (JSearch API, the 3D
build) and already has fallback plans baked in.

## Tech stack

- **Frontend:** React 18 + Vite 5 + Tailwind CSS 3, React Router 6
- **Backend:** Vercel Serverless Functions (Node.js) under `api/` — not built yet
- **Database:** Supabase / Postgres, migrations in `supabase/migrations/`
- **Hosting:** Vercel (Hobby tier — see `vercel.json`)
- **Version control:** GitHub

Two free-tier constraints worth remembering (from the original proposal, section 7):
Vercel Hobby functions have a 10-second execution timeout (keep chatbot responses
short, use Haiku not a reasoning model), and Supabase free-tier projects pause
after 7 days of inactivity (manual restart needed before a demo after a break).

## Folder structure

```
api/                        Vercel serverless functions (empty — not built yet)
src/
  pages/                    One file per route
    Admin/                  Admin routes (stubbed, needs Supabase Auth)
  components/               Navbar, Footer, ChatWidget, ComingSoon, etc.
  lib/                      Static data modules (curriculumData.js, tuitionData.js)
                             that the real-content pages import — no backend calls
supabase/migrations/        SQL migrations: programs, courses, student_status, fee_detail
docs/reference/             Extracted source data — read these instead of the PDFs
  curriculum-data.md         Full 4-year study plan + 4 elective-track course lists
  tuition-data.md            Full fee breakdown per student type / period
public/cdlc-sim/            Empty — reserved for teammate's 3D build (see above)
```

## Data sourcing

`docs/reference/curriculum-data.md` and `docs/reference/tuition-data.md` were
transcribed directly from screenshots inside `Studio_4_Final_Report__A.pdf`
(pages 15-19, 25-27 for curriculum; 38-39 for tuition). **Read those markdown
files, not the PDF** — they're the source of truth for `src/lib/curriculumData.js`
and `src/lib/tuitionData.js`. A few course codes in the curriculum data are marked
`[unclear]` where the source screenshot was obscured by a UI tooltip or rendered
ambiguously at low resolution — flagged inline, verify against the official KKU
curriculum before publishing.

## Page status

**Real content, fully self-contained (no env vars needed):** Home, CurriculumRoadmap,
TuitionFees (working calculator, local state only), AboutDME, Contact,
StudentProjects (placeholder gallery entries).

**Stubbed — "Coming soon", route exists, no logic yet:**
- `CareerExplorer.jsx` — needs `JSEARCH_API_KEY`
- `ChatWidget.jsx` (floating component, not a route) — needs `ANTHROPIC_API_KEY`
- `ThreeDWorld.jsx` — needs teammate's build in `public/cdlc-sim/`; iframe pattern
  is already wired per the handoff doc
- `Admin/AdminLogin.jsx`, `Admin/AdminDashboard.jsx` — needs Supabase Auth

## Environment variables

See `.env.example`. Nothing is required for local dev — every stub page renders
without any env vars set. Live JSearch integration, live chatbot logic, Supabase
auth, and 3D asset loading are explicitly follow-up tasks, not part of this pass.
