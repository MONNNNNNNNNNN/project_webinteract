import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, Clapperboard, Gamepad2, Code2, X, ChevronDown } from "lucide-react";
import { STUDY_PLAN, ELECTIVE_COURSES, CATEGORIES, PROGRAM_TOTAL_CREDITS } from "../lib/curriculumData.js";
import FadeIn from "../components/FadeIn.jsx";

const categoryColors = {
  AI: "bg-purple-500/10 text-purple-600 border-purple-500/40 dark:bg-purple-500/20 dark:text-purple-300",
  "Digital Media": "bg-pink-500/10 text-pink-600 border-pink-500/40 dark:bg-pink-500/20 dark:text-pink-300",
  Interactive: "bg-blue-500/10 text-blue-600 border-blue-500/40 dark:bg-blue-500/20 dark:text-blue-300",
  Software: "bg-emerald-500/10 text-emerald-600 border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-300",
};

const categoryIcons = {
  AI: Brain,
  "Digital Media": Clapperboard,
  Interactive: Gamepad2,
  Software: Code2,
};

// Matches the color legend from the 2026 Course Map PDF.
const typeColors = {
  "Gen Ed": "bg-yellow-500/10 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",
  Fundamental: "bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
  Compulsory: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  Elective: "bg-fuchsia-500/10 text-fuchsia-700 dark:bg-fuchsia-500/20 dark:text-fuchsia-300",
  "Practical Training": "bg-orange-500/10 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
  "Free Elective": "bg-cyan-500/10 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300",
};

// Credit breakdown from the official program page (en.kku.ac.th/web/en/beng-dme).
const CREDIT_BREAKDOWN = [
  { label: "General Education", credits: 30, note: "Language 12 · Humanities/Social Sciences 6 · Math/Sciences 12" },
  { label: "Basic Engineering", credits: 15, note: "Fundamental courses" },
  { label: "Core Engineering", credits: 36, note: "Compulsory major courses" },
  { label: "Elective Engineering", credits: 27, note: "Min. — AI / Digital Media / Interactive / Software tracks" },
  { label: "Field Experience", credits: 6, note: "Practical training / co-op" },
  { label: "Free Elective", credits: 6, note: "Min. — any faculty" },
];

function CourseCard({ course, onSelect }) {
  return (
    <button
      onClick={() => onSelect(course)}
      className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-dme-orange hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-none dark:hover:border-slate-600"
    >
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{course.code}</span>
        <span>{course.credits} cr</span>
      </div>
      <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{course.name}</p>
      {course.type && (
        <span className={`mt-2 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${typeColors[course.type]}`}>
          {course.type}
        </span>
      )}
    </button>
  );
}

