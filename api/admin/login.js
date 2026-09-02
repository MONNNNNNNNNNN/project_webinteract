import { ADMIN_DEMO_EMAIL, ADMIN_DEMO_PASSWORD, SUPABASE_URL, SUPABASE_ANON_KEY, hasSupabase } from "../_lib/env.js";
import { createSessionCookie, sessionsDisabled, SESSIONS_DISABLED_MESSAGE } from "../_lib/session.js";

// Time-boxed: a hung auth service would otherwise sit on the whole 10s Vercel
// Hobby budget and return nothing.
const AUTH_TIMEOUT_MS = 5000;

async function liveLogin(email, password) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AUTH_TIMEOUT_MS);

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    });

    // A non-OK response is a rejected credential, which is not an error — only a
    // thrown fetch means the service itself was unreachable.
    if (!res.ok) return null;
    const data = await res.json();
    return data.user?.email || email;
  } finally {
    clearTimeout(timer);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const email = (req.body?.email || "").toString().trim();
  const password = (req.body?.password || "").toString();

  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }

  // No point checking a password when no valid session could be issued.
  if (sessionsDisabled) {
    res.status(503).json({ error: SESSIONS_DISABLED_MESSAGE });
    return;
  }

  let authedEmail = null;
  let simulated = true;

  if (hasSupabase) {
    try {
      authedEmail = await liveLogin(email, password);
    } catch (err) {
      // Previously this rejection escaped the handler, so Vercel returned a 500
      // with no body while AdminLogin.jsx called res.json() unconditionally and
      // died on the parse instead of showing the user anything.
      console.error("[admin] Supabase auth unreachable:", err.message);
      res.status(502).json({ error: "Couldn't reach the authentication service. Try again." });
      return;
    }
    simulated = false;
  } else if (email === ADMIN_DEMO_EMAIL && password === ADMIN_DEMO_PASSWORD) {
    authedEmail = email;
  }

  if (!authedEmail) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  res.setHeader("Set-Cookie", createSessionCookie(authedEmail));
  res.status(200).json({ email: authedEmail, simulated });
}
