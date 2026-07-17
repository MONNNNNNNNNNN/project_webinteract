import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Clapperboard, Gamepad2, Code2 } from "lucide-react";
import { STUDY_PLAN, ELECTIVE_COURSES, CATEGORIES, COURSE_TYPES, PROGRAM_TOTAL_CREDITS } from "../lib/curriculumData.js";
import FadeIn from "../components/FadeIn.jsx";

const categoryColors = {
  AI: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  "Digital Media": "bg-pink-500/20 text-pink-300 border-pink-500/40",
  Interactive: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  Software: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
};

const categoryIcons = {
  AI: Brain,
  "Digital Media": Clapperboard,
  Interactive: Gamepad2,
  Software: Code2,
};

// Matches the color legend from the 2026 Course Map PDF.
const typeColors = {
  "Gen Ed": "bg-yellow-500/20 text-yellow-300",
  Fundamental: "bg-rose-500/20 text-rose-300",
  Compulsory: "bg-emerald-500/20 text-emerald-300",
  Elective: "bg-fuchsia-500/20 text-fuchsia-300",
  "Practical Training": "bg-orange-500/20 text-orange-300",
  "Free Elective": "bg-cyan-500/20 text-cyan-300",
};

function CourseCard({ course }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3 transition hover:border-slate-600">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{course.code}</span>
        <span>{course.credits} cr</span>
      </div>
      <p className="mt-1 text-sm font-medium text-slate-100">{course.name}</p>
      {course.type && (
        <span className={`mt-2 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${typeColors[course.type]}`}>
          {course.type}
        </span>
      )}
    </div>
  );
}

const YEAR_SUMMARIES = STUDY_PLAN.map((yearBlock) => {
  const accumulated = Math.max(
    0,
    ...yearBlock.semesters.map((s) => s.totalAccumulated || 0)
  );
  const courseCount = yearBlock.semesters.reduce((n, s) => n + s.courses.length, 0);
  const types = [...new Set(yearBlock.semesters.flatMap((s) => s.courses.map((c) => c.type)))];
  return { year: yearBlock.year, accumulated, courseCount, types };
});

export default function CurriculumRoadmap() {
  const [view, setView] = useState("overview"); // "overview" | "plan" | "electives"
  const [activeCategory, setActiveCategory] = useState("AI");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <FadeIn>
        <h1 className="mb-2 text-3xl font-bold text-white">Curriculum Roadmap</h1>
        <p className="mb-6 text-slate-400">
          {PROGRAM_TOTAL_CREDITS} credits over 4 years (Cooperative Education track). Data
          from the 2026 International Program Course Map — see{" "}
          <code className="rounded bg-slate-800 px-1">docs/reference/curriculum-data.md</code>{" "}
          for the elective-track source and caveats.
        </p>

        <div className="mb-8 flex gap-2">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setView("overview")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              view === "overview" ? "bg-dme-orange text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Overview
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setView("plan")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              view === "plan" ? "bg-dme-orange text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            4-Year Study Plan
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setView("electives")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              view === "electives" ? "bg-dme-orange text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Major Elective Tracks
          </motion.button>
        </div>
      </FadeIn>

      {view === "overview" && (
        <FadeIn className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {YEAR_SUMMARIES.map((y, i) => (
            <FadeIn key={y.year} delay={0.05 * i}>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setView("plan")}
                className="block h-full w-full rounded-xl border border-slate-800 bg-slate-900/30 p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-dme-orange hover:bg-slate-900"
              >
                <h2 className="mb-3 text-xl font-bold text-dme-orange">Year {y.year}</h2>
                <p className="mb-1 text-3xl font-bold text-white">{y.accumulated}</p>
                <p className="mb-4 text-xs text-slate-500">credits by end of year</p>
                <p className="mb-3 text-xs text-slate-400">{y.courseCount} courses</p>
                <div className="flex flex-wrap gap-1.5">
                  {y.types.map((t) => (
                    <span key={t} className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${typeColors[t]}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </motion.button>
            </FadeIn>
          ))}
        </FadeIn>
      )}

      {view === "plan" && (
        <>
          <FadeIn delay={0.05} className="mb-6 flex flex-wrap gap-2">
            {COURSE_TYPES.map((t) => (
              <span key={t} className={`rounded px-2 py-1 text-[11px] font-semibold uppercase ${typeColors[t]}`}>
                {t}
              </span>
            ))}
          </FadeIn>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {STUDY_PLAN.map((yearBlock, yi) => (
              <FadeIn key={yearBlock.year} delay={0.05 * yi} className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
                <h2 className="mb-4 text-xl font-bold text-dme-orange">Year {yearBlock.year}</h2>
                {yearBlock.semesters.map((sem) => (
                  <div key={sem.name} className="mb-5 last:mb-0">
                    <div className="mb-2 flex items-baseline justify-between">
                      <h3 className="font-semibold text-white">{sem.name}</h3>
                      {sem.totalAccumulated && (
                        <span className="text-xs text-slate-500">
                          Accumulated: {sem.totalAccumulated} credits
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {sem.courses.map((c, i) => (
                        <CourseCard key={`${c.code}-${i}`} course={c} />
                      ))}
                    </div>
                  </div>
                ))}
              </FadeIn>
            ))}
          </div>
        </>
      )}

      {view === "electives" && (
        <FadeIn>
          <div className="mb-6 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = categoryIcons[cat];
              return (
                <motion.button
                  key={cat}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    activeCategory === cat
                      ? categoryColors[cat]
                      : "border-slate-700 text-slate-400 hover:border-slate-500"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {cat}
                </motion.button>
              );
            })}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ELECTIVE_COURSES[activeCategory].map((course, i) => (
              <CourseCard key={`${course.code}-${i}`} course={course} />
            ))}
          </div>
        </FadeIn>
      )}
    </div>
  );
}
