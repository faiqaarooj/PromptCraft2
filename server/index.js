const express = require("express");
const cors    = require("cors");

const promptRoutes    = require("./routes/prompts");
const historyRoutes   = require("./routes/history");
const favoritesRoutes = require("./routes/favorites");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", promptRoutes);
app.use("/api/history",   historyRoutes);
app.use("/api/favorites", favoritesRoutes);

// ── 404 handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`PromptCraft server running on http://localhost:${PORT}`);
  console.log(`  GET  /api/health`);
  console.log(`  GET  /api/tools`);
  console.log(`  GET  /api/categories`);
  console.log(`  GET  /api/tones`);
  console.log(`  GET  /api/frameworks`);
  console.log(`  GET  /api/tips`);
  console.log(`  GET  /api/prompts[?category=&tool=&search=]`);
  console.log(`  GET  /api/prompts/:id`);
  console.log(`  GET  /api/history`);
  console.log(`  POST /api/history`);
  console.log(`  DELETE /api/history`);
  console.log(`  DELETE /api/history/:id`);
  console.log(`  GET  /api/favorites`);
  console.log(`  POST /api/favorites/:id`);
  console.log(`  DELETE /api/favorites/:id`);
});

module.exports = app;
