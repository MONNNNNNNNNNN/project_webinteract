import { Phone, Mail } from "lucide-react";
import DmeLogo from "./DmeLogo.jsx";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-dme-navy dark:text-slate-400">
      <div className="mb-2 flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300">
        <DmeLogo className="h-5 w-5" />
        <span className="font-semibold">DME Explorer</span>
      </div>
      <p>Digital Media Engineering, Faculty of Engineering, Khon Kaen University</p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
        <span className="font-medium text-slate-600 dark:text-slate-300">International Affairs Division</span>
        <a href="tel:+6643202059" className="flex items-center gap-1 hover:text-dme-orange">
          <Phone className="h-3 w-3" /> +66 (0) 4320 2059
        </a>
        <a href="mailto:enforeign@kku.ac.th" className="flex items-center gap-1 hover:text-dme-orange">
          <Mail className="h-3 w-3" /> enforeign@kku.ac.th
        </a>
      </div>
    </footer>
  );
}
