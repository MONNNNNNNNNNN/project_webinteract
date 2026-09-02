import { readSession, sessionsDisabled, SESSIONS_DISABLED_MESSAGE } from "../_lib/session.js";
import { DEFAULT_FAQS } from "../_lib/mockData.js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, hasSupabase, hasSupabaseAdmin } from "../_lib/env.js";

// Simulated store — used when Supabase isn't configured. Resets on server
// restart; module-scope array survives across requests within one process.
let simFaqs = [...DEFAULT_FAQS];
let nextId = simFaqs.length + 1;

function restHeaders(key) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "content-type": "application/json",
  };
}

async function listFaqs() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/faqs?select=id,question,answer&order=created_at.asc`, {
    headers: restHeaders(SUPABASE_ANON_KEY),
  });
  if (!res.ok) throw new Error(`Supabase select ${res.status}`);
  return res.json();
}

async function insertFaq(question, answer) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/faqs`, {
    method: "POST",
    headers: { ...restHeaders(SUPABASE_SERVICE_ROLE_KEY), Prefer: "return=representation" },
    body: JSON.stringify({ question, answer }),
  });
  if (!res.ok) throw new Error(`Supabase insert ${res.status}`);
  const rows = await res.json();
  return rows[0];
}

async function updateFaq(id, patch) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/faqs?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { ...restHeaders(SUPABASE_SERVICE_ROLE_KEY), Prefer: "return=representation" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`Supabase update ${res.status}`);
  const rows = await res.json();
  return rows[0] || null;
}

async function deleteFaq(id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/faqs?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { ...restHeaders(SUPABASE_SERVICE_ROLE_KEY), Prefer: "return=representation" },
  });
  if (!res.ok) throw new Error(`Supabase delete ${res.status}`);
  const rows = await res.json();
  return rows.length > 0;
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    if (hasSupabase) {
      try {
        const faqs = await listFaqs();
        res.status(200).json({ faqs, simulated: false });
        return;
      } catch {
        // fall through to simulated below
      }
    }
    res.status(200).json({ faqs: simFaqs, simulated: true });
    return;
  }

  // Misconfiguration, not a failed login — 503 so it reads as "fix the deploy"
  // rather than "wrong password".
  if (sessionsDisabled) {
    res.status(503).json({ error: SESSIONS_DISABLED_MESSAGE });
    return;
  }

  const session = readSession(req);
  if (!session) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const useSupabase = hasSupabaseAdmin;

  if (req.method === "POST") {
    const question = (req.body?.question || "").toString().trim();
    const answer = (req.body?.answer || "").toString().trim();
    if (!question || !answer) {
      res.status(400).json({ error: "question and answer are required" });
      return;
    }
    if (useSupabase) {
      try {
        const faq = await insertFaq(question, answer);
        res.status(201).json({ faq, simulated: false });
        return;
      } catch (err) {
        res.status(502).json({ error: "Supabase insert failed", detail: err.message });
        return;
      }
    }
    const faq = { id: `faq-${nextId++}`, question, answer };
    simFaqs.push(faq);
    res.status(201).json({ faq, simulated: true });
    return;
  }

  if (req.method === "PUT") {
    const id = (req.body?.id || "").toString();
    const question = (req.body?.question || "").toString().trim() || undefined;
    const answer = (req.body?.answer || "").toString().trim() || undefined;
    if (useSupabase) {
      try {
        const faq = await updateFaq(id, { ...(question && { question }), ...(answer && { answer }) });
        if (!faq) {
          res.status(404).json({ error: "FAQ not found" });
          return;
        }
        res.status(200).json({ faq, simulated: false });
        return;
      } catch (err) {
        res.status(502).json({ error: "Supabase update failed", detail: err.message });
        return;
      }
    }
    const idx = simFaqs.findIndex((f) => f.id === id);
    if (idx === -1) {
      res.status(404).json({ error: "FAQ not found" });
      return;
    }
    simFaqs[idx] = { ...simFaqs[idx], question: question || simFaqs[idx].question, answer: answer || simFaqs[idx].answer };
    res.status(200).json({ faq: simFaqs[idx], simulated: true });
    return;
  }

  if (req.method === "DELETE") {
    const id = (req.query?.id || "").toString();
    if (useSupabase) {
      try {
        const ok = await deleteFaq(id);
        if (!ok) {
          res.status(404).json({ error: "FAQ not found" });
          return;
        }
        res.status(200).json({ ok: true, simulated: false });
        return;
      } catch (err) {
        res.status(502).json({ error: "Supabase delete failed", detail: err.message });
        return;
      }
    }
    const before = simFaqs.length;
    simFaqs = simFaqs.filter((f) => f.id !== id);
    if (simFaqs.length === before) {
      res.status(404).json({ error: "FAQ not found" });
      return;
    }
    res.status(200).json({ ok: true, simulated: true });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
