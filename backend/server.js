const express = require("express");
const cors = require("cors");
const path = require("path");

const promptsRouter = require("./routes/prompts");
const favoritesRouter = require("./routes/favorites");

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────
app.use("/api/prompts", promptsRouter);
app.use("/api/favorites", favoritesRouter);

// ─── Health check ────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Start ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`PromptCraft backend running on http://localhost:${PORT}`);
});
