import { createHmac, timingSafeEqual } from "node:crypto";
import { SESSION_SECRET } from "./env.js";

const COOKIE_NAME = "dme_admin";
const MAX_AGE_MS = 8 * 60 * 60 * 1000; // 8 hours

function sign(payload) {
  return createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
}

export function createSessionCookie(email) {
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
