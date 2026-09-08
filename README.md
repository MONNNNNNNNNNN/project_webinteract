# DME Explorer

Interactive guide to the Digital Media Engineering programme at Khon Kaen
University. React 18 + Vite on the front, Vercel serverless functions on the
back, Supabase Postgres underneath.

Live: **https://dmeexplorer.vercel.app**
Architecture diagram: `docs/architecture/dme-explorer-architecture.png`
Working notes and conventions: `CLAUDE.md`

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
  admin/              login · logout · session · faqs
  _lib/               shared server code. The leading underscore matters:
                      Vercel treats it as a helper directory, not endpoints.
    env.js              every secret read in one place
    session.js          HMAC admin cookie
    knowledgeBase.js    retrieval against Postgres full-text search
    gemini.js           optional generation layer
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
```

These four files do three jobs at once, which is why they sit outside both `src/`
and `api/`:

1. **Seed** — `scripts/seed-content.js` writes them into the Postgres tables.
2. **Fallback** — the pages import them and render them immediately, so a paused
   Supabase degrades to the site as built rather than to a blank page.
3. **Knowledge source** — `scripts/build-kb.js` turns them into the 119 chunks
   the chatbot retrieves from.

Edit these in the repo and push. Nothing writes back to them.

> Migrations `0012`–`0014` still reference these as `src/lib/*.js` in their
> comments. Migrations are immutable once applied, so those comments were left
> alone rather than rewritten.

## `scripts/` — operations

```
node scripts/build-kb.js --dry-run    build the chunks, write nothing
node scripts/build-kb.js              shared/ -> kb_chunks  (idempotent)
node scripts/seed-content.js --apply  shared/ -> the site_* tables
node scripts/prune-media.js           list unreferenced uploads
node scripts/prune-media.js --apply   delete them
```

Both need `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Re-run `build-kb.js`
after editing anything in `shared/`, or the chatbot keeps answering from the
previous version.

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

`vite.config.js` runs the `api/*.js` handlers under `vite dev`, so the same files
work locally and on Vercel without the Vercel CLI.
