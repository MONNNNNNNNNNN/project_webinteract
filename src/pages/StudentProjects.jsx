import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clapperboard, Gamepad2, Bot, X } from "lucide-react";
import FadeIn from "../components/FadeIn.jsx";

const projects = [
  {
    title: "Thailand Research Expo 2024 — Bronze Medal",
    category: "Award",
    image: "/projects/expo2024-bronze.jpg",
    real: true,
    desc: "DME students won a Bronze Medal at the Higher Education Innovation Stage, Thailand Research Expo 2024 (มหกรรมงานวิจัยแห่งชาติ 2567).",
  },
  {
    title: "Studio Visit — The Monk Studios, Igdrasil Group, Zurreal Studio",
    category: "Field Study",
    image: "/projects/studio-visit-2024.jpg",
    real: true,
    desc: "March 7–9, 2024: 36 third-year DME students visited three digital media companies to build real-world industry experience alongside classroom learning.",
  },
  {
    title: "Interactive Album Story",
    category: "Digital Media",
    icon: Clapperboard,
    desc: "A 3D animated short combining character rigging and real-time rendering, produced as a Digital Media Studio capstone.",
  },
  {
    title: "Campus Quest",
    category: "Interactive",
    icon: Gamepad2,
    desc: "A game-dev orientation project that turns the KKU campus into an explorable 2D game for incoming freshmen.",
  },
  {
    title: "DME FAQ Assistant",
    category: "Software / AI",
    icon: Bot,
    desc: "An early prototype chatbot answering common DME admissions questions, built with a lightweight NLP pipeline.",
  },
];

export default function StudentProjects() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <FadeIn>
        <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">Student Projects & Competition</h1>
        <p className="mb-8 text-slate-600 dark:text-slate-400">
          A sample of work, activities, and competition results from DME students. Entries
          marked "Real" are sourced from official KKU coverage; the rest are placeholder
          entries pending real project media and links.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <FadeIn key={p.title} delay={0.08 * i}>
            <button
              onClick={() => setSelected(p)}
              className="block h-full w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-dme-orange hover:shadow-lg hover:shadow-dme-orange/10 dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-none"
            >
              {p.image ? (
                <img src={p.image} alt={p.title} className="h-40 w-full object-cover object-top" />
              ) : (
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                  <p.icon className="h-12 w-12 text-dme-orange" strokeWidth={1.5} />
                </div>
              )}
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-block rounded-full bg-dme-orange/10 px-2 py-0.5 text-xs font-medium text-dme-orange dark:bg-dme-orange/20">
                    {p.category}
                  </span>
                  {p.real && (
                    <span className="inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
                      Real
                    </span>
                  )}
                </div>
                <h2 className="mb-1 font-semibold text-slate-900 dark:text-white">{p.title}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">{p.desc}</p>
              </div>
            </button>
          </FadeIn>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white dark:bg-slate-900"
            >
              <div className="relative">
                {selected.image ? (
                  <img src={selected.image} alt={selected.title} className="w-full object-cover object-top" />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                    <selected.icon className="h-16 w-16 text-dme-orange" strokeWidth={1.5} />
                  </div>
                )}
                <button
                  onClick={() => setSelected(null)}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-block rounded-full bg-dme-orange/10 px-2 py-0.5 text-xs font-medium text-dme-orange dark:bg-dme-orange/20">
                    {selected.category}
                  </span>
                  {selected.real && (
                    <span className="inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
                      Real
                    </span>
                  )}
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">{selected.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{selected.desc}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
