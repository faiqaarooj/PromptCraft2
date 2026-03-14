require('dotenv').config();
const express = require('express');
const cors = require('cors');

const historyRouter  = require('./routes/history');
const favoritesRouter = require('./routes/favorites');
const promptsRouter  = require('./routes/prompts');

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
}));
app.use(express.json());

// ─── Routes ─────────────────────────────────────────────────
app.use('/api/history',   historyRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/prompts',   promptsRouter);

// ─── Health check ────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── 404 handler ─────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Error handler ───────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  } else {
    console.error(err.message);
  }
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`PromptCraft backend running on http://localhost:${PORT}`);
});

module.exports = app;
