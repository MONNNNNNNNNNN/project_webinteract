// The Unanswered tab: questions the chatbot could not answer, turned into FAQs.
//
// Each question is a visitor naming a gap in the content. Answering one here
// writes an FAQ, and search_kb() reads the faqs table live, so the chatbot
// answers it from the next message on — no rebuild, no redeploy. Every logged
// copy of the question is then cleared.
//
// Gemini can draft the answer, but only from what the knowledge base already
// holds. Anything missing comes back as an "[ADMIN: …]" placeholder, and nothing
// containing one can be published. The model proposes wording; the admin
// supplies the facts.

import { useCallback, useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { hasAdminPlaceholder, PLACEHOLDER_ERROR } from "../../../shared/faqDraft.js";

const ENDPOINT = "/api/content?type=chat_misses";
const JSON_HEADERS = { "content-type": "application/json" };

const askedAt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** "Do you have a swimming pool?" and "do you have a swimming pool" are one gap. */
function normalize(question) {
  return question
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[\s?!.。…ๆ]+$/u, "")
    .trim();
}

/** Rows -> one entry per distinct question, most-asked first. */
function groupMisses(rows) {
  const groups = new Map();
  rows.forEach((r) => {
    const key = normalize(r.question);
    const group = groups.get(key) || { key, question: r.question, ids: [], count: 0, lastAsked: 0 };
    const t = Date.parse(r.asked_at) || 0;
    group.ids.push(r.id);
    group.count += 1;
    // Show the most recent phrasing.
    if (t >= group.lastAsked) {
      group.lastAsked = t;
      group.question = r.question;
    }
    groups.set(key, group);
  });
  // The count is the priority signal: four visitors hitting the same gap
  // matter more than one stray keystroke.
  return [...groups.values()].sort((a, b) => b.count - a.count || b.lastAsked - a.lastAsked);
}

async function request(url, options) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

const clearGroup = (group) =>
  request(`${ENDPOINT}&ids=${encodeURIComponent(group.ids.join(","))}`, { method: "DELETE" });

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500";

