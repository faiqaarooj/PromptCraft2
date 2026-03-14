/**
 * routes/prompts.js — CRUD for saved prompt history
 *
 * GET    /api/prompts          — list all history entries (newest first)
 * POST   /api/prompts          — save a new prompt to history
 * DELETE /api/prompts          — clear all history
 * DELETE /api/prompts/:id      — remove a single entry
 */

const express = require("express");
const { v4: uuidv4 } = require("uuid");
const db = require("../db");

const router = express.Router();

// GET /api/prompts
router.get("/", (req, res) => {
  const { history } = db.read();
  res.json(history);
});

// POST /api/prompts
router.post("/", (req, res) => {
  const { framework, tool, tone, prompt, score } = req.body;

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "prompt text is required" });
  }

  const entry = {
    id:        req.body.id || uuidv4(),  // reuse client-supplied id if present
    savedAt:   new Date().toISOString(),
    framework: framework || null,
    tool:      tool      || null,
    tone:      tone      || null,
    score:     typeof score === "number" ? score : null,
    prompt:    prompt.trim(),
  };

  const data     = db.read();
  data.history   = [entry, ...data.history].slice(0, 100); // keep latest 100
  db.write(data);

  res.status(201).json(entry);
});

// DELETE /api/prompts  (clear all)
router.delete("/", (req, res) => {
  const data    = db.read();
  data.history  = [];
  db.write(data);
  res.json({ message: "History cleared" });
});

// DELETE /api/prompts/:id
router.delete("/:id", (req, res) => {
  const data = db.read();
  const before = data.history.length;
  // Compare as strings to handle both UUID and numeric (Date.now) ids
  data.history = data.history.filter((h) => String(h.id) !== req.params.id);

  if (data.history.length === before) {
    return res.status(404).json({ error: "Entry not found" });
  }

  db.write(data);
  res.json({ message: "Entry removed" });
});

module.exports = router;
