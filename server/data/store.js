/**
 * Simple file-based JSON store.
 * All data is persisted to server/data/db.json so it survives restarts
 * without needing a separate database.
 */
const fs   = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "db.json");

/** Load the whole database file, creating it if it doesn't exist. */
function load() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ prompts: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

/** Persist the full database object back to disk. */
function save(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// ── Prompt CRUD ───────────────────────────────────────────────

/** Return all saved prompts (newest first). */
function getAllPrompts() {
  const db = load();
  return [...db.prompts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

/** Return a single prompt by id, or null if not found. */
function getPromptById(id) {
  const db = load();
  return db.prompts.find((p) => p.id === id) ?? null;
}

/** Insert a new prompt object and return it. */
function createPrompt(prompt) {
  const db = load();
  db.prompts.push(prompt);
  save(db);
  return prompt;
}

/** Delete a prompt by id. Returns true when deleted, false when not found. */
function deletePrompt(id) {
  const db = load();
  const before = db.prompts.length;
  db.prompts = db.prompts.filter((p) => p.id !== id);
  if (db.prompts.length === before) return false;
  save(db);
  return true;
}

/** Delete every saved prompt. */
function clearPrompts() {
  const db = load();
  db.prompts = [];
  save(db);
}

module.exports = { getAllPrompts, getPromptById, createPrompt, deletePrompt, clearPrompts };
