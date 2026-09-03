# Architecture diagram

`dme-explorer-architecture.png` — 3480 × 2276 (rendered at 2× for print and zoom).

Regenerate after changing the system:

```bash
npm run dev                     # the diagram is static, but keep it honest
node /tmp/render-diagram.mjs    # renders diagram.html -> the PNG
```

`diagram.html` is the source. It is hand-written SVG rather than a Mermaid or
Graphviz export, because the useful parts of this diagram are the annotations —
the 10s Vercel cap, the 170-call ceiling, which key each arrow travels with —
and layout tools push those off to the side or drop them.

One gotcha if you edit it: an SVG `<path>` with a curve fills its enclosed area
by default. Every curved connector needs `fill="none"` or it renders as a solid
black blob.
