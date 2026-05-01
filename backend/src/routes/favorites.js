const express = require("express");
const db = require("../config/db");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// All favorites routes require authentication
router.use(requireAuth);

// ── GET /api/favorites ───────────────────────────────────────
// Returns all favorites for the authenticated user (newest first)
router.get("/", (req, res) => {
  const rows = db
    .prepare(
      "SELECT id, title, prompt_text, framework, category, tool, tags, created_at FROM favorites WHERE user_id = ? ORDER BY created_at DESC"
    )
    .all(req.userId);

  // Parse tags JSON string back to array
  const parsed = rows.map((r) => ({ ...r, tags: r.tags ? JSON.parse(r.tags) : [] }));
  return res.json(parsed);
});

// ── POST /api/favorites ──────────────────────────────────────
// Add a prompt to favourites
router.post("/", (req, res) => {
  const { title, prompt_text, framework, category, tool, tags } = req.body;

  if (!title || !prompt_text) {
    return res.status(400).json({ error: "title and prompt_text are required" });
  }

  const tagsJson = tags ? JSON.stringify(tags) : null;

  const result = db
    .prepare(
      "INSERT INTO favorites (user_id, title, prompt_text, framework, category, tool, tags) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .run(req.userId, title, prompt_text, framework || null, category || null, tool || null, tagsJson);

  const saved = db.prepare("SELECT * FROM favorites WHERE id = ?").get(result.lastInsertRowid);
  return res.status(201).json({ ...saved, tags: saved.tags ? JSON.parse(saved.tags) : [] });
});

// ── DELETE /api/favorites/:id ────────────────────────────────
// Remove a favourite (only the owner can delete)
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const row = db
    .prepare("SELECT id FROM favorites WHERE id = ? AND user_id = ?")
    .get(id, req.userId);

  if (!row) {
    return res.status(404).json({ error: "Favorite not found" });
  }

  db.prepare("DELETE FROM favorites WHERE id = ?").run(id);
  return res.json({ message: "Removed from favorites" });
});

module.exports = router;
