/**
 * src/api.js
 *
 * Thin wrapper for communicating with the PromptCraft backend.
 * All functions degrade gracefully to localStorage when the
 * server is unavailable so the app always works offline too.
 *
 * Base URL is read from REACT_APP_API_URL (create a .env file):
 *   REACT_APP_API_URL=http://localhost:4000
 *
 * If the env variable is not set the app operates in local-only mode.
 */

const BASE = process.env.REACT_APP_API_URL || "";

// Helper – returns null on any network / parse error
async function apiFetch(path, options = {}) {
  if (!BASE) return null;
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ── Prompts API ───────────────────────────────────────────────

/**
 * Fetch all saved prompts from the server.
 * Returns null when the server is unreachable.
 */
export async function fetchPrompts() {
  return apiFetch("/api/prompts");
}

/**
 * Save a prompt to the server.
 * @param {{ text: string, framework?: string, tool?: string, category?: string, score?: number }} prompt
 * Returns the created prompt object or null on failure.
 */
export async function savePrompt(prompt) {
  return apiFetch("/api/prompts", {
    method: "POST",
    body: JSON.stringify(prompt),
  });
}

/**
 * Delete a single prompt by id.
 * Returns true on success, false on failure.
 */
export async function deletePrompt(id) {
  const result = await apiFetch(`/api/prompts/${id}`, { method: "DELETE" });
  return result !== null;
}

/**
 * Delete all saved prompts on the server.
 * Returns true on success, false on failure.
 */
export async function clearPrompts() {
  const result = await apiFetch("/api/prompts", { method: "DELETE" });
  return result !== null;
}

// ── Library API ───────────────────────────────────────────────

/**
 * Fetch prompt library templates.
 * @param {{ category?: string, tool?: string }} filters
 * Returns null when the server is unreachable.
 */
export async function fetchLibrary({ category, tool } = {}) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (tool) params.set("tool", tool);
  const qs = params.toString() ? `?${params.toString()}` : "";
  return apiFetch(`/api/library${qs}`);
}

/**
 * Check whether the backend server is reachable.
 * Returns true when the /health endpoint responds.
 */
export async function isServerAvailable() {
  if (!BASE) return false;
  try {
    const res = await fetch(`${BASE}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
