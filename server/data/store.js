const fs   = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "db.json");

const DEFAULT_DB = { history: [], favorites: [] };

function readDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf8");
    return { ...DEFAULT_DB, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_DB };
  }
}

async function writeDB(data) {
  await fs.promises.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}

function getHistory() {
  return readDB().history;
}

async function addHistory(entry) {
  const db = readDB();
  db.history = [entry, ...db.history].slice(0, 50);
  await writeDB(db);
  return entry;
}

async function clearHistory() {
  const db = readDB();
  db.history = [];
  await writeDB(db);
}

async function removeHistoryEntry(id) {
  const db = readDB();
  const before = db.history.length;
  db.history = db.history.filter((h) => String(h.id) !== String(id));
  await writeDB(db);
  return db.history.length < before;
}

function getFavorites() {
  return readDB().favorites;
}

async function addFavorite(id) {
  const db = readDB();
  if (!db.favorites.includes(id)) {
    db.favorites.push(id);
    await writeDB(db);
  }
  return db.favorites;
}

async function removeFavorite(id) {
  const db = readDB();
  const before = db.favorites.length;
  db.favorites = db.favorites.filter((f) => f !== id);
  await writeDB(db);
  return db.favorites.length < before;
}

module.exports = {
  getHistory,
  addHistory,
  clearHistory,
  removeHistoryEntry,
  getFavorites,
  addFavorite,
  removeFavorite,
};
