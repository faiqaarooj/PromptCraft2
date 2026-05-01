require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

// Initialise DB (runs schema migrations on first start)
require("./src/config/db");

const authRoutes     = require("./src/routes/auth");
const historyRoutes  = require("./src/routes/history");
const favoritesRoutes = require("./src/routes/favorites");
const promptsRoutes  = require("./src/routes/prompts");

const app = express();

// ─── Rate limiters ───────────────────────────────────────────
// Strict limit for auth endpoints to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

// General limit for all other API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

// ─── Middleware ─────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ─────────────────────────────────────────────────
app.use("/api/auth",      authLimiter,  authRoutes);
app.use("/api/history",   apiLimiter,   historyRoutes);
app.use("/api/favorites", apiLimiter,   favoritesRoutes);
app.use("/api/prompts",   apiLimiter,   promptsRoutes);

// ─── Health check ────────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// ─── 404 handler ─────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: "Route not found" }));

// ─── Global error handler ────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// ─── Start server ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`PromptCraft API running on http://localhost:${PORT}`);
});

module.exports = app;
