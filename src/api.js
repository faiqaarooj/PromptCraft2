// ─── PromptCraft API service ───────────────────────────────────────────────────
// All requests go to the Express backend running on REACT_APP_API_URL.
// If the env variable is not set (e.g. when running without the backend) every
// function silently returns the appropriate empty value so the app can keep
// using localStorage as a fallback.

const BASE = process.env.REACT_APP_API_URL || "";

async function request(method, path, body) {
  if (!BASE) return null;
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ─── Health ────────────────────────────────────────────────────────────────────
export async function checkHealth() {
  return request("GET", "/api/health");
}

// ─── Prompt history ────────────────────────────────────────────────────────────
export async function fetchHistory() {
  return request("GET", "/api/prompts");
}

export async function savePrompt(entry) {
  return request("POST", "/api/prompts", entry);
}

export async function deletePrompt(id) {
  return request("DELETE", `/api/prompts/${id}`);
}

export async function clearHistory() {
  return request("DELETE", "/api/prompts");
}

// ─── Favorites ─────────────────────────────────────────────────────────────────
export async function fetchFavorites() {
  return request("GET", "/api/favorites");
}

export async function addFavorite(id) {
  return request("POST", `/api/favorites/${id}`);
}

export async function removeFavorite(id) {
  return request("DELETE", `/api/favorites/${id}`);
}
