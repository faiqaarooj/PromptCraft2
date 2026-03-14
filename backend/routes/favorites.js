const express = require("express");
const fs = require("fs");
const fsp = require("fs").promises;
const path = require("path");

const router = express.Router();
const DATA_FILE = path.join(__dirname, "../data/favorites.json");

// ─── Helpers ─────────────────────────────────────────────────
async function readFavorites() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = await fsp.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("[favorites] Failed to read favorites file:", err.message);
    return [];
  }
}

async function writeFavorites(data) {
  await fsp.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

// ─── GET /api/favorites ───────────────────────────────────────
// Returns the list of favorited prompt IDs
router.get("/", async (_req, res) => {
  const favs = await readFavorites();
  res.json(favs);
});

// ─── POST /api/favorites/:id ──────────────────────────────────
// Adds a prompt ID to favorites
router.post("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "id is required" });

  try {
    const favs = await readFavorites();
    if (favs.includes(id)) {
      return res.status(200).json(favs); // already favorited
    }
    const updated = [...favs, id];
    await writeFavorites(updated);
    res.status(201).json(updated);
  } catch (err) {
    console.error("[favorites] Failed to add favorite:", err.message);
    res.status(500).json({ error: "Failed to add favorite" });
  }
});

// ─── DELETE /api/favorites/:id ────────────────────────────────
// Removes a prompt ID from favorites
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const favs = await readFavorites();
    const updated = favs.filter((f) => f !== id);
    if (updated.length === favs.length) {
      return res.status(404).json({ error: "Favorite not found" });
    }
    await writeFavorites(updated);
    res.json(updated);
  } catch (err) {
    console.error("[favorites] Failed to remove favorite:", err.message);
    res.status(500).json({ error: "Failed to remove favorite" });
  }
});

module.exports = router;
