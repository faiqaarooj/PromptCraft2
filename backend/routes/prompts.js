const express = require("express");
const fs = require("fs");
const fsp = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const DATA_FILE = path.join(__dirname, "../data/history.json");

// ─── Helpers ─────────────────────────────────────────────────
async function readHistory() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = await fsp.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("[prompts] Failed to read history file:", err.message);
    return [];
  }
}

async function writeHistory(data) {
  await fsp.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

// ─── GET /api/prompts ─────────────────────────────────────────
// Returns all saved prompts (newest first)
router.get("/", async (_req, res) => {
  const history = await readHistory();
  res.json(history);
});

// ─── POST /api/prompts ────────────────────────────────────────
// Saves a new prompt entry
// Body: { prompt, framework, tool, score, preview }
router.post("/", async (req, res) => {
  const { prompt, framework, tool, score, preview } = req.body;
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return res.status(400).json({ error: "prompt is required" });
  }

  const entry = {
    id: uuidv4(),
    savedAt: new Date().toISOString(),
    prompt: prompt.trim(),
    framework: framework || null,
    tool: tool || null,
    score: typeof score === "number" ? score : null,
    preview: preview || prompt.trim().slice(0, 100) + "...",
  };

  try {
    const history = [entry, ...(await readHistory())].slice(0, 50); // keep latest 50
    await writeHistory(history);
    res.status(201).json(entry);
  } catch (err) {
    console.error("[prompts] Failed to save prompt:", err.message);
    res.status(500).json({ error: "Failed to save prompt" });
  }
});

// ─── DELETE /api/prompts ──────────────────────────────────────
// Clears all saved prompts
router.delete("/", async (_req, res) => {
  try {
    await writeHistory([]);
    res.json({ message: "History cleared" });
  } catch (err) {
    console.error("[prompts] Failed to clear history:", err.message);
    res.status(500).json({ error: "Failed to clear history" });
  }
});

// ─── DELETE /api/prompts/:id ──────────────────────────────────
// Removes a single prompt by id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const history = await readHistory();
    const next = history.filter((h) => h.id !== id);
    if (next.length === history.length) {
      return res.status(404).json({ error: "Prompt not found" });
    }
    await writeHistory(next);
    res.json({ message: "Prompt removed" });
  } catch (err) {
    console.error("[prompts] Failed to delete prompt:", err.message);
    res.status(500).json({ error: "Failed to delete prompt" });
  }
});

module.exports = router;
