// Module-level cache so the jobs fetch can be warmed up as soon as the app
// mounts (see App.jsx), well before the user actually clicks into
// Career Explorer — avoids a visible loading spinner on the common path.

export const CAREER_INTERESTS = ["3D & Animation", "Game Dev", "AI & Data", "Software"];

const cache = new Map(); // interest -> { promise, data }

export function prefetchCareers(interest = "") {
  const existing = cache.get(interest);
  if (existing) return existing.promise;

  const params = interest ? `?interest=${encodeURIComponent(interest)}` : "";
  const entry = { promise: null, data: null };
  entry.promise = fetch(`/api/careers${params}`)
    .then((res) => res.json())
    .then((data) => {
      entry.data = data;
      return data;
    })
    .catch(() => {
      cache.delete(interest);
      throw new Error("careers fetch failed");
    });

  cache.set(interest, entry);
  return entry.promise;
}

export function getCachedCareers(interest = "") {
  return cache.get(interest)?.data || null;
}
