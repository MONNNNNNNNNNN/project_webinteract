# DME Explorer

Interactive guide to the Digital Media Engineering programme at Khon Kaen
University. React 18 + Vite on the front, Vercel serverless functions on the
back, Supabase Postgres underneath.

Live: **https://dmeexplorer.vercel.app**
Architecture diagram: `docs/architecture/dme-explorer-architecture.png`
Working notes and conventions: `CLAUDE.md`

---

## Calling a web API: JSearch job listings

This section is the Lab 9 extra-credit write-up. The code that calls the API
is `api/careers.js` (function `liveJobs()`), and the page that shows the result
is `src/pages/CareerExplorer.jsx`.

### 1. What is this API about?

JSearch is a job-search API sold through RapidAPI. It collects job postings
from Google for Jobs, which in turn gathers them from LinkedIn, Indeed,
Glassdoor, JobsDB and company career pages. You send it a free-text query such
as "software developer jobs Thailand" and it returns matching postings with the
title, employer, location, posting date and a link to apply.

DME Explorer uses it on the Career Explorer page so prospective students can
see real, current jobs in Thailand for each career path the programme leads to
(3D & Animation, Game Dev, AI & Data, Software). The free BASIC plan allows 200
calls a month and returns about 10 postings per call. That is why the server
caches results in Supabase and caps live calls at 170 a month instead of
calling JSearch on every page view.

### 2. The API URL that we call

```
GET https://jsearch.p.rapidapi.com/search-v2?query=<term>%20jobs%20Thailand&num_pages=1&country=th&date_posted=all
```

Required headers:

```
x-rapidapi-key:  <JSEARCH_API_KEY>
x-rapidapi-host: jsearch.p.rapidapi.com
```

`<term>` depends on the interest the user picks: `software developer`,
`game developer`, `3D animation artist`, `AI data science`, or
`digital media` for "All". The call is made from the serverless function, never
from the browser, so the API key stays secret. Our own endpoint in front of it
is `GET /api/careers?interest=Software`.

```js
const url = `https://jsearch.p.rapidapi.com/search-v2?query=${encodeURIComponent(query)}&num_pages=1&country=th&date_posted=all`;
const res = await fetch(url, {
  headers: {
    "x-rapidapi-key": JSEARCH_API_KEY,
    "x-rapidapi-host": "jsearch.p.rapidapi.com",
  },
  signal: controller.signal, // aborted after 6 s
});
if (!res.ok) throw new Error(`JSearch API ${res.status}`);
const data = await res.json();
```

### 3. The API result that we get

JSearch returns a JSON object whose `data.jobs` array holds the postings. Each
posting has around 40 fields. Abbreviated example for one posting:

```json
{
  "status": "OK",
  "request_id": "…",
  "parameters": { "query": "software developer jobs thailand", "country": "th", "num_pages": 1 },
  "data": {
    "jobs": [
      {
        "job_id": "eGtwZzlZdTI5NEFHaXJSSkFBQUFBQT09…",
        "job_title": "Backend Developer — Apache Fineract",
        "employer_name": "Eminno",
        "employer_logo": null,
        "job_publisher": "LinkedIn",
        "job_employment_type": "Full-time",
        "job_apply_link": "https://th.linkedin.com/jobs/view/backend-developer-%E2%80%94-apache-fineract-at-eminno-4466835392",
        "job_description": "…",
        "job_is_remote": false,
        "job_posted_at": "1 วันที่ผ่านมา",
        "job_posted_at_datetime_utc": null,
        "job_location": "กรุงเทพมหานคร",
        "job_city": null,
        "job_country": "TH",
        "job_min_salary": null,
        "job_max_salary": null,
        "job_highlights": { "Qualifications": ["…"], "Responsibilities": ["…"] }
      }
    ]
  }
}
```

### 4. The partial result that we parse and display

We keep only seven fields per posting. `liveJobs()` maps each JSearch posting
to this shape before it is cached and sent to the browser:

| Our field  | Taken from JSearch                                      | Shown as                     |
|------------|---------------------------------------------------------|------------------------------|
| `id`       | `job_id`                                                | key for caching / de-dupe    |
| `title`    | `job_title`                                             | card heading                 |
| `company`  | `employer_name`                                         | company name + letter avatar |
| `location` | `job_city, job_country`, else first part of `job_location` | location line             |
| `interest` | the interest we queried                                 | category filter              |
| `postedAt` | `job_posted_at_datetime_utc`, else `job_posted_at`      | "posted" date                |
| `url`      | `job_apply_link`                                        | "Apply" button               |

Real response from `GET https://dmeexplorer.vercel.app/api/careers?interest=Software`
(first posting, `id` shortened):

```json
{
  "jobs": [
    {
      "id": "eGtwZzlZdTI5NEFHaXJSSkFBQUFBQT09…",
      "title": "Backend Developer — Apache Fineract",
      "company": "Eminno",
      "location": "กรุงเทพมหานคร",
      "interest": "Software",
      "postedAt": "1 วันที่ผ่านมา",
      "url": "https://th.linkedin.com/jobs/view/backend-developer-%E2%80%94-apache-fineract-at-eminno-4466835392"
    }
  ],
  "simulated": false,
  "source": "live",
  "cached": true,
  "added": 10,
  "total": 60,
  "budgetUsed": 58,
  "budgetLimit": 170
}
```

If the API key is missing, the call fails, or the monthly budget is spent, the
endpoint serves cached postings or built-in sample postings instead
(`simulated: true`), so the page never shows an error.

---

