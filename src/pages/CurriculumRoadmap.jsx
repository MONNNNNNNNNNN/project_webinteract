import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  ChevronDown,
  Film,
  Radio,
  MousePointerClick,
  Palette,
  Boxes,
  AudioLines,
  MonitorSmartphone,
  Glasses,
} from "lucide-react";
import { STUDY_PLAN, ELECTIVE_COURSES, CATEGORIES, PROGRAM_TOTAL_CREDITS } from "../../shared/curriculumData.js";
import { COURSE_DESCRIPTIONS } from "../../shared/courseDescriptions.js";
import FadeIn from "../components/FadeIn.jsx";
import { useContent } from "../lib/contentClient.js";
import { TRACK_ICONS, CREDIT_CATEGORY_ICONS, barWidth } from "../lib/topicIcons.js";

const categoryColors = {
  AI: "bg-purple-500/10 text-purple-600 border-purple-500/40 dark:bg-purple-500/20 dark:text-purple-300",
  "Digital Media": "bg-pink-500/10 text-pink-600 border-pink-500/40 dark:bg-pink-500/20 dark:text-pink-300",
  Interactive: "bg-blue-500/10 text-blue-600 border-blue-500/40 dark:bg-blue-500/20 dark:text-blue-300",
  Software: "bg-emerald-500/10 text-emerald-600 border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-300",
};

const categoryIcons = TRACK_ICONS;

// "What you'll study" used to be three paragraphs of prose. The content is
// really two lists, so it renders as two lists — an icon per item is something
// you can scan, where the same words inside a sentence are something you have
// to read.
const RESPONSIBILITIES = [
  { icon: MonitorSmartphone, label: "Designing applications" },
  { icon: Radio, label: "Implementing streaming technologies" },
  { icon: MousePointerClick, label: "Developing interactive experiences" },
  { icon: Boxes, label: "Building asset management systems" },
];

const COMPETENCIES = [
  { icon: AudioLines, label: "Audio / video programming" },
  { icon: Radio, label: "Streaming protocols" },
  { icon: Film, label: "Interactive media development" },
  { icon: Palette, label: "User experience design" },
  { icon: Glasses, label: "Virtual & augmented reality" },
];

// Matches the color legend from the 2026 Course Map PDF.
const typeColors = {
  "Gen Ed": "bg-yellow-500/10 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",
  Fundamental: "bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
  Compulsory: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  Elective: "bg-fuchsia-500/10 text-fuchsia-700 dark:bg-fuchsia-500/20 dark:text-fuchsia-300",
  "Practical Training": "bg-orange-500/10 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
  "Free Elective": "bg-cyan-500/10 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300",
};

// Short course.type -> full credit-breakdown category name.
const TYPE_TO_CATEGORY = {
  "Gen Ed": "General Education",
  Fundamental: "Basic Engineering",
  Compulsory: "Core Engineering",
  Elective: "Elective Engineering",
  "Practical Training": "Field Experience",
  "Free Elective": "Free Elective",
};

