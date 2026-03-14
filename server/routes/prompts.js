/**
 * /api/prompts  –  CRUD for user-saved prompts
 *
 *  GET    /api/prompts          – list all prompts (newest first)
 *  GET    /api/prompts/:id      – get a single prompt
 *  POST   /api/prompts          – save a new prompt
 *  DELETE /api/prompts          – delete all prompts
 *  DELETE /api/prompts/:id      – delete one prompt
 */
const { Router } = require("express");
const { v4: uuidv4 } = require("uuid");
const store = require("../data/store");

const router = Router();

// ── GET /api/prompts ──────────────────────────────────────────
router.get("/", (req, res) => {
  res.json(store.getAllPrompts());
});

// ── GET /api/prompts/:id ──────────────────────────────────────
router.get("/:id", (req, res) => {
  const prompt = store.getPromptById(req.params.id);
  if (!prompt) return res.status(404).json({ error: "Prompt not found" });
  res.json(prompt);
});

// ── POST /api/prompts ─────────────────────────────────────────
router.post("/", (req, res) => {
  const { text, framework, tool, category, score } = req.body ?? {};

  if (!text || typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "Field 'text' is required" });
  }

  const prompt = {
    id:        uuidv4(),
    text:      text.trim(),
    framework: framework ?? null,
    tool:      tool       ?? null,
    category:  category   ?? null,
    score:     typeof score === "number" ? score : null,
    createdAt: new Date().toISOString(),
  };

  const created = store.createPrompt(prompt);
  res.status(201).json(created);
});

// ── DELETE /api/prompts ───────────────────────────────────────
router.delete("/", (req, res) => {
  store.clearPrompts();
  res.json({ message: "All prompts deleted" });
});

// ── DELETE /api/prompts/:id ───────────────────────────────────
router.delete("/:id", (req, res) => {
  const deleted = store.deletePrompt(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Prompt not found" });
  res.json({ message: "Prompt deleted" });
});

module.exports = router;
