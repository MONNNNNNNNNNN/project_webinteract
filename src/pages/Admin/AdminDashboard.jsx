import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data) => {
        if (!data.authed) {
          navigate("/admin");
          return;
        }
        setEmail(data.email);
        return fetch("/api/admin/faqs")
          .then((res) => res.json())
          .then((d) => setFaqs(d.faqs || []));
      })
      .finally(() => setChecking(false));
  }, [navigate]);

  async function addFaq(e) {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    const res = await fetch("/api/admin/faqs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question, answer }),
    });
    const data = await res.json();
    if (res.ok) {
      setFaqs((f) => [...f, data.faq]);
      setQuestion("");
      setAnswer("");
    }
  }

  async function deleteFaq(id) {
    const res = await fetch(`/api/admin/faqs?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.ok) setFaqs((f) => f.filter((item) => item.id !== id));
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    navigate("/admin");
  }

  if (checking) {
    return <p className="mx-auto max-w-3xl px-4 py-24 text-center text-slate-500">Checking session…</p>;
  }

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

      <p className="mb-4 text-xs text-slate-500">
        Simulated store — FAQ entries here reset when the server restarts (not persisted to Supabase yet).
      </p>

      <form
        onSubmit={addFaq}
        className="mb-6 flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-none"
      >
        <p className="text-sm font-semibold text-slate-900 dark:text-white">Add FAQ</p>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Question"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
        />
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Answer"
          rows={2}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
        />
        <button
          type="submit"
          className="self-start rounded-lg bg-dme-orange px-3 py-1.5 text-sm font-medium text-white"
        >
          Add
        </button>
      </form>

      <div className="flex flex-col gap-3">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-none"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{faq.question}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{faq.answer}</p>
              </div>
              <button
                onClick={() => deleteFaq(faq.id)}
                className="shrink-0 text-xs text-red-500 hover:text-red-400 dark:text-red-400 dark:hover:text-red-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
