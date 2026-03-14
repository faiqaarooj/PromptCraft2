/**
 * History routes — stores the prompts a user has saved.
 *
 * GET    /api/history           – list all saved prompts (newest first)
 * POST   /api/history           – save a new prompt entry
 * DELETE /api/history           – clear all entries
 * DELETE /api/history/:id       – remove a single entry
 */

const { Router } = require('express');
const { v4: uuidv4 } = require('uuid');

const router = Router();

// In-memory store (replace with a database for production persistence)
let history = [];
const MAX_HISTORY = 50;

// GET /api/history
router.get('/', (_req, res) => {
  res.json(history);
});

// POST /api/history
router.post('/', (req, res) => {
  const { prompt, framework, tool, score, preview } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    return res.status(400).json({ error: 'prompt is required and must be a non-empty string' });
  }

  const entry = {
    id: uuidv4(),
    prompt: prompt.trim(),
    framework: framework || null,
    tool: tool || null,
    score: typeof score === 'number' ? score : null,
    preview: preview || (prompt.trim().length > 100 ? prompt.trim().slice(0, 100) + '...' : prompt.trim()),
    savedAt: new Date().toISOString(),
  };

  history = [entry, ...history].slice(0, MAX_HISTORY);
  res.status(201).json(entry);
});

// DELETE /api/history  (clear all)
router.delete('/', (_req, res) => {
  history = [];
  res.json({ message: 'History cleared' });
});

// DELETE /api/history/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const before = history.length;
  history = history.filter((h) => h.id !== id);

  if (history.length === before) {
    return res.status(404).json({ error: 'Entry not found' });
  }
  res.json({ message: 'Entry removed' });
});

module.exports = router;
