import { useState } from "react";
import { Landmark, Mail, MapPin, Phone, Link2, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "../components/FadeIn.jsx";
import { LOCATIONS, directionsUrl } from "../../shared/locations.js";

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
  const [activeId, setActiveId] = useState(LOCATIONS[0].id);
  const active = LOCATIONS.find((l) => l.id === activeId) || LOCATIONS[0];

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

      <FadeIn delay={0.4} className="mt-8">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-none">
          <div className="border-b border-slate-200 p-4 dark:border-slate-800">
            <p className="font-semibold text-slate-900 dark:text-white">Find us</p>
            <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
              The programme teaches in two rooms, in different buildings.
            </p>

            {/* Same pill pattern as the Career and Curriculum filters, so the
                control reads as "switch the view" rather than as a new idea. */}
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((l) => (
                <motion.button
                  key={l.id}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveId(l.id)}
                  aria-pressed={activeId === l.id}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    activeId === l.id
                      ? "border-dme-orange bg-dme-orange/10 text-dme-orange"
                      : "border-slate-300 text-slate-500 hover:border-slate-400 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-500"
                  }`}
                >
                  {l.name}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-medium text-slate-900 dark:text-white">{active.fullName}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {active.floor}, {active.building}
              </p>
            </div>
            <a
              href={directionsUrl(active)}
              target="_blank"
              rel="noreferrer"
              className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-dme-orange px-4 py-2 text-sm font-medium text-white transition hover:brightness-110"
            >
              <Navigation className="h-4 w-4" />
              Go to Google Maps
            </a>
          </div>

          <AnimatePresence mode="wait">
            <motion.iframe
              key={active.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              title={`${active.name} location on Google Maps`}
              src={active.mapEmbed}
              className="h-64 w-full border-0 sm:h-80"
              /* Third-party frame below the fold — no reason to block first paint. */
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </AnimatePresence>

          <div className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
            The button opens directions to {active.name} from your current location.
            {active.mapPlace && (
              <>
                {" "}
                <a href={active.mapPlace} target="_blank" rel="noreferrer" className="text-dme-orange hover:underline">
                  Open the place page
                </a>{" "}
                for photos and opening hours.
              </>
            )}
          </div>
        </div>
      </FadeIn>

    </div>
  );
}
