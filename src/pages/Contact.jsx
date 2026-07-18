import { Landmark, Mail, MapPin, Phone, Link2 } from "lucide-react";
import FadeIn from "../components/FadeIn.jsx";

const channels = [
  { label: "Faculty", value: "Faculty of Engineering, Khon Kaen University", icon: Landmark },
  {
    label: "Address",
    value: "123 Mittraphap Road, Nai Muang Sub-district, Muang District, Khon Kaen 40002, Thailand",
    icon: MapPin,
  },
  { label: "Faculty Phone", value: "+66 (0) 4300 9700 ext. 50215 or 45641", icon: Phone, href: "tel:+6643009700" },
  { label: "International Affairs Division", value: "+66 (0) 4320 2059", icon: Phone, href: "tel:+6643202059" },
  { label: "Email", value: "enforeign@kku.ac.th", icon: Mail, href: "mailto:enforeign@kku.ac.th" },
  { label: "Facebook", value: "facebook.com/EngineeringKKU", icon: Link2, href: "https://facebook.com/EngineeringKKU" },
];

export default function Contact() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <FadeIn>
        <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">Contact</h1>
        <p className="mb-8 text-slate-600 dark:text-slate-400">
          Questions about the DME program, admissions, or registration? Reach out through
          any of the channels below.
        </p>
      </FadeIn>

      <div className="space-y-4">
        {channels.map((c, i) => {
          const content = (
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-dme-orange dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-none">
              <c.icon className="h-6 w-6 shrink-0 text-dme-orange" strokeWidth={1.5} />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{c.label}</p>
                <p className="text-slate-900 dark:text-white">{c.value}</p>
              </div>
            </div>
          );
          return (
            <FadeIn key={c.label} delay={0.06 * i}>
              {c.href ? (
                <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block">
                  {content}
                </a>
              ) : (
                content
              )}
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
