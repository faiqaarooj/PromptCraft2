// API service — talks to the Express backend when available,
// falls back to localStorage transparently.

const BASE = "/api";

async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch {
    return null;
  }
}

// ── History ────────────────────────────────────────────────────────────────

export async function apiGetHistory() {
  return safeFetch(`${BASE}/history`);
}

export async function apiSaveHistory(entry) {
  return safeFetch(`${BASE}/history`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
}

export async function apiClearHistory() {
  return safeFetch(`${BASE}/history`, { method: "DELETE" });
}

export async function apiRemoveHistory(id) {
  return safeFetch(`${BASE}/history/${id}`, { method: "DELETE" });
}

// ── Favourites ─────────────────────────────────────────────────────────────

export async function apiGetFavorites() {
  return safeFetch(`${BASE}/favorites`);
}

export async function apiAddFavorite(id) {
  return safeFetch(`${BASE}/favorites/${encodeURIComponent(id)}`, { method: "POST" });
}

export async function apiRemoveFavorite(id) {
  return safeFetch(`${BASE}/favorites/${encodeURIComponent(id)}`, { method: "DELETE" });
}
