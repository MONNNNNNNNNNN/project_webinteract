import ThreeDViewer from "../components/ThreeDViewer.jsx";

export default function ThreeDWorld() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">3D World — CDLC Simulation</h1>
      <p className="mb-6 text-slate-600 dark:text-slate-400">
        Test only. Real coming soon Touch devices: drag to look around.
      </p>

      <div className="relative h-[60vh] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 sm:h-[70vh]">
        <ThreeDViewer modelUrl="/3d/Base_floor_model.glb" />
      </div>
    </div>
  );
}
