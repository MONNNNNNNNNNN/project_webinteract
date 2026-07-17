import { useState } from "react";

// Iframe contract from docs/3d-integration-handoff.md: teammate drops a
// self-contained static web build into public/cdlc-sim/ (index.html + assets),
// and this page embeds it via iframe. Nothing 3D-specific is implemented here —
// public/cdlc-sim/ is empty until that handoff happens.
export default function ThreeDWorld() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-white">3D World — CDLC Simulation</h1>
      <p className="mb-6 text-slate-400">
        Walk through the CDLC facility in 3D. Build provided separately and dropped
        into <code className="rounded bg-slate-800 px-1">public/cdlc-sim/</code> per{" "}
        <code className="rounded bg-slate-800 px-1">docs/3d-integration-handoff.md</code>.
      </p>

      <div className="relative h-[70vh] w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        {!loaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-slate-900">
            <div className="rounded-full bg-slate-800 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-dme-orange">
              Coming soon
            </div>
            <p className="text-slate-400">Waiting for the 3D build in public/cdlc-sim/…</p>
          </div>
        )}
        <iframe
          src="/cdlc-sim/index.html"
          title="CDLC 3D Simulation"
          className="h-full w-full border-0"
          onLoad={() => setLoaded(true)}
          allow="fullscreen"
        />
      </div>
    </div>
  );
}
