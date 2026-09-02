import { readSession, sessionsDisabled, SESSIONS_DISABLED_MESSAGE } from "../_lib/session.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // `authed: false` is kept in the body so AdminDashboard's existing redirect
  // still fires; the status and error explain why it will never be true.
  if (sessionsDisabled) {
    res.status(503).json({ authed: false, email: null, error: SESSIONS_DISABLED_MESSAGE });
    return;
  }

  const session = readSession(req);
  res.status(200).json({ authed: Boolean(session), email: session?.email || null });
}
