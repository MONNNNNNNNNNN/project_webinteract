import DmeLogo from "./DmeLogo.jsx";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-dme-navy py-6 text-center text-sm text-slate-400">
      <div className="mb-2 flex items-center justify-center gap-2 text-slate-300">
        <DmeLogo className="h-5 w-5 text-dme-orange" />
        <span className="font-semibold">DME Explorer</span>
      </div>
      <p>Digital Media Engineering, Khon Kaen University</p>
      <p className="mt-1">Built for EN 842300 Interactive Web Programming</p>
    </footer>
  );
}
