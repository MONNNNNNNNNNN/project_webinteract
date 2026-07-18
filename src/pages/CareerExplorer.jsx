import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import FadeIn from "../components/FadeIn.jsx";

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
    <div className="relative mx-auto max-w-4xl overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-10%,rgba(249,115,22,0.12),transparent_60%)]" />
      <FadeIn>
        <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">Career Explorer</h1>
        <p className="mb-6 text-slate-600 dark:text-slate-400">
          Live, currently-open job listings for DME graduates, filterable by interest area.
          {simulated && " Showing simulated data — set JSEARCH_API_KEY for live listings."}
        </p>

        <div className="mb-6 flex flex-wrap gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setInterest("")}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              interest === ""
                ? "border-dme-orange bg-dme-orange/10 text-dme-orange"
                : "border-slate-300 text-slate-500 dark:border-slate-700 dark:text-slate-400"
            }`}
          >
            All
          </motion.button>
          {interestFilters.map((f) => (
            <motion.button
              key={f}
              whileTap={{ scale: 0.95 }}
              onClick={() => setInterest(f)}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                interest === f
                  ? "border-dme-orange bg-dme-orange/10 text-dme-orange"
                  : "border-slate-300 text-slate-500 dark:border-slate-700 dark:text-slate-400"
              }`}
            >
              {f}
            </motion.button>
          ))}
        </div>
      </FadeIn>

      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500 dark:text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-dme-orange" />
          <p className="text-sm">Fetching live job listings…</p>
        </div>
      )}

      {!loading && jobs.length === 0 && (
        <p className="text-sm text-slate-500">No listings found for this filter.</p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {jobs.map((job, i) => (
          <FadeIn key={job.id} delay={0.04 * i}>
            <a
              href={job.url}
              target="_blank"
              rel="noreferrer"
              className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-dme-orange hover:shadow-lg hover:shadow-dme-orange/10 dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-none"
            >
              <p className="text-xs uppercase tracking-wide text-dme-orange">{job.interest}</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">{job.title}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{job.company}</p>
              <p className="mt-2 text-xs text-slate-500">{job.location}</p>
            </a>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
