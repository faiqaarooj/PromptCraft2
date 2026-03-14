/**
 * routes/favorites.js — CRUD for favorited prompts
 *
 * GET    /api/favorites         — list all favorites
 * POST   /api/favorites         — add a prompt to favorites
 * DELETE /api/favorites/:id     — remove a single favorite
 * DELETE /api/favorites         — clear all favorites
 */

const express = require("express");
const { v4: uuidv4 } = require("uuid");
const db = require("../db");

const router = express.Router();

// GET /api/favorites
router.get("/", (req, res) => {
  const { favorites } = db.read();
  res.json(favorites);
});

// POST /api/favorites
router.post("/", (req, res) => {
  const { framework, tool, tone, prompt, score, title } = req.body;

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "prompt text is required" });
  }

  const data = db.read();
  const alreadyExists = data.favorites.some(
    (f) => f.prompt.trim() === prompt.trim()
  );
  if (alreadyExists) {
    return res.status(409).json({ error: "Prompt already in favorites" });
  }

  const entry = {
    id:        req.body.id || uuidv4(),  // reuse client-supplied id if present
    savedAt:   new Date().toISOString(),
    title:     title     || null,
    framework: framework || null,
    tool:      tool      || null,
    tone:      tone      || null,
    score:     typeof score === "number" ? score : null,
    prompt:    prompt.trim(),
  };

  data.favorites = [entry, ...data.favorites];
  db.write(data);

  res.status(201).json(entry);
});

// DELETE /api/favorites  (clear all)
router.delete("/", (req, res) => {
  const data      = db.read();
  data.favorites  = [];
  db.write(data);
  res.json({ message: "All favorites cleared" });
});

// DELETE /api/favorites/:id
router.delete("/:id", (req, res) => {
  const data = db.read();
  const before = data.favorites.length;
  // Compare as strings to handle both UUID and numeric (Date.now) ids
  data.favorites = data.favorites.filter((f) => String(f.id) !== req.params.id);

  if (data.favorites.length === before) {
    return res.status(404).json({ error: "Favorite not found" });
  }

  db.write(data);
  res.json({ message: "Favorite removed" });
});

module.exports = router;
