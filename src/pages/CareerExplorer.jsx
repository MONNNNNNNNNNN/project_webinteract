import ComingSoon from "../components/ComingSoon.jsx";

const interestFilters = ["3D & Animation", "Game Dev", "AI & Data", "Software"];

export default function CareerExplorer() {
  return (
    <ComingSoon
      title="Career Explorer"
      reason="This page will pull live, currently-open job listings from the JSearch API, filterable by interest area. Needs JSEARCH_API_KEY to be set before it can call the live API — see .env.example."
    >
      <div className="mt-6 flex flex-wrap justify-center gap-2 opacity-50">
        {interestFilters.map((f) => (
          <span key={f} className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
            {f}
          </span>
        ))}
      </div>
    </ComingSoon>
  );
}
