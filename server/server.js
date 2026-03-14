/**
 * PromptCraft – Express REST API server
 *
 * Endpoints
 * ─────────
 *  GET  /health           → health check
 *  GET  /api/prompts      → list saved prompts
 *  POST /api/prompts      → save a prompt
 *  DEL  /api/prompts      → clear all prompts
 *  DEL  /api/prompts/:id  → delete one prompt
 *  GET  /api/library      → list prompt templates  (?category, ?tool)
 *  GET  /api/library/:id  → single template
 *
 * Start: node server.js  (or: npm start inside /server)
 */
require("dotenv").config();
const express = require("express");
const cors    = require("cors");

const promptsRouter = require("./routes/prompts");
const libraryRouter = require("./routes/library");

const app  = express();
const PORT = Number(process.env.PORT) || 4000;

// ── Middleware ────────────────────────────────────────────────
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : ["http://localhost:3000"];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// ── Health ────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── API Routes ────────────────────────────────────────────────
app.use("/api/prompts", promptsRouter);
app.use("/api/library", libraryRouter);

// ── 404 handler ───────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ── Error handler ─────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`PromptCraft API running on http://localhost:${PORT}`);
});