function CourseModal({ course, onClose }) {
  return (
    <AnimatePresence>
      {course && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-slate-900"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{course.code}</p>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{course.name}</h3>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {course.credits} credits
              </span>
              {course.type && (
                <span className={`rounded px-2 py-1 text-xs font-semibold uppercase ${typeColors[course.type]}`}>
                  {course.type}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Detailed course description not yet published here — refer to the official KKU course
              syllabus for full content, prerequisites, and learning outcomes.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Per-year (non-cumulative) credits: each year's own load, not a running total.
const YEAR_SUMMARIES = STUDY_PLAN.reduce((acc, yearBlock) => {
  const cumulative = Math.max(0, ...yearBlock.semesters.map((s) => s.totalAccumulated || 0));
  const prevCumulative = acc.length ? acc[acc.length - 1].cumulative : 0;
  const courseCount = yearBlock.semesters.reduce((n, s) => n + s.courses.length, 0);
  acc.push({ year: yearBlock.year, yearCredits: cumulative - prevCumulative, cumulative, courseCount });
  return acc;
}, []);

export default function CurriculumRoadmap() {
  const [section, setSection] = useState("curriculum"); // "curriculum" | "course"
  const [courseView, setCourseView] = useState("plan"); // "plan" | "electives"
  const [activeCategory, setActiveCategory] = useState("AI");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openYear, setOpenYear] = useState(1);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <FadeIn>
        <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">Curriculum Roadmap</h1>
        <p className="mb-6 text-slate-600 dark:text-slate-400">
          {PROGRAM_TOTAL_CREDITS} credits over 4 years (Cooperative Education track).
        </p>

        <div className="mb-8 flex flex-wrap gap-2">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setSection("curriculum")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              section === "curriculum"
                ? "bg-dme-orange text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            Curriculum
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setSection("course")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              section === "course"
                ? "bg-dme-orange text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            Course
          </motion.button>
        </div>
      </FadeIn>

      {section === "curriculum" && (
        <FadeIn className="space-y-8">
          <div>
            <h2 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">What you'll study</h2>
            <p className="mb-3 text-slate-600 dark:text-slate-300">
              Digital Media Engineering students specialize in developing, implementing, and optimizing
              technology systems for creating, processing, delivering, and displaying digital content.
            </p>
            <p className="mb-3 text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-white">Core responsibilities:</span>{" "}
              designing applications, implementing streaming technologies, developing interactive
              experiences, and building asset management systems.
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-white">Key competencies:</span>{" "}
              programming for audio/video, streaming protocols, interactive media development, user
              experience design, and virtual/augmented reality technologies.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">Credit breakdown</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CREDIT_BREAKDOWN.map((c) => (
                <div
                  key={c.label}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/30 dark:shadow-none"
                >
                  <p className="text-2xl font-bold text-dme-orange">{c.credits}</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{c.label}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{c.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">Year by year</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {YEAR_SUMMARIES.map((y, i) => (
                <FadeIn key={y.year} delay={0.05 * i}>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setOpenYear(y.year);
                      setCourseView("plan");
                      setSection("course");
                    }}
                    className="block h-full w-full rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-dme-orange dark:border-slate-800 dark:bg-slate-900/30 dark:shadow-none dark:hover:bg-slate-900"
                  >
                    <h3 className="mb-2 text-lg font-bold text-dme-orange">Year {y.year}</h3>
                    <p className="mb-1 text-2xl font-bold text-slate-900 dark:text-white">{y.yearCredits}</p>
                    <p className="text-xs text-slate-500">credits this year · {y.courseCount} courses</p>
                  </motion.button>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>
      )}

      {section === "course" && (
        <FadeIn>
          <div className="mb-6 flex flex-wrap gap-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setCourseView("plan")}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                courseView === "plan"
                  ? "border-dme-orange bg-dme-orange/10 text-dme-orange"
                  : "border-slate-300 text-slate-500 hover:border-slate-400 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-500"
              }`}
            >
              4-Year Study Plan
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setCourseView("electives")}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                courseView === "electives"
                  ? "border-dme-orange bg-dme-orange/10 text-dme-orange"
                  : "border-slate-300 text-slate-500 hover:border-slate-400 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-500"
              }`}
            >
              Major Elective Tracks
            </motion.button>
          </div>

          {courseView === "plan" && (
            <div className="space-y-3">
              {STUDY_PLAN.map((yearBlock, yi) => {
                const isOpen = openYear === yearBlock.year;
                const summary = YEAR_SUMMARIES.find((y) => y.year === yearBlock.year);
                return (
                  <FadeIn
                    key={yearBlock.year}
                    delay={0.05 * yi}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/30 dark:shadow-none"
                  >
                    <button
                      onClick={() => setOpenYear((cur) => (cur === yearBlock.year ? null : yearBlock.year))}
                      className="flex w-full items-center justify-between p-5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-900/60"
                    >
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-dme-orange">Year {yearBlock.year}</h2>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {summary.yearCredits} credits · {summary.courseCount} courses
                        </span>
                      </div>
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
                          <div className="px-5 pb-5">
                            {yearBlock.semesters.map((sem) => (
                              <div key={sem.name} className="mb-5 last:mb-0">
                                <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">{sem.name}</h3>
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                  {sem.courses.map((c, i) => (
                                    <CourseCard key={`${c.code}-${i}`} course={c} onSelect={setSelectedCourse} />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </FadeIn>
                );
              })}
            </div>
          )}

          {courseView === "electives" && (
            <>
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
                          : "border-slate-300 text-slate-500 hover:border-slate-400 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-500"
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
                  <CourseCard key={`${course.code}-${i}`} course={course} onSelect={setSelectedCourse} />
                ))}
              </div>
            </>
          )}
        </FadeIn>
      )}

      <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </div>
  );
}
