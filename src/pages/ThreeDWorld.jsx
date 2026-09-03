import { useState } from "react";
import { motion } from "framer-motion";
import { Box, Navigation } from "lucide-react";
import ThreeDViewer from "../components/ThreeDViewer.jsx";
import { LOCATIONS, directionsUrl } from "../../shared/locations.js";

export default function ThreeDWorld() {
  // Default to a room that actually has a model, whichever that is, so the page
  // never opens on an empty state.
  const [activeId, setActiveId] = useState(
    (LOCATIONS.find((l) => l.modelUrl) || LOCATIONS[0]).id
  );
  const active = LOCATIONS.find((l) => l.id === activeId) || LOCATIONS[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">3D World</h1>
      <p className="mb-6 text-slate-600 dark:text-slate-400">
        Walk through the rooms the programme teaches in. Desktop: click the view, then WASD or
        the arrow keys to move and the mouse to look. Touch: drag to look around, pinch to zoom.
      </p>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {LOCATIONS.map((l) => (
          <motion.button
            key={l.id}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveId(l.id)}
            aria-pressed={activeId === l.id}
            className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              activeId === l.id
                ? "border-dme-orange bg-dme-orange/10 text-dme-orange"
                : "border-slate-300 text-slate-500 hover:border-slate-400 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-500"
            }`}
          >
            {l.name}
            {/* Say up front which rooms are walkable, so nobody clicks hoping. */}
            {!l.modelUrl && (
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                soon
              </span>
            )}
          </motion.button>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{active.fullName}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {active.floor}, {active.building}
          </p>
        </div>
        <a
          href={directionsUrl(active)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 self-start text-sm text-slate-500 transition hover:text-dme-orange dark:text-slate-400"
        >
          <Navigation className="h-3.5 w-3.5" />
          Directions to {active.name}
        </a>
      </div>

      <div className="relative h-[60vh] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 sm:h-[70vh]">
        {active.modelUrl ? (
          // Remount on change: the viewer sets camera position once on mount, so
          // swapping the model underneath a live canvas would leave the camera
          // wherever the previous room left it.
          <ThreeDViewer key={active.modelUrl} modelUrl={active.modelUrl} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
            <Box className="h-10 w-10 text-slate-300 dark:text-slate-600" strokeWidth={1.5} />
            <p className="font-semibold text-slate-900 dark:text-white">
              {active.fullName} has not been scanned yet
            </p>
            <p className="max-w-md text-sm text-slate-600 dark:text-slate-400">
              {active.blurb} There is no walkthrough for this room yet — the {active.name} model is
              still to be built. Until then, the map on the Contact page will get you to the door.
            </p>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        The CDLC model is an early test scan of the floor, not a finished reconstruction.
      </p>
    </div>
  );
}
