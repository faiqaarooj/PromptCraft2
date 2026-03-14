require("dotenv").config();

const express = require("express");
const cors = require("cors");

const promptsRouter = require("./routes/prompts");
const favoritesRouter = require("./routes/favorites");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/prompts", promptsRouter);
app.use("/api/favorites", favoritesRouter);

// 404 handler for unknown API routes
app.use((_req, res) => {
  res.status(404).json({ error: "not found" });
});

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`PromptCraft API running at http://localhost:${PORT}`);
  console.log(`  GET  http://localhost:${PORT}/api/health`);
  console.log(`  GET  http://localhost:${PORT}/api/prompts`);
  console.log(`  POST http://localhost:${PORT}/api/prompts`);
  console.log(`  GET  http://localhost:${PORT}/api/favorites`);
  console.log(`  POST http://localhost:${PORT}/api/favorites`);
});
