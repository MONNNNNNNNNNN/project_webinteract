import { useState, useMemo } from "react";
import { STUDENT_TYPES, FEE_BREAKDOWN, grandTotal, formatBaht } from "../lib/tuitionData.js";

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
      <h1 className="mb-2 text-3xl font-bold text-white">Tuition & Fees</h1>
      <p className="mb-8 text-slate-400">
        Select your student type to see a transparent breakdown of academic and
        living costs. Figures are demo data from a prior Studio 4 project — confirm
        with the faculty before treating these as official.
      </p>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {STUDENT_TYPES.map((s) => (
          <button
            key={s.id}
            onClick={() => setStatusId(s.id)}
            className={`rounded-xl border p-4 text-left transition ${
              statusId === s.id
                ? "border-dme-orange bg-dme-orange/10"
                : "border-slate-800 bg-slate-900/40 hover:border-slate-600"
            }`}
          >
            <p className="text-xs uppercase tracking-wide text-slate-400">Semester Fee</p>
            <p className="text-sm font-medium text-slate-300">{s.label}</p>
            <p className="text-2xl font-bold text-white">{formatBaht(s.semesterFee)}</p>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/40">
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <div>
            <h2 className="font-semibold text-white">Fee Breakdown</h2>
            <p className="text-xs text-slate-500">Detailed costs for {status.label}.</p>
          </div>
          <div className="flex gap-1 rounded-lg bg-slate-800 p-1">
            {["Per Semester", "Full 4 Years"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded px-3 py-1.5 text-sm font-medium transition ${
                  period === p ? "bg-dme-orange text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Academic Costs
          </p>
          <table className="mb-4 w-full text-sm">
            <tbody>
              {academicRows.map((r, i) => (
                <tr key={i} className="border-b border-slate-800/60 last:border-0">
                  <td className="py-2 text-slate-200">
                    {r.item}
                    <span className="ml-2 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] uppercase text-slate-400">
                      {r.type}
                    </span>
                  </td>
                  <td className="py-2 text-right font-medium text-slate-100">{formatBaht(r.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {status.hasLivingCost && livingRows.length > 0 && (
            <>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Estimated Living Costs
              </p>
              <table className="mb-4 w-full text-sm">
                <tbody>
                  {livingRows.map((r, i) => (
                    <tr key={i} className="border-b border-slate-800/60 last:border-0">
                      <td className="py-2 text-slate-200">
                        {r.item}
                        <span className="ml-2 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] uppercase text-slate-400">
                          {r.type}
                        </span>
                      </td>
                      <td className="py-2 text-right font-medium text-slate-100">{formatBaht(r.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        <div className="flex items-center justify-between rounded-b-xl bg-dme-orange/10 p-4">
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
          <p className="text-3xl font-bold text-white">{formatBaht(total)}</p>
        </div>
      </div>
    </div>
  );
}
