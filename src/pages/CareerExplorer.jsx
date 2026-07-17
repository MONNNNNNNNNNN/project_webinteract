import { useEffect, useState } from "react";

const interestFilters = ["3D & Animation", "Game Dev", "AI & Data", "Software"];

export default function CareerExplorer() {
  const [interest, setInterest] = useState("");
  const [jobs, setJobs] = useState([]);
  const [simulated, setSimulated] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const params = interest ? `?interest=${encodeURIComponent(interest)}` : "";
    fetch(`/api/careers${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setJobs(data.jobs || []);
        setSimulated(Boolean(data.simulated));
      })
      .catch(() => {
        if (!cancelled) setJobs([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [interest]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-white">Career Explorer</h1>
      <p className="mb-6 text-slate-400">
        Live, currently-open job listings for DME graduates, filterable by interest area.
        {simulated && " Showing simulated data — set JSEARCH_API_KEY for live listings."}
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setInterest("")}
          className={`rounded-full border px-3 py-1 text-xs transition ${
            interest === "" ? "border-dme-orange bg-dme-orange/10 text-white" : "border-slate-700 text-slate-400"
          }`}
        >
          All
        </button>
        {interestFilters.map((f) => (
          <button
            key={f}
            onClick={() => setInterest(f)}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              interest === f ? "border-dme-orange bg-dme-orange/10 text-white" : "border-slate-700 text-slate-400"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-slate-500">Loading jobs…</p>}

      {!loading && jobs.length === 0 && (
        <p className="text-sm text-slate-500">No listings found for this filter.</p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {jobs.map((job) => (
          <a
            key={job.id}
            href={job.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition hover:border-slate-600"
          >
            <p className="text-xs uppercase tracking-wide text-dme-orange">{job.interest}</p>
            <p className="mt-1 font-semibold text-white">{job.title}</p>
            <p className="text-sm text-slate-400">{job.company}</p>
            <p className="mt-2 text-xs text-slate-500">{job.location}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
