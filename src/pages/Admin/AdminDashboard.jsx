import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ContentManager from "./ContentManager.jsx";
import { CONTENT_SCHEMAS } from "./contentSchemas.js";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState(null);
  const [activeKey, setActiveKey] = useState(CONTENT_SCHEMAS[0].key);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => res.json().catch(() => ({})))
      .then((data) => {
        // A 503 from a deploy missing SESSION_SECRET also lands here with
        // authed:false, which is the correct outcome — there is no session to
        // be had until that is fixed.
        if (!data.authed) {
          navigate("/admin");
          return;
        }
        setEmail(data.email);
      })
      .catch(() => navigate("/admin"))
      .finally(() => setChecking(false));
  }, [navigate]);

  // The chatbot answers from kb_chunks, a copy built from these tables. FAQs are
  // read live, but a fee, course or lecturer edit reaches the chatbot only
  // when that copy is rebuilt.
  const [kb, setKb] = useState({ busy: false, message: "", error: false });

  async function rebuildKb() {
    setKb({ busy: true, message: "", error: false });
    try {
      const res = await fetch("/api/admin/rebuild-kb", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || data.error || `Rebuild failed (${res.status})`);
      setKb({
        busy: false,
        message: `Chatbot updated: ${data.upserted} entries refreshed, ${data.deleted} removed.`,
        error: false,
      });
    } catch (err) {
      setKb({ busy: false, message: err.message, error: true });
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    navigate("/admin");
  }

  if (checking) {
    return <p className="mx-auto max-w-3xl px-4 py-24 text-center text-slate-500">Checking session…</p>;
  }

  const activeSchema = CONTENT_SCHEMAS.find((s) => s.key === activeKey) || CONTENT_SCHEMAS[0];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Signed in as {email}</p>
        </div>
        <button
          onClick={logout}
          className="self-start rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500"
        >
          Log out
        </button>
      </div>

      <div className="mb-6 flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-none sm:flex-row sm:items-center sm:justify-between">
        <p className="text-slate-600 dark:text-slate-400">
          FAQ edits reach the chatbot instantly. Fees, courses, the study plan and staff reach it only
          after a rebuild.
        </p>
        <button
          onClick={rebuildKb}
          disabled={kb.busy}
          className="shrink-0 self-start rounded-lg bg-dme-orange px-3 py-1.5 font-medium text-white disabled:opacity-50 sm:self-auto"
        >
          {kb.busy ? "Rebuilding…" : "Rebuild chatbot knowledge"}
        </button>
      </div>
      {kb.message && (
        <p
          role="status"
          className={`-mt-4 mb-6 text-sm ${kb.error ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}
        >
          {kb.message}
        </p>
      )}

      <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        {CONTENT_SCHEMAS.map((schema) => (
          <button
            key={schema.key}
            onClick={() => setActiveKey(schema.key)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              activeKey === schema.key
                ? "border-dme-orange bg-dme-orange/10 text-dme-orange"
                : "border-slate-300 text-slate-500 hover:border-slate-400 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-500"
            }`}
          >
            {schema.label}
          </button>
        ))}
      </div>

      {/* key remounts the manager on tab change so no state leaks between domains */}
      <ContentManager key={activeSchema.key} schema={activeSchema} />
    </div>
  );
}
