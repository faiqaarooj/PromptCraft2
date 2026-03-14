/**
 * db.js — lightweight JSON file database
 *
 * All data lives in backend/data/db.json so it persists between server
 * restarts without requiring an external database.  The file is created
 * automatically on first run.
 */

const fs   = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "data", "db.json");

const DEFAULTS = {
  history:   [],
  favorites: [],
};

function read() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  } catch {
    return { ...DEFAULTS };
  }
}

function write(data) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}

module.exports = { read, write };
