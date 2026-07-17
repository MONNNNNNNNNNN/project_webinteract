import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { STUDENT_TYPES, FEE_BREAKDOWN, grandTotal, formatBaht } from "../lib/tuitionData.js";
import FadeIn from "../components/FadeIn.jsx";

export default function TuitionFees() {
  const [statusId, setStatusId] = useState("thai");
  const [period, setPeriod] = useState("Per Semester");

  const status = STUDENT_TYPES.find((s) => s.id === statusId);
  const rows = FEE_BREAKDOWN[statusId][period];
  const total = useMemo(() => grandTotal(statusId, period), [statusId, period]);

  const academicRows = rows.filter((r) => r.type === "Mandatory" || r.type === "One-time");
  const livingRows = rows.filter((r) => r.type === "Optional");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <FadeIn>
        <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">Tuition & Fees</h1>
        <p className="mb-8 text-slate-600 dark:text-slate-400">
          Select your student type to see a transparent breakdown of academic and
          living costs. Figures are demo data from a prior Studio 4 project — confirm
          with the faculty before treating these as official.
        </p>

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {STUDENT_TYPES.map((s) => (
            <motion.button
              key={s.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setStatusId(s.id)}
              className={`rounded-xl border p-4 text-left transition ${
                statusId === s.id
                  ? "border-dme-orange bg-dme-orange/10"
                  : "border-slate-200 bg-white shadow-sm hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-none dark:hover:border-slate-600"
              }`}
            >
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Semester Fee</p>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{s.label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatBaht(s.semesterFee)}</p>
            </motion.button>
          ))}
        </div>
      </FadeIn>

      <FadeIn
        delay={0.1}
        className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-none"
      >
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">Fee Breakdown</h2>
            <p className="text-xs text-slate-500">Detailed costs for {status.label}.</p>
          </div>
          <div className="flex gap-1 self-start rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {["Per Semester", "Full 4 Years"].map((p) => (
              <motion.button
                key={p}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPeriod(p)}
                className={`rounded px-3 py-1.5 text-sm font-medium transition ${
                  period === p
                    ? "bg-dme-orange text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                {p}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Academic Costs
          </p>
          <div className="mb-4 overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {academicRows.map((r, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0 dark:border-slate-800/60">
                    <td className="py-2 text-slate-700 dark:text-slate-200">
                      {r.item}
                      <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {r.type}
                      </span>
                    </td>
                    <td className="py-2 text-right font-medium text-slate-900 dark:text-slate-100">{formatBaht(r.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {status.hasLivingCost && livingRows.length > 0 && (
            <>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Estimated Living Costs
              </p>
              <div className="mb-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {livingRows.map((r, i) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0 dark:border-slate-800/60">
                        <td className="py-2 text-slate-700 dark:text-slate-200">
                          {r.item}
                          <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            {r.type}
                          </span>
                        </td>
                        <td className="py-2 text-right font-medium text-slate-900 dark:text-slate-100">{formatBaht(r.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-2 rounded-b-xl bg-dme-orange/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-dme-orange">
              Grand Total ({period})
            </p>
            <p className="text-xs text-slate-500">
              {period === "Per Semester"
                ? "Includes mandatory academic fees + 4 months of estimated living costs."
                : "Includes 8 semesters of academic fees + ~40 months of estimated living costs."}
            </p>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={total}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15 }}
              className="text-3xl font-bold text-slate-900 dark:text-white"
            >
              {formatBaht(total)}
            </motion.p>
          </AnimatePresence>
        </div>
      </FadeIn>
    </div>
  );
}
