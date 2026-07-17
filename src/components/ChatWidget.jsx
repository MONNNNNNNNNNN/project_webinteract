import { useState } from "react";

// Stub only — no real chat logic. Wiring this up to the Claude API
// (Haiku 4.5, per the proposal) needs ANTHROPIC_API_KEY set in a Vercel
// serverless function under api/, and is a separate follow-up task.
export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-72 rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-semibold text-white">DME Assistant</p>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>
          <div className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-400">
            Coming soon — this chatbot will answer DME FAQs once ANTHROPIC_API_KEY
            is configured.
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-dme-orange text-2xl text-white shadow-lg transition hover:brightness-110"
        aria-label="Open chat"
      >
        💬
      </button>
    </div>
  );
}