// Full category name -> chip color (reuses the same legend as typeColors).
const categoryChipColors = {
  "General Education": typeColors["Gen Ed"],
  "Basic Engineering": typeColors.Fundamental,
  "Core Engineering": typeColors.Compulsory,
  "Elective Engineering": typeColors.Elective,
  "Field Experience": typeColors["Practical Training"],
  "Free Elective": typeColors["Free Elective"],
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

function CourseModal({ course, details, onClose }) {
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
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 dark:bg-slate-900"
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
              {course.categoryLabel && (
                <span className={`rounded px-2 py-1 text-xs font-semibold ${categoryChipColors[course.categoryLabel] || ""}`}>
                  {course.categoryLabel}
                </span>
              )}
            </div>
            {details ? (
              <div className="space-y-3">
                {details.prerequisites && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">Prerequisites:</span>{" "}
                    {details.prerequisites}
                  </p>
                )}
                <p className="text-sm text-slate-600 dark:text-slate-300">{details.descriptionEn}</p>
                {details.descriptionTh && (
                  <p className="border-t border-slate-100 pt-3 text-xs italic text-slate-500 dark:border-slate-800 dark:text-slate-500">
                    {details.descriptionTh}
                  </p>
                )}
                <p className="text-[11px] text-slate-400 dark:text-slate-600">
                  Source: official KKU DME curriculum document (มคอ.2)
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Detailed course description not yet published here — refer to the official KKU course
                syllabus for full content, prerequisites, and learning outcomes.
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// The static modules are nested; the tables are flat. Flatten the static copies
// once so both sources share one shape and everything below has a single path.
const STATIC_STUDY_PLAN_ROWS = STUDY_PLAN.flatMap((y) =>
  y.semesters.flatMap((s) =>
    s.courses.map((c) => ({
      year: y.year,
      semesterName: s.name,
      totalAccumulated: s.totalAccumulated ?? null,
      code: c.code,
      name: c.name,
      credits: c.credits,
      type: c.type,
    }))
  )
);

const STATIC_ELECTIVE_ROWS = Object.entries(ELECTIVE_COURSES).flatMap(([track, list]) =>
  list.map((c) => ({ track, code: c.code, name: c.name, credits: c.credits }))
);

const STATIC_COURSE_ROWS = Object.entries(COURSE_DESCRIPTIONS).map(([code, d]) => ({
  code,
  descriptionEn: d.descriptionEn,
  descriptionTh: d.descriptionTh,
  prerequisites: d.prerequisites,
}));

// Storage shape -> the shape this page renders. Module scope: useContent takes
// these as effect dependencies.
function mapStudyPlanRow(r) {
  return {
    year: r.year,
    semesterName: r.semester_name,
    totalAccumulated: r.total_accumulated,
    code: r.course_code,
    name: r.course_name,
    credits: r.credits,
    type: r.course_type,
  };
}

function mapElectiveRow(r) {
  return { track: r.track, code: r.course_code, name: r.course_name, credits: r.credits };
}

function mapCourseRow(r) {
  return {
    code: r.code,
    descriptionEn: r.description_en,
    descriptionTh: r.description_th,
    prerequisites: r.prerequisites,
  };
}

// 'Semester 1' | 'Semester 2' | 'Summer'. Rows arrive already ordered by
// sort_order; this only orders the semesters within a year.
const SEMESTER_ORDER = ["Semester 1", "Semester 2", "Summer"];
const semesterRank = (name) => (SEMESTER_ORDER.indexOf(name) + 1 || 99);

/** Flat rows -> the nested year/semester/course shape the markup expects. */
function reassembleStudyPlan(rows) {
  const years = new Map();
  rows.forEach((r) => {
    if (!years.has(r.year)) years.set(r.year, new Map());
    const semesters = years.get(r.year);
    if (!semesters.has(r.semesterName)) {
      semesters.set(r.semesterName, {
        name: r.semesterName,
        totalAccumulated: r.totalAccumulated,
        courses: [],
      });
    }
    semesters.get(r.semesterName).courses.push({
      code: r.code,
      name: r.name,
      credits: r.credits,
      type: r.type,
    });
  });

  return [...years.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, semesters]) => ({
      year,
      semesters: [...semesters.values()].sort((a, b) => semesterRank(a.name) - semesterRank(b.name)),
    }));
}

function groupElectives(rows) {
  const byTrack = {};
  rows.forEach((r) => {
    if (!byTrack[r.track]) byTrack[r.track] = [];
    byTrack[r.track].push({ code: r.code, name: r.name, credits: r.credits });
  });
  return byTrack;
}

// Per-year (non-cumulative) credits: each year's own load, not a running total.
function buildYearSummaries(plan) {
  return plan.reduce((acc, yearBlock) => {
    const cumulative = Math.max(0, ...yearBlock.semesters.map((s) => s.totalAccumulated || 0));
    const prevCumulative = acc.length ? acc[acc.length - 1].cumulative : 0;
    const courseCount = yearBlock.semesters.reduce((n, s) => n + s.courses.length, 0);
    acc.push({ year: yearBlock.year, yearCredits: cumulative - prevCumulative, cumulative, courseCount });
    return acc;
  }, []);
}

// All courses grouped by full category name. Elective Engineering pulls the real
// elective pool rather than the study plan's placeholder "Elective Course" slot
// rows, since those name no actual course.
function buildAllByCategory(plan, electives) {
  const map = Object.fromEntries(CREDIT_BREAKDOWN.map((c) => [c.label, []]));
  plan.forEach((yearBlock) =>
    yearBlock.semesters.forEach((sem) =>
      sem.courses.forEach((c) => {
        const cat = TYPE_TO_CATEGORY[c.type];
        if (cat && cat !== "Elective Engineering") map[cat].push(c);
      })
    )
  );
  Object.values(electives).forEach((list) =>
    list.forEach((c) => map["Elective Engineering"].push(c))
  );
  return map;
}

export default function CurriculumRoadmap() {
  const [section, setSection] = useState("curriculum"); // "curriculum" | "course"
  const [courseView, setCourseView] = useState("plan"); // "plan" | "electives" | "allCourses"
  const [activeCategory, setActiveCategory] = useState("AI");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openYear, setOpenYear] = useState(null);
  const [openAllCoursesCategory, setOpenAllCoursesCategory] = useState(null);

  const studyPlanRows = useContent("study_plan", STATIC_STUDY_PLAN_ROWS, mapStudyPlanRow);
  const electiveRows = useContent("elective_courses", STATIC_ELECTIVE_ROWS, mapElectiveRow);
  const courseRows = useContent("courses", STATIC_COURSE_ROWS, mapCourseRow);

  const studyPlan = useMemo(() => reassembleStudyPlan(studyPlanRows), [studyPlanRows]);
  const electiveCourses = useMemo(() => groupElectives(electiveRows), [electiveRows]);
  const descriptions = useMemo(
    () => Object.fromEntries(courseRows.map((c) => [c.code, c])),
    [courseRows]
  );
  const yearSummaries = useMemo(() => buildYearSummaries(studyPlan), [studyPlan]);
  // Guarded: an admin can empty the study plan, and 0 would make every bar NaN.
  const heaviestYear = useMemo(
    () => Math.max(1, ...yearSummaries.map((y) => y.yearCredits)),
    [yearSummaries]
  );
  const allByCategory = useMemo(
    () => buildAllByCategory(studyPlan, electiveCourses),
    [studyPlan, electiveCourses]
  );
  // CATEGORIES fixes the canonical order; anything an admin adds beyond it is
  // appended rather than dropped.
  const trackNames = useMemo(() => {
    const present = Object.keys(electiveCourses);
    return [
      ...CATEGORIES.filter((c) => present.includes(c)),
      ...present.filter((c) => !CATEGORIES.includes(c)),
    ];
  }, [electiveCourses]);

  function openCourse(course, categoryLabel) {
    setSelectedCourse({ ...course, categoryLabel: categoryLabel || TYPE_TO_CATEGORY[course.type] || null });
  }

  function goToAllCoursesCategory(label) {
    setOpenAllCoursesCategory(label);
    setCourseView("allCourses");
    setSection("course");
  }

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

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/30 dark:shadow-none">
                <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                  Core responsibilities
                </p>
                <ul className="space-y-2">
                  {RESPONSIBILITIES.map((r) => (
                    <li key={r.label} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                      <r.icon className="h-4 w-4 shrink-0 text-dme-orange" strokeWidth={1.75} />
                      {r.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/30 dark:shadow-none">
                <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                  Key competencies
                </p>
                <ul className="space-y-2">
                  {COMPETENCIES.map((c) => (
                    <li key={c.label} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                      <c.icon className="h-4 w-4 shrink-0 text-dme-orange" strokeWidth={1.75} />
                      {c.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">Credit breakdown</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CREDIT_BREAKDOWN.map((c) => (
                <motion.button
                  key={c.label}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => goToAllCoursesCategory(c.label)}
                  /* Same Chrome quirk as the year cards: a grid stretches these
                     to the tallest in the row, and a button with a height
                     centres its own content. flex-col keeps them aligned. */
                  className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-dme-orange dark:border-slate-800 dark:bg-slate-900/30 dark:shadow-none dark:hover:bg-slate-900"
                >
                  <div className="flex items-start gap-3">
                    {(() => {
                      const meta = CREDIT_CATEGORY_ICONS[c.label];
                      if (!meta) return null;
                      return (
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                          <meta.Icon className={`h-5 w-5 ${meta.tint}`} strokeWidth={1.75} />
                        </span>
                      );
                    })()}
                    <div className="min-w-0 flex-1">
                      <p className="text-2xl font-bold leading-none text-dme-orange">{c.credits}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{c.label}</p>
                    </div>
                  </div>

                  {/* Width is the share of the whole degree, so six numbers you
                      would otherwise have to compare become six lengths. */}
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-dme-orange/70"
                      style={{ width: barWidth(c.credits, PROGRAM_TOTAL_CREDITS) }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{c.note}</p>
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">Year by year</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {yearSummaries.map((y, i) => (
                <FadeIn key={y.year} delay={0.05 * i}>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setOpenYear(y.year);
                      setCourseView("plan");
                      setSection("course");
                    }}
                    /* flex-col so the content sits at the top: Chrome centres a
                       button's content vertically once h-full gives it a fixed
                       height, which drifts the year label off the card's edge. */
                    className="flex h-full w-full flex-col rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-dme-orange dark:border-slate-800 dark:bg-slate-900/30 dark:shadow-none dark:hover:bg-slate-900"
                  >
                    <div className="mb-3 flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-dme-orange/15 text-sm font-bold text-dme-orange">
                        {y.year}
                      </span>
                      <h3 className="text-lg font-bold text-dme-orange">Year {y.year}</h3>
                    </div>
                    <p className="mb-1 text-2xl font-bold text-slate-900 dark:text-white">{y.yearCredits}</p>
                    <p className="text-xs text-slate-500">credits this year · {y.courseCount} courses</p>
                    {/* Against the heaviest year, so the lighter final year is
                        visible as a shorter bar rather than as a smaller number. */}
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-dme-orange/70"
                        style={{ width: barWidth(y.yearCredits, heaviestYear) }}
                      />
                    </div>
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
              onClick={() => {
                setOpenYear(null);
                setCourseView("plan");
              }}
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
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setOpenAllCoursesCategory(null);
                setCourseView("allCourses");
              }}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                courseView === "allCourses"
                  ? "border-dme-orange bg-dme-orange/10 text-dme-orange"
                  : "border-slate-300 text-slate-500 hover:border-slate-400 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-500"
              }`}
            >
              All Courses
            </motion.button>
          </div>

          {courseView === "plan" && (
            <div className="space-y-3">
              {studyPlan.map((yearBlock, yi) => {
                const isOpen = openYear === yearBlock.year;
                const summary = yearSummaries.find((y) => y.year === yearBlock.year);
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
                          {summary?.yearCredits} credits · {summary?.courseCount} courses
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
                                    <CourseCard key={`${c.code}-${i}`} course={c} onSelect={(cc) => openCourse(cc)} />
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
                {trackNames.map((cat) => {
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
                {(electiveCourses[activeCategory] || []).map((course, i) => (
                  <CourseCard
                    key={`${course.code}-${i}`}
                    course={course}
                    onSelect={(cc) => openCourse(cc, "Elective Engineering")}
                  />
                ))}
              </div>
            </>
          )}

          {courseView === "allCourses" && (
            <div className="space-y-3">
              {CREDIT_BREAKDOWN.map((cat, i) => {
                const isOpen = openAllCoursesCategory === cat.label;
                const courses = allByCategory[cat.label] || [];
                return (
                  <FadeIn
                    key={cat.label}
                    delay={0.05 * i}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/30 dark:shadow-none"
                  >
                    <button
                      onClick={() => setOpenAllCoursesCategory((cur) => (cur === cat.label ? null : cat.label))}
                      className="flex w-full items-center justify-between p-5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-900/60"
                    >
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-dme-orange">{cat.label}</h2>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {cat.credits} credits · {courses.length} courses
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
                          <div className="grid grid-cols-1 gap-2 px-5 pb-5 sm:grid-cols-2 lg:grid-cols-3">
                            {courses.map((c, ci) => (
                              <CourseCard
                                key={`${c.code}-${ci}`}
                                course={c}
                                onSelect={(cc) => openCourse(cc, cat.label)}
                              />
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
        </FadeIn>
      )}

      <CourseModal
        course={selectedCourse}
        details={selectedCourse ? descriptions[selectedCourse.code] : null}
        onClose={() => setSelectedCourse(null)}
      />
    </div>
  );
}
