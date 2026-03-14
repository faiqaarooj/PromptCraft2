const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { readFavorites, writeFavorites } = require("../data/store");

const router = express.Router();

// GET /api/favorites  – return all favorites
router.get("/", (req, res) => {
  res.json(readFavorites());
});

// POST /api/favorites  – add a prompt to favorites
router.post("/", (req, res) => {
  const { promptId, title, prompt, tool, category } = req.body;

  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return res.status(400).json({ error: "prompt text is required" });
  }

  const favorites = readFavorites();

  // Avoid duplicates when promptId is provided
  if (promptId && favorites.some((f) => f.promptId === promptId)) {
    return res.status(409).json({ error: "already in favorites" });
  }

  const entry = {
    id: uuidv4(),
    promptId: promptId || null,
    title: title ? String(title).trim() : "Untitled",
    prompt: prompt.trim(),
    tool: tool || null,
    category: category || null,
    savedAt: new Date().toISOString(),
  };

  favorites.push(entry);
  writeFavorites(favorites);
  res.status(201).json(entry);
});

// DELETE /api/favorites/:id  – remove a favorite by its id
router.delete("/:id", (req, res) => {
  const favorites = readFavorites();
  const index = favorites.findIndex((f) => f.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "favorite not found" });
  }

  const [deleted] = favorites.splice(index, 1);
  writeFavorites(favorites);
  res.json(deleted);
});

module.exports = router;
