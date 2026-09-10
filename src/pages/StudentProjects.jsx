import { createElement, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Box,
  Brain,
  Camera,
  Clapperboard,
  Code2,
  Gamepad2,
  GraduationCap,
  Music,
  Palette,
  Presentation,
  Trophy,
  Users,
  X,
} from "lucide-react";
import FadeIn from "../components/FadeIn.jsx";
import { useContent } from "../lib/contentClient.js";
import { TRACK_ICONS } from "../lib/topicIcons.js";

// A lucide icon is a React component and cannot be stored in Postgres, so rows
// carry an icon *name* and it is resolved here. Unknown names fall back to the
// category's own icon rather than to an empty tile — an admin can type anything
// into that field, and a blank card is worse than an approximate one.
const ICONS = {
  Bot,
  Box,
  Brain,
  Camera,
  Clapperboard,
  Code2,
  Gamepad2,
  GraduationCap,
  Music,
  Palette,
  Presentation,
  Trophy,
  Users,
};

// The category chip is the only thing every card has, image or not. Giving it an
// icon means a card is identifiable before you read its title, and it doubles as
// the fallback art for a card with no image and no usable icon_name.
//
// Three of these categories are the same subjects as the Curriculum's elective
// tracks, so they read their icon out of TRACK_ICONS rather than naming a lucide
// component again — a project tagged "Digital Media" and the Digital Media track
// have to stay the same clapperboard. ("Software / AI" is a merged label with no
// single track, so it picks the AI side deliberately.) The washes stay local:
// they are this page's card art, not part of the shared vocabulary.
const CATEGORY_STYLES = {
  Award: { Icon: Trophy, wash: "from-amber-500/25 to-amber-500/5", tint: "text-amber-600 dark:text-amber-300" },
  "Field Study": { Icon: Users, wash: "from-sky-500/25 to-sky-500/5", tint: "text-sky-600 dark:text-sky-300" },
  "Digital Media": {
    Icon: TRACK_ICONS["Digital Media"],
    wash: "from-pink-500/25 to-pink-500/5",
    tint: "text-pink-600 dark:text-pink-300",
  },
  Interactive: {
    Icon: TRACK_ICONS.Interactive,
    wash: "from-blue-500/25 to-blue-500/5",
    tint: "text-blue-600 dark:text-blue-300",
  },
  "Software / AI": {
    Icon: TRACK_ICONS.AI,
    wash: "from-purple-500/25 to-purple-500/5",
    tint: "text-purple-600 dark:text-purple-300",
  },
};

const DEFAULT_STYLE = {
  Icon: Presentation,
  wash: "from-slate-500/20 to-slate-500/5",
  tint: "text-slate-500 dark:text-slate-400",
};

const styleFor = (category) => CATEGORY_STYLES[category] || DEFAULT_STYLE;

/** Fallback art for a card with no image: the icon on its category's wash. */
function IconTile({ project, className, iconClassName }) {
  const style = styleFor(project.category);
  const Icon = ICONS[project.iconName] || style.Icon;
  return (
    <div className={`flex items-center justify-center bg-gradient-to-br ${style.wash} ${className}`}>
      <Icon className={`${iconClassName} ${style.tint}`} strokeWidth={1.25} />
    </div>
  );
}

// Seed for supabase/migrations/0011 and the runtime fallback when Supabase is
// unreachable. Keep in sync with that migration if you edit it here.
const STATIC_PROJECTS = [
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
    iconName: "Clapperboard",
    desc: "A 3D animated short combining character rigging and real-time rendering, produced as a Digital Media Studio capstone.",
  },
  {
    title: "Campus Quest",
    category: "Interactive",
    iconName: "Gamepad2",
    desc: "A game-dev orientation project that turns the KKU campus into an explorable 2D game for incoming freshmen.",
  },
  {
    title: "DME FAQ Assistant",
    category: "Software / AI",
    iconName: "Bot",
    desc: "An early prototype chatbot answering common DME admissions questions, built with a lightweight NLP pipeline.",
  },
];

// Storage shape -> the shape this page already renders. Module scope because
// useContent takes it as an effect dependency.
function mapProjectRow(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    image: row.image_url || undefined,
    iconName: row.icon_name || undefined,
    real: row.is_real,
    desc: row.description,
  };
}

export default function StudentProjects() {
  const [selected, setSelected] = useState(null);
  const projects = useContent("projects", STATIC_PROJECTS, mapProjectRow);

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
          <FadeIn key={p.id || p.title} delay={0.08 * i}>
            <button
              onClick={() => setSelected(p)}
              /* flex-col, not block: Chrome vertically centres a button's
                 content once the button has a height, and h-full gives it one.
                 A card shorter than its row floated its image off the top edge,
                 leaving an uneven white band above and below. */
              className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-dme-orange hover:shadow-lg hover:shadow-dme-orange/10 dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-none"
            >
              {p.image ? (
                <img src={p.image} alt={p.title} className="h-40 w-full object-cover object-top" />
              ) : (
                <IconTile project={p} className="h-40 w-full" iconClassName="h-14 w-14" />
              )}
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-dme-orange/10 px-2 py-0.5 text-xs font-medium text-dme-orange dark:bg-dme-orange/20">
                    {createElement(styleFor(p.category).Icon, { className: "h-3.5 w-3.5" })}
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
                  <IconTile project={selected} className="h-48 w-full" iconClassName="h-20 w-20" />
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
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-dme-orange/10 px-2 py-0.5 text-xs font-medium text-dme-orange dark:bg-dme-orange/20">
                    {createElement(styleFor(selected.category).Icon, { className: "h-3.5 w-3.5" })}
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
