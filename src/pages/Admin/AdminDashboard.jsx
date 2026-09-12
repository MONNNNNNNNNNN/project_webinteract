import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ContentManager from "./ContentManager.jsx";
import UnansweredManager from "./UnansweredManager.jsx";
import { CONTENT_SCHEMAS } from "./contentSchemas.js";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState(null);
  const [canDraft, setCanDraft] = useState(false);
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
        setCanDraft(Boolean(data.canDraft));
      })
      .catch(() => navigate("/admin"))
      .finally(() => setChecking(false));
  }, [navigate]);

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

      {/* No "Rebuild chatbot knowledge" button: every save to a table the
          chatbot reads rebuilds it (api/content.js), and a failure shows a
          Retry right where the save happened. */}
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
      {activeSchema.view === "unanswered" ? (
        <UnansweredManager key={activeSchema.key} canDraft={canDraft} />
      ) : (
        <ContentManager key={activeSchema.key} schema={activeSchema} />
      )}
    </div>
  );
}
