import { useState } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! Ask me anything about the DME program.", simulated: true },
  ]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", text: data.reply || "Something went wrong.", simulated: data.simulated },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Couldn't reach the chatbot. Try again later.", simulated: true },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 flex w-80 flex-col rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 p-4">
            <p className="font-semibold text-white">DME Assistant</p>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>

          <div className="flex max-h-80 flex-col gap-2 overflow-y-auto p-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`rounded-lg px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "self-end bg-dme-orange text-white"
                    : "self-start bg-slate-800 text-slate-200"
                }`}
              >
                {m.text}
                {m.role === "assistant" && m.simulated && (
                  <span className="ml-2 rounded bg-slate-700 px-1.5 py-0.5 text-[10px] uppercase text-slate-400">
                    simulated
                  </span>
                )}
              </div>
            ))}
            {loading && <div className="self-start text-xs text-slate-500">Thinking…</div>}
          </div>

          <div className="flex gap-2 border-t border-slate-800 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about DME…"
              className="flex-1 rounded-lg bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="rounded-lg bg-dme-orange px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Send
            </button>
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
