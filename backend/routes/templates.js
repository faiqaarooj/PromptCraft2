/**
 * routes/templates.js — read-only prompt library templates
 *
 * GET /api/templates            — list all templates
 * GET /api/templates/:id        — get a single template by id
 * GET /api/templates?category=  — filter by category  (e.g. code, design)
 * GET /api/templates?tool=      — filter by AI tool   (e.g. claude, chatgpt)
 */

const express = require("express");
const { PROMPT_LIBRARY } = require("../data/promptLibrary");

const router = express.Router();

// GET /api/templates
router.get("/", (req, res) => {
  let results = PROMPT_LIBRARY;

  if (req.query.category) {
    results = results.filter((t) => t.category === req.query.category);
  }
  if (req.query.tool) {
    results = results.filter((t) => t.tool === req.query.tool);
  }

  res.json(results);
});

// GET /api/templates/:id
router.get("/:id", (req, res) => {
  const template = PROMPT_LIBRARY.find((t) => t.id === req.params.id);
  if (!template) {
    return res.status(404).json({ error: "Template not found" });
  }
  res.json(template);
});

module.exports = router;
