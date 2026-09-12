import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { STUDENT_TYPES, FEE_BREAKDOWN, MEKONG_COUNTRIES, grandTotal, formatBaht } from "../../shared/tuitionData.js";
import { Wallet } from "lucide-react";
import FadeIn from "../components/FadeIn.jsx";
import { useContent } from "../lib/contentClient.js";
import { STUDENT_TYPE_ICONS, feeIcon } from "../lib/topicIcons.js";

// The static FEE_BREAKDOWN is nested by student type and period; site_fee_rows
// is flat. Flatten the static copy once so both sources share one shape and the
// grouping below has a single code path.
const STATIC_FEE_ROWS = STUDENT_TYPES.flatMap((s) =>
  Object.entries(FEE_BREAKDOWN[s.id]).flatMap(([period, list]) =>
    list.map((r) => ({
      studentTypeId: s.id,
      period,
      item: r.item,
      type: r.type,
      amount: r.amount,
      excludedFromTotal: Boolean(r.excludedFromTotal),
    }))
  )
);

// Storage shape -> the shape this page renders. Module scope: useContent takes
// these as effect dependencies.
function mapStudentType(row) {
  return {
    id: row.id,
    label: row.label,
    semesterFee: row.semester_fee,
    hasLivingCost: row.has_living_cost,
  };
}

function mapFeeRow(row) {
  return {
    id: row.id,
    studentTypeId: row.student_type_id,
    period: row.period,
    item: row.item,
    type: row.item_type,
    amount: row.amount,
    excludedFromTotal: row.excluded_from_total,
  };
}

// The academic and living-cost tables were the same markup twice. They are one
// component now, which is also the only sane place to hang the per-row icon.
function FeeTable({ rows }) {
  return (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((r, i) => {
            const Icon = feeIcon(r.item);
            return (
              <tr key={r.id || i} className="border-b border-slate-100 last:border-0 dark:border-slate-800/60">
                <td className="py-2 text-slate-700 dark:text-slate-200">
                  <span className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800">
                      <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400" strokeWidth={1.75} />
                    </span>
                    <span>
                      {r.item}
                      <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {r.type}
                      </span>
                    </span>
                  </span>
                </td>
                <td className="py-2 text-right font-medium text-slate-900 dark:text-slate-100">
                  {formatBaht(r.amount)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function TuitionFees() {
  const [statusId, setStatusId] = useState("thai");
  const [period, setPeriod] = useState("Per Semester");

  const studentTypes = useContent("student_types", STUDENT_TYPES, mapStudentType);
  const feeRows = useContent("fee_rows", STATIC_FEE_ROWS, mapFeeRow);

  // An admin can rename or remove the type this page opened on, so fall back to
  // the first available rather than rendering undefined.
  const status = studentTypes.find((s) => s.id === statusId) || studentTypes[0];

  const rows = useMemo(
    () => feeRows.filter((r) => r.studentTypeId === status?.id && r.period === period),
    [feeRows, status, period]
  );
  const academicRows = rows.filter((r) => r.type === "Mandatory" || r.type === "One-time");
  const livingRows = rows.filter((r) => r.type === "Optional");
  const showLiving = Boolean(status?.hasLivingCost) && livingRows.length > 0;

  // Sums exactly the rows on screen. Summing `rows` counted living costs even
  // for a student type whose living-cost table is hidden, so the total
  // disagreed with the breakdown directly above it.
  const total = grandTotal(showLiving ? [...academicRows, ...livingRows] : academicRows, period);

  if (!status) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <FadeIn>
        <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">Tuition & Fees</h1>
        <p className="mb-8 text-slate-600 dark:text-slate-400">
          Select your student type to see a transparent breakdown of academic and
          living costs, sourced from the official program page.
        </p>

        <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {studentTypes.map((s) => (
            <motion.button
              key={s.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setStatusId(s.id)}
              className={`rounded-xl border p-4 text-left transition ${
                status.id === s.id
                  ? "border-dme-orange bg-dme-orange/10"
                  : "border-slate-200 bg-white shadow-sm hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-none dark:hover:border-slate-600"
              }`}
            >
              <div className="mb-2 flex items-center gap-2.5">
                {/* An admin can add a student type this map has never seen, so
                    an unknown id falls back rather than rendering a hole. */}
                {(() => {
                  const Icon = STUDENT_TYPE_ICONS[s.id] || Wallet;
                  return (
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        status.id === s.id ? "bg-dme-orange/20" : "bg-slate-100 dark:bg-slate-800"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          status.id === s.id ? "text-dme-orange" : "text-slate-500 dark:text-slate-400"
                        }`}
                        strokeWidth={1.75}
                      />
                    </span>
                  );
                })()}
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Semester Fee</p>
                  <p className="truncate text-sm font-medium text-slate-600 dark:text-slate-300">{s.label}</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatBaht(s.semesterFee)}</p>
            </motion.button>
          ))}
        </div>

        {status.id === "mekong" && (
          <p className="mb-6 text-xs text-slate-500 dark:text-slate-400">
            Mekong Region rate applies to students from: {MEKONG_COUNTRIES.join(", ")}.
          </p>
        )}
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
          <FeeTable rows={academicRows} />

          {showLiving && (
            <>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Estimated Living Costs
              </p>
              <FeeTable rows={livingRows} />
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
