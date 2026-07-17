import { useState } from "react";
import { STUDY_PLAN, ELECTIVE_COURSES, CATEGORIES, PROGRAM_TOTAL_CREDITS } from "../lib/curriculumData.js";

const categoryColors = {
  AI: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  "Digital Media": "bg-pink-500/20 text-pink-300 border-pink-500/40",
  Interactive: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  Software: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
};

const categoryIcons = {
  AI: "🧠",
  "Digital Media": "🎬",
  Interactive: "🕹️",
  Software: "💻",
};

function CourseCard({ course }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{course.code}</span>
        <span>{course.credits}</span>
      </div>
      <p className="mt-1 text-sm font-medium text-slate-100">{course.name}</p>
    </div>
  );
}

export default function CurriculumRoadmap() {
  const [view, setView] = useState("plan"); // "plan" | "electives"
  const [activeCategory, setActiveCategory] = useState("AI");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-white">Curriculum Roadmap</h1>
      <p className="mb-6 text-slate-400">
        {PROGRAM_TOTAL_CREDITS} credits over 4 years. Data sourced from the DME
        (International Program) Revised Curriculum, B.E. 2565 / 2022 — see{" "}
        <code className="rounded bg-slate-800 px-1">docs/reference/curriculum-data.md</code>{" "}
        for the full source and caveats.
      </p>

      <div className="mb-8 flex gap-2">
        <button
          onClick={() => setView("plan")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            view === "plan" ? "bg-dme-orange text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          4-Year Study Plan
        </button>
        <button
          onClick={() => setView("electives")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            view === "electives" ? "bg-dme-orange text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          Major Elective Tracks
        </button>
      </div>

      {view === "plan" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {STUDY_PLAN.map((yearBlock) => (
            <div key={yearBlock.year} className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
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
            </div>
          ))}
        </div>
      )}

      {view === "electives" && (
        <div>
          <div className="mb-6 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  activeCategory === cat
                    ? categoryColors[cat]
                    : "border-slate-700 text-slate-400 hover:border-slate-500"
                }`}
              >
                <span className="mr-1.5">{categoryIcons[cat]}</span>
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ELECTIVE_COURSES[activeCategory].map((course, i) => (
              <CourseCard key={`${course.code}-${i}`} course={course} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
