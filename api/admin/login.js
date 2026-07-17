import { ADMIN_DEMO_EMAIL, ADMIN_DEMO_PASSWORD, SUPABASE_URL, SUPABASE_ANON_KEY, hasSupabase } from "../_lib/env.js";
import { createSessionCookie } from "../_lib/session.js";

async function liveLogin(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.user?.email || email;
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

  let authedEmail = null;
  let simulated = true;

  if (hasSupabase) {
    authedEmail = await liveLogin(email, password);
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
