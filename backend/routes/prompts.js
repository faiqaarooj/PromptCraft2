const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { readPrompts, writePrompts } = require("../data/store");

const router = express.Router();

// GET /api/prompts  – return all saved prompts (newest first)
router.get("/", (req, res) => {
  const prompts = readPrompts();
  res.json(prompts.slice().reverse());
});

// POST /api/prompts  – save a new prompt
router.post("/", (req, res) => {
  const { title, prompt, tool, category, tone, framework } = req.body;

  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return res.status(400).json({ error: "prompt text is required" });
  }

  const entry = {
    id: uuidv4(),
    title: title ? String(title).trim() : "Untitled",
    prompt: prompt.trim(),
    tool: tool || null,
    category: category || null,
    tone: tone || null,
    framework: framework || null,
    createdAt: new Date().toISOString(),
  };

  const prompts = readPrompts();
  prompts.push(entry);
  writePrompts(prompts);

  res.status(201).json(entry);
});

// DELETE /api/prompts/:id  – delete a saved prompt by id
router.delete("/:id", (req, res) => {
  const prompts = readPrompts();
  const index = prompts.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "prompt not found" });
  }

  const [deleted] = prompts.splice(index, 1);
  writePrompts(prompts);
  res.json(deleted);
});

module.exports = router;
