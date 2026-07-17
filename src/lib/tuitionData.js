// Real figures from Studio 4 Final Report, pages 38-39 (see docs/reference/tuition-data.md).
// Demo-only figures — not official KKU tuition data, confirm with faculty before publishing.

export const STUDENT_TYPES = [
  { id: "thai", label: "Thai Students", semesterFee: 45000, hasLivingCost: false },
  { id: "mekong", label: "Mekong Region", semesterFee: 50000, hasLivingCost: true },
  { id: "international", label: "International", semesterFee: 65000, hasLivingCost: true },
];

export const FEE_BREAKDOWN = {
  thai: {
    "Per Semester": [
      { item: "Tuition Fee", type: "Mandatory", amount: 45000 },
      { item: "Summer Training", type: "One-time", amount: 2500, excludedFromTotal: true },
    ],
    "Full 4 Years": [
      { item: "Tuition Fee (8 semesters)", type: "Mandatory", amount: 360000 },
      { item: "Summer Training", type: "One-time", amount: 2500 },
    ],
  },
  mekong: {
    "Per Semester": [
      { item: "Tuition Fee", type: "Mandatory", amount: 50000 },
      { item: "Summer Training", type: "One-time", amount: 2500, excludedFromTotal: true },
      { item: "Accommodation (monthly avg. x4)", type: "Optional", amount: 16000 },
      { item: "Cost of Living (monthly avg. x4)", type: "Optional", amount: 24000 },
    ],
    "Full 4 Years": [
      { item: "Tuition Fee (8 semesters)", type: "Mandatory", amount: 400000 },
      { item: "Summer Training", type: "One-time", amount: 2500 },
      { item: "Accommodation (~40 months)", type: "Optional", amount: 160000 },
      { item: "Cost of Living (~40 months)", type: "Optional", amount: 240000 },
    ],
  },
  international: {
    "Per Semester": [
      { item: "Tuition Fee", type: "Mandatory", amount: 65000 },
      { item: "Summer Training", type: "One-time", amount: 2500, excludedFromTotal: true },
      { item: "Enrollment Fee (new students)", type: "One-time", amount: 10000, excludedFromTotal: true },
      { item: "Accommodation (monthly avg. x4)", type: "Optional", amount: 16000 },
      { item: "Cost of Living (monthly avg. x4)", type: "Optional", amount: 24000 },
    ],
    "Full 4 Years": [
      { item: "Tuition Fee (8 semesters)", type: "Mandatory", amount: 520000 },
      { item: "Summer Training", type: "One-time", amount: 2500 },
      { item: "Enrollment Fee", type: "One-time", amount: 10000 },
      { item: "Accommodation (~40 months)", type: "Optional", amount: 160000 },
      { item: "Cost of Living (~40 months)", type: "Optional", amount: 240000 },
    ],
  },
};

export function grandTotal(statusId, period) {
  const rows = FEE_BREAKDOWN[statusId][period];
  return rows
    .filter((r) => !(period === "Per Semester" && r.excludedFromTotal))
    .reduce((sum, r) => sum + r.amount, 0);
}

export function formatBaht(amount) {
  return "฿" + amount.toLocaleString("en-US");
}