## Where the frontend / backend line falls

```
src/          FRONTEND   — runs in the user's browser
api/          BACKEND    — runs on Vercel, one process per request
shared/       BOTH       — plain data, imported by the frontend and by scripts
scripts/      OPS        — run by hand from a terminal, never during a request
supabase/     DATABASE   — schema and migrations
docs/         DOCS       — architecture diagram, reference data, exports
public/       STATIC     — images and the .glb model, served as-is
```

**The one rule that explains the whole design:** the browser never talks to
Supabase directly. Every request goes through a function in `api/`. That is why
all the secrets live server-side, and why RLS is a second line of defence here
rather than the first.

### Why `api/` is not called `backend/`

Vercel decides what is a serverless function by looking for a directory named
`api/` at the repository root. Rename it and every endpoint 404s. The name is
the platform's, not ours.

---

## `src/` — frontend

```
src/
  main.jsx            entry point, mounts React
  App.jsx             routes, and prefetches career listings on mount
  pages/              one file per route
    Admin/            the admin dashboard
      ContentManager.jsx    generic list + form, renders itself from a schema
      contentSchemas.js     10 tabs; adding a domain is an entry here
  components/         Navbar, Footer, ChatWidget, NewsCarousel, ThreeDViewer …
  lib/                browser-side helpers ONLY
    contentClient.js    static-first loading with a database swap
    careersCache.js     localStorage cache for job listings
    media.js            image or video, decided by URL
    topicIcons.js       the site's one icon vocabulary
  index.css           three Tailwind directives and a body background
```

`src/lib/` is deliberately small. If something is imported by anything outside
`src/`, it does not belong there — it belongs in `shared/`.

## `api/` — backend

```
api/
  chat.js             the chatbot: retrieve, then optionally phrase with Gemini
  careers.js          job listings, three cache layers, monthly quota ceiling
  content.js          one endpoint for all 9 admin-editable content types
  upload.js           signed one-shot upload URL, browser -> Supabase Storage
  admin/              login · logout · session · faqs · rebuild-kb · draft-answer
  _lib/               shared server code. The leading underscore matters:
                      Vercel treats it as a helper directory, not endpoints.
    env.js              every secret read in one place
    session.js          HMAC admin cookie + ADMIN_EMAILS allowlist
    knowledgeBase.js    retrieval against Postgres full-text search
    gemini.js           optional generation layer
    kbSync.js           site_* tables -> kb_chunks (script and dashboard)
    jobCache.js         job cache and quota
    mockData.js         offline fallback facts
```

Each file directly under `api/` is a public HTTP endpoint. Anything shared
between them goes in `api/_lib/`.

## `shared/` — imported by both sides

```
shared/
  courseDescriptions.js   75 courses, English and Thai, from the TQF.2
  curriculumData.js       4-year study plan and the 4 elective tracks
  tuitionData.js          fee tables, plus grandTotal() and formatBaht()
  staffData.js            19 lecturers
  kbChunks.js             the chatbot's chunk builder, over site_* rows
  faqDraft.js             the [ADMIN: …] placeholder check, client and server
```

The four data files do two jobs, which is why they sit outside both `src/` and
`api/`:

1. **Seed** — `scripts/seed-content.js` writes them into the Postgres tables
   (through `staticRows()` in `kbChunks.js`).
2. **Fallback** — the pages import them and render them immediately, so a paused
   Supabase degrades to the site as built rather than to a blank page.

The live site renders the tables, not these files. Change live content in the
admin dashboard. Editing a file here changes only the fallback until someone
re-seeds, and re-seeding overwrites admin edits.

The chatbot's 119 chunks are built from the **tables** by `kbChunks.js`, so they
match what the pages show. Saving in the admin dashboard rebuilds them
automatically. If that rebuild fails, the save still stands and the tab offers
a Retry.

> Migrations `0012`–`0014` still reference these as `src/lib/*.js` in their
> comments. Migrations are immutable once applied, so those comments were left
> alone rather than rewritten.

## `scripts/` — operations

```
node scripts/build-kb.js --dry-run    build the chunks from shared/, no network
node scripts/build-kb.js              site_* tables -> kb_chunks  (idempotent)
node scripts/seed-content.js --apply  shared/ -> the site_* tables  (destructive)
node scripts/prune-media.js           list unreferenced uploads
node scripts/prune-media.js --apply   delete them
```

All need `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (except `--dry-run`).
After seeding, run `build-kb.js` so the chatbot matches. Seeding writes the
tables directly, so the dashboard's automatic rebuild never sees it.

**Seed with `seed-content.js`, not by pasting migration SQL.** Pasting the
`INSERT`s into the Supabase SQL editor once mangled every non-ASCII character —
UTF-8 read as CP1252 — corrupting 93 rows including all 75 Thai descriptions.

## `supabase/` — database

`migrations/` is the schema, applied in order. Their `INSERT` statements document
the intended seed data; `scripts/seed-content.js` is how it actually gets there.

---

## Local development

```bash
npm install
npm run dev        # :5173 — reads .env.local automatically
npm run lint
npm run build
```

Nothing is required to run the site. With no environment variables the pages
render their bundled content, the chatbot answers from six built-in facts, and
Career Explorer shows simulated listings. See `.env.example`.

A deploy needs `SESSION_SECRET` and `ADMIN_EMAILS` (comma-separated) in
production and preview. Without either, admin sign-in refuses to run.

`vite.config.js` runs the `api/*.js` handlers under `vite dev`, so the same files
work locally and on Vercel without the Vercel CLI.
