import { createHmac, timingSafeEqual } from "node:crypto";
import { SESSION_SECRET, hasSessionSecret, ADMIN_EMAILS, isDeployed } from "./env.js";

const COOKIE_NAME = "dme_admin";
const MAX_AGE_MS = 8 * 60 * 60 * 1000; // 8 hours

/**
 * Admin auth cannot be trusted and every admin route must fail closed with 503.
 *
 * Two ways a deploy gets here:
 *
 * - SESSION_SECRET unset: cookies would be signed with a value published in
 *   this repository, so anyone could forge `dme_admin`.
 * - ADMIN_EMAILS unset: any account Supabase Auth accepts would become an admin,
 *   and the project allows sign-ups, so that is anyone who registers.
 *
 * Either way the bypass is silent, and failing closed turns it into a loud
 * misconfiguration instead.
 *
 * Covers preview as well as production. Every pull request gets a publicly
 * reachable preview URL running the same admin routes. Local dev stays
 * permissive so the app still runs with no env vars set, which is the
 * documented behaviour of every other integration here.
 */
export const sessionsDisabled = isDeployed && (!hasSessionSecret || ADMIN_EMAILS.length === 0);

export const SESSIONS_DISABLED_MESSAGE = !hasSessionSecret
  ? "Admin sign-in is disabled: SESSION_SECRET is not set in this environment."
  : "Admin sign-in is disabled: ADMIN_EMAILS is not set in this environment.";

/**
 * Whether this address may hold an admin session.
 *
 * An empty list admits everyone, which is only reachable in local dev — a
 * deployed environment with no list is caught by sessionsDisabled first.
 */
export function isAdminEmail(email) {
  if (ADMIN_EMAILS.length === 0) return true;
  return ADMIN_EMAILS.includes(String(email || "").toLowerCase());
}

function sign(payload) {
  return createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
}

export function createSessionCookie(email) {
  if (sessionsDisabled) throw new Error(SESSIONS_DISABLED_MESSAGE);
  const payload = JSON.stringify({ email, exp: Date.now() + MAX_AGE_MS });
  const encoded = Buffer.from(payload).toString("base64url");
  const sig = sign(encoded);
  const value = `${encoded}.${sig}`;
  const maxAgeSec = Math.floor(MAX_AGE_MS / 1000);
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSec}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function readSession(req) {
  // Never trust a cookie we would not have been willing to sign.
  if (sessionsDisabled) return null;
  const cookieHeader = req.headers?.cookie || "";
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;

  const value = match.slice(COOKIE_NAME.length + 1);
  const [encoded, sig] = value.split(".");
  if (!encoded || !sig) return null;

  const expectedSig = sign(encoded);
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (!payload.exp || payload.exp < Date.now()) return null;
    // Checked on every request, not only at login, so removing an address from
    // ADMIN_EMAILS revokes its live sessions instead of letting them run out
    // their 8 hours.
    if (!isAdminEmail(payload.email)) return null;
    return payload;
  } catch {
    return null;
  }
}
