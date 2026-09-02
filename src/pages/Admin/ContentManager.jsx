// Generic list + create/edit/delete for one content domain, driven entirely by
// a schema from contentSchemas.js.

import { useCallback, useEffect, useState } from "react";
import { emptyValues } from "./contentSchemas.js";

function FieldInput({ field, value, onChange }) {
  const base =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500";

  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(field.name, e.target.checked)}
          className="h-4 w-4 accent-dme-orange"
        />
        {field.label}
      </label>
    );
  }

  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
        {field.label}
        {field.required && <span className="text-dme-orange"> *</span>}
      </span>
      {field.type === "select" ? (
        <select
          value={value ?? ""}
          onChange={(e) => onChange(field.name, e.target.value)}
          className={base}
        >
          <option value="">Select…</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea
          rows={3}
          value={value ?? ""}
          onChange={(e) => onChange(field.name, e.target.value)}
          className={base}
        />
      ) : (
        <input
          type={field.type === "number" ? "number" : "text"}
          value={value ?? ""}
          onChange={(e) => onChange(field.name, e.target.value)}
          className={base}
        />
      )}
      {field.hint && <span className="mt-1 block text-[11px] text-slate-400">{field.hint}</span>}
    </label>
  );
}

export default function ContentManager({ schema }) {
  // Which column identifies a row for this domain. Everything keys on `id`
  // except courses, which key on `code`.
  const idField = schema.idField || "id";
  const [items, setItems] = useState([]);
  const [simulated, setSimulated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [values, setValues] = useState(() => emptyValues(schema));
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(schema.endpoint);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      setItems(data[schema.listKey] || []);
      setSimulated(Boolean(data.simulated));
    } catch (err) {
      setError(err.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [schema]);

  useEffect(() => {
    setValues(emptyValues(schema));
    setEditingId(null);
    reload();
  }, [schema, reload]);

  function setField(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  function startEdit(item) {
    const next = emptyValues(schema);
    schema.fields.forEach((f) => {
      next[f.name] = item[f.name] ?? next[f.name];
    });
    setValues(next);
    setEditingId(item[idField]);
    setError("");
  }

  function cancelEdit() {
    setValues(emptyValues(schema));
    setEditingId(null);
  }

  async function save(e) {
    e.preventDefault();
    const missing = schema.fields
      .filter((f) => f.required && !String(values[f.name] ?? "").trim())
      .map((f) => f.label);
    if (missing.length) {
      setError(`Required: ${missing.join(", ")}`);
      return;
    }
    // Server validates this too — the amounts and orderings here end up on
    // public pages, so a client-only check would not be a check.
    const badNumber = schema.fields.find(
      (f) => f.type === "number" && values[f.name] !== "" && !Number.isFinite(Number(values[f.name]))
    );
    if (badNumber) {
      setError(`${badNumber.label} must be a number`);
      return;
    }
    const negative = schema.fields.find(
      (f) => f.type === "number" && f.min === 0 && Number(values[f.name]) < 0
    );
    if (negative) {
      setError(`${negative.label} cannot be negative`);
      return;
    }

    setSaving(true);
    setError("");
    try {
      const res = await fetch(schema.endpoint, {
        method: editingId ? "PUT" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...values } : values),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Save failed (${res.status})`);
      cancelEdit();
      await reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    setError("");
    try {
      const res = await fetch(`${schema.endpoint}?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Delete failed (${res.status})`);
      if (editingId === id) cancelEdit();
      await reload();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <p className="mb-4 text-xs text-slate-500">
        {simulated
          ? `Simulated store — ${schema.label} changes reset when the server restarts (Supabase isn't configured).`
          : schema.readOnly
            ? `Logged by the chatbot. ${schema.label} entries are removed only when you dismiss them.`
            : `Persisted to Supabase — ${schema.label} changes are saved for real.`}
      </p>

      {error && (
        <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {schema.readOnly ? (
        <p className="mb-6 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400 dark:shadow-none">
          Questions visitors asked that the chatbot could not answer. Each one is a
          gap in the content. Add an FAQ that answers it — the chatbot picks that
          up immediately, with no redeploy — then dismiss the entry here.
        </p>
      ) : (
      <form
        onSubmit={save}
        className="mb-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-none"
      >
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {editingId ? `Edit ${schema.singular}` : `Add ${schema.singular}`}
        </p>
        {schema.fields.map((f) => (
          <FieldInput key={f.name} field={f} value={values[f.name]} onChange={setField} />
        ))}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="self-start rounded-lg bg-dme-orange px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? "Saving…" : editingId ? "Save changes" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="self-start rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-slate-500">Nothing here yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item[idField]}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-none"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white">{item[schema.primary]}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item[schema.secondary]}</p>
                </div>
                <div className="flex shrink-0 gap-3 text-xs">
                  {!schema.readOnly && (
                    <button
                      onClick={() => startEdit(item)}
                      className="text-slate-500 hover:text-dme-orange dark:text-slate-400"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => remove(item[idField])}
                    className="text-red-500 hover:text-red-400 dark:text-red-400 dark:hover:text-red-300"
                  >
                    {schema.readOnly ? "Dismiss" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
