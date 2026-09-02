import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, RefreshCw } from "lucide-react";
import FadeIn from "../components/FadeIn.jsx";
import { prefetchCareers, getCachedCareers, refreshCareers, CAREER_INTERESTS } from "../lib/careersCache.js";

function relativeTime(iso) {
  if (!iso) return null;
  const diffMin = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (!Number.isFinite(diffMin) || diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.round(diffHr / 24)}d ago`;
}

export default function CareerExplorer() {
  const [interest, setInterest] = useState("");
  const cached = getCachedCareers("");
  const [jobs, setJobs] = useState(cached?.jobs || []);
  const [simulated, setSimulated] = useState(cached ? Boolean(cached.simulated) : false);
  const [meta, setMeta] = useState(cached || null);
  const [loading, setLoading] = useState(!cached);
  const [refreshing, setRefreshing] = useState(false);

  function applyData(data) {
    setJobs(data.jobs || []);
    setSimulated(Boolean(data.simulated));
    setMeta(data);
  }

  useEffect(() => {
    let cancelled = false;
    const cachedNow = getCachedCareers(interest);
    if (cachedNow) {
      applyData(cachedNow);
      setLoading(false);
    } else {
      setLoading(true);
    }

    prefetchCareers(interest)
      .then((data) => {
        if (!cancelled) applyData(data);
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

  function handleRefresh() {
    setRefreshing(true);
    refreshCareers(interest)
      .then(applyData)
      .catch((err) => console.error("[careers] refresh failed:", err.message))
      .finally(() => setRefreshing(false));
  }

  const savedAt = relativeTime(meta?.lastFetchedAt);

  return (
    <div className="relative mx-auto max-w-4xl overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-10%,rgba(249,115,22,0.12),transparent_60%)]" />
      <FadeIn>
        <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">Career Explorer</h1>
        <p className="mb-6 text-slate-600 dark:text-slate-400">
          Live, currently-open job listings for DME graduates, filterable by interest area.
          {simulated && ` ${meta?.note || "Showing representative listings."}`}
        </p>

        <div className="mb-6 flex flex-wrap items-center gap-2">
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
          {CAREER_INTERESTS.map((f) => (
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
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={loading || refreshing}
            aria-label="Refresh listings"
            className="ml-auto flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-500 transition hover:border-dme-orange hover:text-dme-orange disabled:opacity-50 dark:border-slate-700 dark:text-slate-400"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </motion.button>
        </div>

        {!loading && !simulated && jobs.length > 0 && (
          <p className="-mt-3 mb-6 text-xs text-slate-500 dark:text-slate-500">
            {jobs.length} listing{jobs.length === 1 ? "" : "s"} saved
            {savedAt && ` · updated ${savedAt}`}
            {meta?.note && ` · ${meta.note}`}
          </p>
        )}
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

      {!loading && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {jobs.map((job, i) => (
            <FadeIn key={job.id} delay={0.04 * i}>
              <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-dme-orange hover:shadow-lg hover:shadow-dme-orange/10 dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-none"
              >
                {job.interest && (
                  <p className="text-xs uppercase tracking-wide text-dme-orange">{job.interest}</p>
                )}
                <p className="mt-1 font-semibold text-slate-900 dark:text-white">{job.title}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{job.company}</p>
                <p className="mt-2 text-xs text-slate-500">{job.location}</p>
              </a>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
