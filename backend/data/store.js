/**
 * PromptCraft API – file-based JSON storage helpers
 *
 * All persistent data lives in this directory as plain JSON files so the
 * server requires no external database to get started.
 */

const fs = require("fs");
const path = require("path");

const PROMPTS_FILE = path.join(__dirname, "prompts.json");
const FAVORITES_FILE = path.join(__dirname, "favorites.json");

function readJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[store] Failed to read ${filePath}:`, err.message);
    return [];
  }
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function readPrompts() {
  return readJSON(PROMPTS_FILE);
}

function writePrompts(prompts) {
  writeJSON(PROMPTS_FILE, prompts);
}

function readFavorites() {
  return readJSON(FAVORITES_FILE);
}

function writeFavorites(favorites) {
  writeJSON(FAVORITES_FILE, favorites);
}

module.exports = { readPrompts, writePrompts, readFavorites, writeFavorites };
