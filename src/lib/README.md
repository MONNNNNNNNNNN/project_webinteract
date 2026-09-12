# src/lib/

Browser-side helpers. Anything here ships in the client bundle.

- `contentClient.js` — renders bundled static content first, swaps in database
  rows when they arrive. Treats `simulated: true` as non-authoritative.
- `careersCache.js` — localStorage cache for job listings, 30-minute freshness.
- `media.js` — `isVideoUrl()`: an `image_url` column can hold a video upload,
  and the extension is the only record of which.
- `topicIcons.js` — the site's one icon vocabulary. See CLAUDE.md, Icons.

If a module is imported by anything outside `src/`, it does not belong here —
put it in `shared/`.