function AnswerForm({ group, canDraft, onPublished, onCancel }) {
  const [question, setQuestion] = useState(group.question);
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState(null);
  const [busy, setBusy] = useState(""); // "" | "draft" | "publish"
  const [error, setError] = useState("");

  const unfilled = hasAdminPlaceholder(question) || hasAdminPlaceholder(answer);
  const canPublish = Boolean(question.trim() && answer.trim()) && !unfilled && !busy;

  async function draft() {
    if (answer.trim() && !window.confirm("Replace the current answer with a new Gemini draft?")) return;
    setBusy("draft");
    setError("");
    try {
      const data = await request("/api/admin/draft-answer", {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify({ question }),
      });
      setAnswer(data.draft);
      setSources(data.sources || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy("");
    }
  }

  async function publish(e) {
    e.preventDefault();
    if (!canPublish) return;
    setBusy("publish");
    setError("");
    try {
      await request("/api/admin/faqs", {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify({ question: question.trim(), answer: answer.trim() }),
      });
    } catch (err) {
      setError(err.message);
      setBusy("");
      return;
    }
    try {
      await clearGroup(group);
      onPublished("FAQ published. The chatbot answers this question from the next message on.");
    } catch (err) {
      // The FAQ is already live, which is the part that matters. Only the log
      // entry is left behind.
      onPublished(`FAQ published, but clearing the entry failed (${err.message}). Dismiss it by hand.`, true);
    }
  }

  return (
    <form onSubmit={publish} className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
          Question, as it will appear in the FAQ
        </span>
        <input value={question} onChange={(e) => setQuestion(e.target.value)} className={inputClass} />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Answer</span>
        <textarea
          rows={5}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={canDraft ? "Write the answer, or start from a Gemini draft." : "Write the answer."}
          className={inputClass}
        />
      </label>

      {sources && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          {sources.length
            ? `Drafted only from: ${sources.join(" · ")}. Check every fact before publishing.`
            : "Nothing in the knowledge base matched, so every fact has to come from you."}
        </p>
      )}
      {unfilled && <p className="text-xs text-amber-600 dark:text-amber-400">{PLACEHOLDER_ERROR}</p>}
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

      <div className="flex flex-wrap gap-2">
        {canDraft && (
          <button
            type="button"
            onClick={draft}
            disabled={Boolean(busy)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 transition hover:border-dme-orange hover:text-dme-orange disabled:opacity-50 dark:border-slate-700 dark:text-slate-300"
          >
            <Sparkles className="h-4 w-4" />
            {busy === "draft" ? "Drafting…" : answer.trim() ? "Redraft with Gemini" : "Draft with Gemini"}
          </button>
        )}
        <button
          type="submit"
          disabled={!canPublish}
          className="rounded-lg bg-dme-orange px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {busy === "publish" ? "Publishing…" : "Publish as FAQ"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function UnansweredManager({ canDraft }) {
  const [rows, setRows] = useState([]);
  const [simulated, setSimulated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState({ text: "", warn: false });
  const [answeringKey, setAnsweringKey] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await request(ENDPOINT);
      setRows(data.items || []);
      setSimulated(Boolean(data.simulated));
    } catch (err) {
      setError(err.message);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const groups = useMemo(() => groupMisses(rows), [rows]);

  async function dismiss(group) {
    setError("");
    setFlash({ text: "", warn: false });
    try {
      await clearGroup(group);
      if (answeringKey === group.key) setAnsweringKey(null);
      await reload();
    } catch (err) {
      setError(err.message);
    }
  }

  function published(text, warn = false) {
    setAnsweringKey(null);
    setFlash({ text, warn });
    reload();
  }

  return (
    <div>
      <p className="mb-4 text-xs text-slate-500">
        {simulated
          ? "Simulated store — Supabase isn't configured, so the chatbot logs nothing here."
          : "Logged by the chatbot. Answer a question to publish it as an FAQ, or dismiss it."}
      </p>

      <p className="mb-6 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400 dark:shadow-none">
        Questions visitors asked that the chatbot could not answer, most-asked first. <strong>Answer</strong>{" "}
        publishes an FAQ, which the chatbot uses immediately, and clears every copy of the question.
        {canDraft && " Gemini can draft it from what the knowledge base already holds; facts it cannot find come back as [ADMIN: …] placeholders you must fill in."}{" "}
        Dismiss anything off-topic.
      </p>

      {flash.text && (
        <p
          role="status"
          className={`mb-4 text-sm ${flash.warn ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}
        >
          {flash.text}
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : groups.length === 0 ? (
        <p className="text-sm text-slate-500">Nothing unanswered. Every question so far found an answer.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {groups.map((g) => (
            <div
              key={g.key}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-none"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white">{g.question}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {g.count > 1 ? (
                      <span className="mr-1 rounded-full bg-dme-orange/10 px-2 py-0.5 text-xs font-semibold text-dme-orange">
                        asked {g.count}×
                      </span>
                    ) : (
                      "asked once · "
                    )}
                    {g.count > 1 && " last "}
                    {g.lastAsked ? askedAt.format(g.lastAsked) : "unknown time"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-3 text-xs">
                  {answeringKey !== g.key && (
                    <button
                      onClick={() => {
                        setFlash({ text: "", warn: false });
                        setAnsweringKey(g.key);
                      }}
                      className="font-medium text-dme-orange hover:underline"
                    >
                      Answer
                    </button>
                  )}
                  <button
                    onClick={() => dismiss(g)}
                    className="text-red-500 hover:text-red-400 dark:text-red-400 dark:hover:text-red-300"
                  >
                    {g.count > 1 ? `Dismiss all ${g.count}` : "Dismiss"}
                  </button>
                </div>
              </div>

              {answeringKey === g.key && (
                <AnswerForm
                  group={g}
                  canDraft={canDraft}
                  onPublished={published}
                  onCancel={() => setAnsweringKey(null)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
