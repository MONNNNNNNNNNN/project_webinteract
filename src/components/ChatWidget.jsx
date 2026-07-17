import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";

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
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mb-3 flex w-80 max-w-[calc(100vw-2.5rem)] flex-col rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
              <p className="font-semibold text-slate-900 dark:text-white">DME Assistant</p>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex max-h-80 flex-col gap-2 overflow-y-auto p-3">
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={`rounded-lg px-3 py-2 text-sm ${
                      m.role === "user"
                        ? "self-end bg-dme-orange text-white"
                        : "self-start bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {m.text}
                    {m.role === "assistant" && m.simulated && (
                      <span className="ml-2 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] uppercase text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                        simulated
                      </span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {loading && <div className="self-start text-xs text-slate-500">Thinking…</div>}
            </div>

            <div className="flex gap-2 border-t border-slate-200 p-3 dark:border-slate-800">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about DME…"
                className="flex-1 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                disabled={loading}
                className="flex items-center justify-center rounded-lg bg-dme-orange px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileTap={{ scale: 0.92 }}
        animate={{ rotate: open ? 90 : 0 }}
        transition={{ duration: 0.2 }}
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-dme-orange text-white shadow-lg transition hover:brightness-110"
        aria-label="Open chat"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>
    </div>
  );
}
