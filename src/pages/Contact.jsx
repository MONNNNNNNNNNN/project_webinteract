import { Landmark, Mail, MapPin } from "lucide-react";
import FadeIn from "../components/FadeIn.jsx";

const channels = [
  { label: "Faculty", value: "Faculty of Engineering, Khon Kaen University", icon: Landmark },
  { label: "Email", value: "dme-info@kku.ac.th", icon: Mail },
  { label: "Address", value: "123 Mittraphap Rd, Khon Kaen 40002, Thailand", icon: MapPin },
];

export default function Contact() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <FadeIn>
        <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">Contact</h1>
        <p className="mb-8 text-slate-600 dark:text-slate-400">
          Questions about the DME program? Reach out through any of the channels below.
        </p>
      </FadeIn>

      <div className="space-y-4">
        {channels.map((c, i) => (
          <FadeIn key={c.label} delay={0.06 * i}>
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-dme-orange dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-none">
              <c.icon className="h-6 w-6 shrink-0 text-dme-orange" strokeWidth={1.5} />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{c.label}</p>
                <p className="text-slate-900 dark:text-white">{c.value}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <p className="mt-8 text-xs text-slate-500">
        Placeholder contact details — replace with real program contacts.
      </p>
    </div>
  );
}
