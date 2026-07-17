import { useEffect, useState } from "react";

// Iframe contract from docs/3d-integration-handoff.md: teammate drops a
// self-contained static web build into public/cdlc-sim/ (index.html + assets),
// and this page embeds it via iframe. Nothing 3D-specific is implemented here —
// public/cdlc-sim/ is empty until that handoff happens.
//
// The build is checked for first instead of always rendering the iframe:
// with no build present, /cdlc-sim/index.html 404s, but an iframe still
// fires "load" on an error page, which would hide the placeholder and show
// a blank/broken frame instead of the "coming soon" message.
export default function ThreeDWorld() {
  const [available, setAvailable] = useState(null); // null = checking, true/false = result

  useEffect(() => {
    let cancelled = false;
    fetch("/cdlc-sim/index.html", { method: "HEAD" })
      .then((res) => {
        if (!cancelled) setAvailable(res.ok);
      })
      .catch(() => {
        if (!cancelled) setAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">3D World — CDLC Simulation</h1>
      <p className="mb-6 text-slate-600 dark:text-slate-400">
        Walk through the CDLC facility in 3D. Build provided separately and dropped
        into <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">public/cdlc-sim/</code> per{" "}
        <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">docs/3d-integration-handoff.md</code>.
      </p>

      <div className="relative h-[60vh] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 sm:h-[70vh]">
        {available ? (
          <iframe
            src="/cdlc-sim/index.html"
            title="CDLC 3D Simulation"
            className="h-full w-full border-0"
            allow="fullscreen"
          />
        ) : (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-slate-50 dark:bg-slate-900">
            <div className="rounded-full bg-slate-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-dme-orange dark:bg-slate-800">
              Coming soon
            </div>
            <p className="text-slate-600 dark:text-slate-400">Waiting for the 3D build in public/cdlc-sim/…</p>
          </div>
        )}
      </div>
    </div>
  );
}
