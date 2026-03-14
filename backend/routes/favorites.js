/**
 * Favorites routes — stores the IDs of library prompts a user has starred.
 *
 * GET    /api/favorites          – list all favorite prompt IDs
 * POST   /api/favorites          – add a prompt ID to favorites
 * DELETE /api/favorites/:id      – remove a prompt ID from favorites
 */

const { Router } = require('express');

const router = Router();

// In-memory store (replace with a database for production persistence)
let favorites = [];

// GET /api/favorites
router.get('/', (_req, res) => {
  res.json(favorites);
});

// POST /api/favorites
router.post('/', (req, res) => {
  const { promptId } = req.body;

  if (!promptId || typeof promptId !== 'string' || promptId.trim() === '') {
    return res.status(400).json({ error: 'promptId is required and must be a non-empty string' });
  }

  const id = promptId.trim();
  if (!favorites.includes(id)) {
    favorites.push(id);
  }
  res.status(201).json({ promptId: id, favorites });
});

// DELETE /api/favorites/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const before = favorites.length;
  favorites = favorites.filter((f) => f !== id);

  if (favorites.length === before) {
    return res.status(404).json({ error: 'Favorite not found' });
  }
  res.json({ message: 'Favorite removed', favorites });
});

module.exports = router;
