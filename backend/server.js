/**
 * PromptCraft — Node.js / Express backend
 *
 * Provides REST API endpoints for:
 *   • Prompt history  — GET/POST/DELETE  /api/prompts
 *   • Favorites       — GET/POST/DELETE  /api/favorites
 *   • Templates       — GET              /api/templates
 *
 * Quick start:
 *   cd backend && npm install && npm start
 *
 * Default port: 4000  (set PORT= in .env to change)
 */

require("dotenv").config();

const express  = require("express");
const cors     = require("cors");

const promptsRouter   = require("./routes/prompts");
const favoritesRouter = require("./routes/favorites");
const templatesRouter = require("./routes/templates");

const app  = express();
const PORT = process.env.PORT || 4000;

// ─── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────
app.use("/api/prompts",   promptsRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/templates", templatesRouter);

// ─── Health check ─────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── 404 catch-all ────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ─── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  PromptCraft backend running on http://localhost:${PORT}`);
  console.log(`   Health : http://localhost:${PORT}/health`);
  console.log(`   API    : http://localhost:${PORT}/api/prompts`);
  console.log(`            http://localhost:${PORT}/api/favorites`);
  console.log(`            http://localhost:${PORT}/api/templates\n`);
});
