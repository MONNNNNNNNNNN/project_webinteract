import { ANTHROPIC_API_KEY, hasAnthropicKey } from "./_lib/env.js";
import { FAQ_FACTS, FALLBACK_ANSWER } from "./_lib/mockData.js";

function simulatedReply(message) {
  const lower = message.toLowerCase();
  const hit = FAQ_FACTS.find((f) => f.keywords.some((k) => lower.includes(k)));
  return hit ? hit.answer : FALLBACK_ANSWER;
}

async function liveReply(message) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 300,
        system:
          "You are the DME Explorer assistant for Khon Kaen University's Digital Media Engineering program. Answer prospective/first-year student FAQs briefly and accurately. If unsure, say so instead of guessing.",
        messages: [{ role: "user", content: message }],
      }),
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`Anthropic API ${res.status}`);
    const data = await res.json();
    return data.content?.[0]?.text || FALLBACK_ANSWER;
  } finally {
    clearTimeout(timeout);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const message = (req.body?.message || "").toString().trim().slice(0, 2000);
  if (!message) {
    res.status(400).json({ error: "message is required" });
    return;
  }

  if (hasAnthropicKey) {
    try {
      const reply = await liveReply(message);
      res.status(200).json({ reply, simulated: false });
      return;
    } catch {
      res.status(200).json({
        reply: simulatedReply(message),
        simulated: true,
        note: "Live chatbot call failed, showing a simulated answer instead.",
      });
      return;
    }
  }

  res.status(200).json({ reply: simulatedReply(message), simulated: true });
}
