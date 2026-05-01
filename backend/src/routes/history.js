const express = require("express");
const db = require("../config/db");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// All history routes require authentication
router.use(requireAuth);

// ── GET /api/history ─────────────────────────────────────────
// Returns all saved prompts for the authenticated user (newest first)
router.get("/", (req, res) => {
  const rows = db
    .prepare(
      "SELECT id, prompt_text, framework, tool, score, preview, created_at FROM prompt_history WHERE user_id = ? ORDER BY created_at DESC"
    )
    .all(req.userId);

  return res.json(rows);
});

// ── POST /api/history ────────────────────────────────────────
// Save a new prompt to history
router.post("/", (req, res) => {
  const { prompt_text, framework, tool, score, preview } = req.body;

  if (!prompt_text) {
    return res.status(400).json({ error: "prompt_text is required" });
  }

  const result = db
    .prepare(
      "INSERT INTO prompt_history (user_id, prompt_text, framework, tool, score, preview) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(req.userId, prompt_text, framework || null, tool || null, score || null, preview || null);

  const saved = db
    .prepare("SELECT * FROM prompt_history WHERE id = ?")
    .get(result.lastInsertRowid);

  return res.status(201).json(saved);
});

// ── DELETE /api/history/:id ──────────────────────────────────
// Delete a prompt from history (only the owner can delete)
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const row = db
    .prepare("SELECT id FROM prompt_history WHERE id = ? AND user_id = ?")
    .get(id, req.userId);

  if (!row) {
    return res.status(404).json({ error: "History entry not found" });
  }

  db.prepare("DELETE FROM prompt_history WHERE id = ?").run(id);
  return res.json({ message: "Deleted" });
});

module.exports = router;
