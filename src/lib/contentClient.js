// Client for admin-editable site content (api/content/[type].js).
//
// The pages that use this already ship their content as a static import, and
// they keep rendering it while the fetch is in flight and forever after if the
// fetch fails. That is deliberate: Supabase free-tier projects pause after 7
// days idle, and the site must degrade to the content it was built with rather
// than to a spinner or a blank page.

import { useEffect, useState } from "react";

/**
 * Rows for a content type, or `fallback` if the store has nothing authoritative
 * to say.
 *
 * An empty-but-authoritative response (`simulated: false`, `items: []`) resolves
 * to the empty array, not the fallback — an admin who deleted every row meant to
 * delete every row, and silently resurrecting the seed data would look like the
 * delete had failed.
 */
export async function loadContent(type, fallback = null) {
  try {
    const res = await fetch(`/api/content/${type}`);
    if (!res.ok) return fallback;
    const data = await res.json();
    if (data.simulated || !Array.isArray(data.items)) return fallback;
    return data.items;
  } catch {
    return fallback;
  }
}

/**
 * Static content first paint, database content when it arrives.
 *
 * `mapRow` converts a database row (snake_case, storage shape) into whatever
 * shape the page already renders, so pages keep their existing markup. It is a
 * dependency of the effect, so it MUST be defined at module scope — an inline
 * arrow would be a new reference every render and refetch forever.
 */
export function useContent(type, fallback, mapRow) {
  const [items, setItems] = useState(fallback);

  useEffect(() => {
    let cancelled = false;
    loadContent(type, null).then((rows) => {
      if (cancelled || !rows) return;
      setItems(mapRow ? rows.map(mapRow) : rows);
    });
    return () => {
      cancelled = true;
    };
  }, [type, mapRow]);

  return items;
}
