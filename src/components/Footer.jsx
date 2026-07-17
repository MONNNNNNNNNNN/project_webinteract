import DmeLogo from "./DmeLogo.jsx";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-dme-navy dark:text-slate-400">
      <div className="mb-2 flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300">
        <DmeLogo className="h-5 w-5" />
        <span className="font-semibold">DME Explorer</span>
      </div>
      <p>Digital Media Engineering, Khon Kaen University</p>
      <p className="mt-1">Built for EN 842300 Interactive Web Programming</p>
    </footer>
  );
}
