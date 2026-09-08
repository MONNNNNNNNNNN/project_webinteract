// Issues a one-shot signed upload URL for the admin media bucket.
//
// The file itself never passes through this function. Vercel caps a serverless
// request body at about 4.5MB, which a phone video clears in a couple of
// seconds, so routing uploads through here would put a hard ceiling on what an
// admin can post. Instead this endpoint authorizes and the browser transfers
// straight to Supabase Storage.
//
// The service role key stays server-side. What the browser receives is a token
// scoped to one bucket path, valid once — enough to write that object and
// nothing else.

import { randomUUID } from "node:crypto";
import { readSession, sessionsDisabled, SESSIONS_DISABLED_MESSAGE } from "./_lib/session.js";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, hasSupabaseAdmin } from "./_lib/env.js";

const BUCKET = "site-media";

// Mirrors the bucket's own allowed_mime_types. Checked here too so a rejection
// is a clear 400 from us rather than an opaque failure mid-upload.
const EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

// The bucket enforces this as well; rejecting early saves the user watching a
// 200MB upload fail at the end.
const MAX_BYTES = 50 * 1024 * 1024;

// Where uploads land, so the bucket stays browsable. Anything else is rejected
// rather than coerced, because this becomes a path segment.
const FOLDERS = new Set(["news", "projects", "staff", "misc"]);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  if (sessionsDisabled) {
    res.status(503).json({ error: SESSIONS_DISABLED_MESSAGE });
    return;
  }
  if (!readSession(req)) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  if (!hasSupabaseAdmin) {
    res.status(503).json({ error: "Uploads require Supabase to be configured." });
    return;
  }

  const contentType = (req.body?.contentType || "").toString();
  const size = Number(req.body?.size);
  const folder = (req.body?.folder || "misc").toString();

  const extension = EXTENSIONS[contentType];
  if (!extension) {
    res.status(400).json({
      error: `Unsupported file type${contentType ? ` (${contentType})` : ""}. Images: JPG, PNG, WebP, GIF, AVIF. Video: MP4, WebM, MOV.`,
    });
    return;
  }
  if (!Number.isFinite(size) || size <= 0) {
    res.status(400).json({ error: "size is required" });
    return;
  }
  if (size > MAX_BYTES) {
    res.status(400).json({
      error: `That file is ${(size / 1024 / 1024).toFixed(1)}MB. The limit is ${MAX_BYTES / 1024 / 1024}MB.`,
    });
    return;
  }
  if (!FOLDERS.has(folder)) {
    res.status(400).json({ error: `Unknown folder: ${folder}` });
    return;
  }

  // The name is generated, never taken from the client. An uploaded filename is
  // attacker-controlled text about to become a URL path — "../", a leading dot,
  // a 300-character name, or simply a collision with an existing object. The
  // extension comes from the validated MIME type rather than from the name.
  const path = `${folder}/${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;

  try {
    const signed = await fetch(`${SUPABASE_URL}/storage/v1/object/upload/sign/${BUCKET}/${path}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "content-type": "application/json",
      },
      body: "{}",
    });
    if (!signed.ok) {
      throw new Error(`sign ${signed.status}: ${(await signed.text()).slice(0, 200)}`);
    }
    const { url } = await signed.json();

    res.status(200).json({
      // Absolute, so the browser never needs to know SUPABASE_URL.
      uploadUrl: `${SUPABASE_URL}/storage/v1${url}`,
      publicUrl: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`,
      path,
    });
  } catch (err) {
    console.error("[upload] could not sign:", err.message);
    res.status(502).json({ error: "Could not prepare the upload", detail: err.message });
  }
}
