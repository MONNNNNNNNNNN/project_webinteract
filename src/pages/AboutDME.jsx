import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
import DmeFullLogo from "../components/DmeFullLogo.jsx";
import FadeIn from "../components/FadeIn.jsx";
import { LECTURERS } from "../lib/staffData.js";

const facts = [
  {
    title: "What is DME?",
    body: "Digital Media Engineering (DME) is an international undergraduate program at Khon Kaen University's Faculty of Engineering that blends software engineering fundamentals with digital media production — 3D/animation, interactive media, AI, and game/software development.",
  },
  {
    title: "What do we learn?",
    body: "Students build a foundation in programming, data structures, and computer graphics in Years 1-2, then specialize in Years 3-4 through elective tracks: AI, Digital Media, Interactive, or Software. See the Curriculum Roadmap for the full plan.",
  },
  {
    title: "Vision & Mission",
    body: "To produce engineers who can design, build, and ship digital media products end-to-end — combining engineering rigor with creative and interactive media skills that the games, animation, and software industries need.",
  },
  {
    title: "Why choose DME KKU?",
    body: "DME-specific facilities (CDLC, Mac labs, VR/broadcast classrooms), an updated curriculum aligned with industry tools (Unity, Unreal, Adobe Suite, Figma, Blender), and a curriculum designed around 4 real specialization tracks rather than a generic CS degree.",
  },
];

function AccordionSection({ title, isOpen, onToggle, children }) {
  return (
    <div className="overflow-hidden rounded-lg border-l-2 border-dme-orange">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-2 pl-4 pr-2 text-left transition hover:bg-slate-100 dark:hover:bg-slate-900/40"
      >
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-5 w-5 text-slate-400" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4 pl-4 pr-2 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AboutDME() {
  const [openIndex, setOpenIndex] = useState(0);

  const sections = [...facts, { title: "Lecturer", isLecturer: true }];

  return (
    <div className="relative mx-auto max-w-4xl overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-10%,rgba(249,115,22,0.12),transparent_60%)]" />
      <FadeIn>
        <div className="mb-8 inline-block rounded-2xl bg-white px-6 py-4 shadow-xl">
          <DmeFullLogo iconClassName="h-16 w-16" textClassName="text-xl" />
        </div>

        <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">About DME</h1>
        <p className="mb-10 text-slate-600 dark:text-slate-400">
          Digital Media Engineering at Khon Kaen University's Faculty of Engineering.
        </p>
      </FadeIn>

      <div className="space-y-3">
        {sections.map((s, i) => (
          <FadeIn key={s.title} delay={0.06 * i}>
            <AccordionSection
              title={s.title}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex((cur) => (cur === i ? -1 : i))}
            >
              {s.isLecturer ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {LECTURERS.map((l) => (
                    <div
                      key={l.name}
                      className="flex gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/40"
                    >
                      <img
                        src={l.photo}
                        alt={l.name}
                        className="h-16 w-16 shrink-0 rounded-full border border-slate-200 object-cover dark:border-slate-700"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {l.title} {l.name}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{l.education}</p>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{l.specialty}</p>
                        {l.profile ? (
                          <a
                            href={l.profile}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-dme-orange hover:underline"
                          >
                            View profile <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <a
                            href="https://gear.kku.ac.th/index.php/staff?lang=en"
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-dme-orange hover:underline"
                          >
                            Contact via directory <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600 dark:text-slate-300">{s.body}</p>
              )}
            </AccordionSection>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
