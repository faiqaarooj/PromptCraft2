const express = require("express");
const db = require("../config/db");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// ── GET /api/prompts ─────────────────────────────────────────
// Browse community-shared prompts (public — no auth required)
router.get("/", (req, res) => {
  const { category, tool, limit = 20, offset = 0 } = req.query;

  let query =
    "SELECT sp.id, sp.title, sp.prompt_text, sp.framework, sp.category, sp.tool, sp.tags, sp.created_at, u.email AS author FROM shared_prompts sp JOIN users u ON sp.user_id = u.id";
  const conditions = [];
  const params = [];

  if (category) {
    conditions.push("sp.category = ?");
    params.push(category);
  }
  if (tool) {
    conditions.push("sp.tool = ?");
    params.push(tool);
  }

  if (conditions.length) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY sp.created_at DESC LIMIT ? OFFSET ?";
  params.push(Number(limit), Number(offset));

  const rows = db.prepare(query).all(...params);
  const parsed = rows.map((r) => ({ ...r, tags: r.tags ? JSON.parse(r.tags) : [] }));
  return res.json(parsed);
});

// ── GET /api/prompts/:id ─────────────────────────────────────
// Get a single shared prompt
router.get("/:id", (req, res) => {
  const row = db
    .prepare(
      "SELECT sp.id, sp.title, sp.prompt_text, sp.framework, sp.category, sp.tool, sp.tags, sp.created_at, u.email AS author FROM shared_prompts sp JOIN users u ON sp.user_id = u.id WHERE sp.id = ?"
    )
    .get(req.params.id);

  if (!row) return res.status(404).json({ error: "Prompt not found" });
  return res.json({ ...row, tags: row.tags ? JSON.parse(row.tags) : [] });
});

// ── POST /api/prompts ────────────────────────────────────────
// Share a prompt publicly (auth required)
router.post("/", requireAuth, (req, res) => {
  const { title, prompt_text, framework, category, tool, tags } = req.body;

  if (!title || !prompt_text) {
    return res.status(400).json({ error: "title and prompt_text are required" });
  }

  const tagsJson = tags ? JSON.stringify(tags) : null;

  const result = db
    .prepare(
      "INSERT INTO shared_prompts (user_id, title, prompt_text, framework, category, tool, tags) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .run(
      req.userId,
      title,
      prompt_text,
      framework || null,
      category || null,
      tool || null,
      tagsJson
    );

  const saved = db
    .prepare("SELECT * FROM shared_prompts WHERE id = ?")
    .get(result.lastInsertRowid);
  return res.status(201).json({ ...saved, tags: saved.tags ? JSON.parse(saved.tags) : [] });
});

// ── DELETE /api/prompts/:id ──────────────────────────────────
// Delete a shared prompt (only the author can delete)
router.delete("/:id", requireAuth, (req, res) => {
  const { id } = req.params;

  const row = db
    .prepare("SELECT id FROM shared_prompts WHERE id = ? AND user_id = ?")
    .get(id, req.userId);

  if (!row) return res.status(404).json({ error: "Prompt not found" });

  db.prepare("DELETE FROM shared_prompts WHERE id = ?").run(id);
  return res.json({ message: "Deleted" });
});

module.exports = router;
