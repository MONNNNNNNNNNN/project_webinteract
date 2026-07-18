import { ANTHROPIC_API_KEY, hasAnthropicKey } from "./_lib/env.js";
import { FAQ_FACTS, FALLBACK_ANSWER } from "./_lib/mockData.js";

const SYSTEM_PROMPT = `You are the DME Explorer assistant for Khon Kaen University's Digital Media Engineering (DME) program, Faculty of Engineering.

Scope: only answer questions about the DME program, its curriculum, tuition, careers, facilities, staff, or the Faculty of Engineering / Khon Kaen University more broadly. If asked something unrelated (general chit-chat, other topics, other universities), politely decline and redirect to DME topics. Keep answers brief (2-4 sentences) and accurate. If you don't know something, say so instead of guessing — don't invent course codes, staff details, or figures not given below.

Reference facts:
- Program: Digital Media Engineering, international undergraduate program, Faculty of Engineering, Khon Kaen University. Blends software engineering with digital media production (3D/animation, interactive media, AI, game/software dev).
- Total credits: 120 over 4 years (Cooperative Education track). Breakdown: General Education 30 (Language 12, Humanities/Social Sciences 6, Math/Sciences 12), Basic Engineering 15, Core Engineering 36, Elective Engineering min. 27, Field Experience 6, Free Elective min. 6.
- Major elective tracks (4): AI, Digital Media, Interactive, Software.
- Tuition per semester: Thai students ~45,000 THB. Mekong Region (Cambodia, China, Laos, Myanmar, Vietnam) 50,000 THB, no enrollment fee. International (other regions) 65,000 THB + 10,000 THB one-time enrollment fee. Plus estimated health insurance (5,000-10,000 THB/yr), accommodation (3,000-6,000 THB/mo), living costs (6,000-10,000 THB/mo).
- Contact: International Affairs Division +66 (0) 4320 2059, enforeign@kku.ac.th. General Faculty line +66 (0) 4300 9700 ext. 50215 or 45641. Address: 123 Mittraphap Road, Nai Muang Sub-district, Muang District, Khon Kaen 40002, Thailand.
- Facilities: CDLC, Mac labs, VR/broadcast classrooms.
- For anything more specific than these facts (individual course descriptions, specific staff emails, exact admission deadlines), direct the user to the relevant DME Explorer page or the official contacts above rather than guessing.`;

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
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system: SYSTEM_PROMPT,
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
