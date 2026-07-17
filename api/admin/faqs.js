import { readSession } from "../_lib/session.js";
import { DEFAULT_FAQS } from "../_lib/mockData.js";

// Simulated store — resets on server restart, not persisted to Supabase.
// Module-scope array survives across requests within one running process.
let faqs = [...DEFAULT_FAQS];
let nextId = faqs.length + 1;

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json({ faqs, simulated: true });
    return;
  }

  const session = readSession(req);
  if (!session) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  if (req.method === "POST") {
    const question = (req.body?.question || "").toString().trim();
    const answer = (req.body?.answer || "").toString().trim();
    if (!question || !answer) {
      res.status(400).json({ error: "question and answer are required" });
      return;
    }
    const faq = { id: `faq-${nextId++}`, question, answer };
    faqs.push(faq);
    res.status(201).json({ faq, simulated: true });
    return;
  }

  if (req.method === "PUT") {
    const id = (req.body?.id || "").toString();
    const idx = faqs.findIndex((f) => f.id === id);
    if (idx === -1) {
      res.status(404).json({ error: "FAQ not found" });
      return;
    }
    const question = (req.body?.question || faqs[idx].question).toString().trim();
    const answer = (req.body?.answer || faqs[idx].answer).toString().trim();
    faqs[idx] = { ...faqs[idx], question, answer };
    res.status(200).json({ faq: faqs[idx], simulated: true });
    return;
  }

  if (req.method === "DELETE") {
    const id = (req.query?.id || "").toString();
    const before = faqs.length;
    faqs = faqs.filter((f) => f.id !== id);
    if (faqs.length === before) {
      res.status(404).json({ error: "FAQ not found" });
      return;
    }
    res.status(200).json({ ok: true, simulated: true });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
