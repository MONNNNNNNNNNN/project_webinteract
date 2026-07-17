import { readSession } from "../_lib/session.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const session = readSession(req);
  res.status(200).json({ authed: Boolean(session), email: session?.email || null });
}
