# tests/

Checks written alongside the features they cover. They exist because much of this
code was drafted with AI assistance: a suggestion is only accepted once something
here proves it behaves as claimed.

```
tests/api/   handler tests — fetch is stubbed, so no network, database or keys
tests/ui/    browser tests — drive the real interface in headless Chromium
```

## API tests

```bash
npm test          # or: bash tests/run-api.sh
```

48 checks across three areas:

| File | Covers |
|---|---|
| `api/unanswered-to-faq.mjs` | Publishing an unanswered question as an FAQ; the Gemini draft path (rate limit, timeout, empty reply); the `[ADMIN: …]` placeholder block on every write; bulk dismiss and its 200-id cap |
| `api/auto-rebuild-kb.mjs` | The chatbot's knowledge rebuilding after a save; tabs the chatbot does not read skipping it; a failed rebuild still reporting the save; the time-budget skip; Retry |
| `api/careers-dedupe.mjs` | One posting arriving under several JSearch ids collapsing to a single card |

Each file takes a mode argument (`sb` / `nosb`) selecting whether Supabase is
configured; `run-api.sh` runs every combination.

## Browser tests

21 checks driving the real UI. They need a dev server and a Chromium binary:

```bash
npm run dev &                                   # http://localhost:5199 by default
export CHROME_PATH=/path/to/chrome-headless-shell
node tests/ui/unanswered-to-faq.mjs             # 15 checks
node tests/ui/auto-rebuild-kb.mjs               # 6 checks
```

`DEV_URL` overrides the server address, `CHROME_PATH` the browser. Both files stub
their API responses with `page.route()`, so they do not touch production data.
