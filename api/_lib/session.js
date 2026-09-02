import { createHmac, timingSafeEqual } from "node:crypto";
import { SESSION_SECRET, hasSessionSecret } from "./env.js";

const COOKIE_NAME = "dme_admin";
const MAX_AGE_MS = 8 * 60 * 60 * 1000; // 8 hours

/**
 * Admin auth cannot be trusted and every admin route must fail closed with 503.
 *
 * Without this, a deploy that forgot to set SESSION_SECRET signs its cookies
 * with a value published in this repository — anyone could forge `dme_admin`
 * and get whatever write access the admin routes expose. Failing closed turns a
 * silent authentication bypass into a loud misconfiguration.
 *
 * Covers preview as well as production. Every pull request gets a publicly
 * reachable preview URL running the same admin routes, so a preview deploy
 * without a real secret is exactly as forgeable as a production one. Local dev
 * (VERCEL_ENV unset, or "development" under `vercel dev`) stays permissive so the
 * app still runs with no env vars set, which is the documented behaviour of every
 * other integration here.
 */
const DEPLOYED_ENVS = ["production", "preview"];
export const sessionsDisabled =
  DEPLOYED_ENVS.includes(process.env.VERCEL_ENV) && !hasSessionSecret;

export const SESSIONS_DISABLED_MESSAGE =
  "Admin sign-in is disabled: SESSION_SECRET is not set in this environment.";

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
    return payload;
  } catch {
    return null;
  }
}
