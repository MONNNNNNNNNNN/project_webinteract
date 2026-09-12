// A URL field that can also be filled by picking a file from the admin's machine.
//
// The text input stays: a URL pasted from elsewhere is still a perfectly good
// answer, and removing that would trade one capability for another. Uploading
// just fills the same box.
//
// The file goes straight from the browser to Supabase Storage. api/upload.js only
// authorizes and hands back a one-shot signed URL — see the note there about why
// the bytes do not travel through the serverless function.

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { isVideoUrl } from "../../lib/media.js";

export default function MediaField({ field, value, onChange }) {
  const inputRef = useRef(null);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");

  const base =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500";

  async function upload(file) {
    setError("");
    setProgress(0);
    try {
      const prep = await fetch("/api/upload", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contentType: file.type, size: file.size, folder: field.folder || "misc" }),
      });
      const data = await prep.json().catch(() => ({}));
      if (!prep.ok) throw new Error(data.error || `Could not prepare the upload (${prep.status})`);

      // XHR rather than fetch: fetch cannot report upload progress, and a 40MB
      // video with no feedback looks identical to a frozen page.
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", data.uploadUrl);
        xhr.setRequestHeader("content-type", file.type);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () =>
          xhr.status >= 200 && xhr.status < 300
            ? resolve()
            : reject(new Error(`Upload failed (${xhr.status})`));
        xhr.onerror = () => reject(new Error("Upload failed — check your connection"));
        xhr.send(file);
      });

      onChange(field.name, data.publicUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setProgress(null);
      // Let the same file be picked again after a failure; without this the
      // input holds the old selection and change never fires.
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const busy = progress !== null;
  const isVideo = isVideoUrl(value);

  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
        {field.label}
      </span>

      <div className="flex gap-2">
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(field.name, e.target.value)}
          placeholder="/news/photo.jpg, a full URL, or upload →"
          className={base}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 transition hover:border-dme-orange hover:text-dme-orange disabled:opacity-50 dark:border-slate-700 dark:text-slate-300"
        >
          <Upload className="h-4 w-4" />
          {busy ? `${progress}%` : "Upload"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
      />

      {busy && (
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full bg-dme-orange transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && <span className="mt-1 block text-[11px] text-red-500">{error}</span>}

      {field.hint && !error && (
        <span className="mt-1 block text-[11px] text-slate-400">{field.hint}</span>
      )}

      {/* Seeing the file is the only way to know the upload landed on the right
          thing — a URL alone confirms nothing. */}
      {value && !busy && (
        <div className="relative mt-2 inline-block">
          {isVideo ? (
            <video src={value} className="h-24 rounded-lg border border-slate-200 dark:border-slate-800" controls muted />
          ) : (
            <img
              src={value}
              alt=""
              className="h-24 rounded-lg border border-slate-200 object-cover dark:border-slate-800"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
          <button
            type="button"
            onClick={() => onChange(field.name, "")}
            aria-label="Clear"
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-white hover:bg-red-500"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </label>
  );
}
