const { Router } = require("express");
const { v4: uuidv4 } = require("uuid");
const {
  getHistory,
  addHistory,
  clearHistory,
  removeHistoryEntry,
} = require("../data/store");

const router = Router();

router.get("/", (_req, res) => {
  res.json(getHistory());
});

router.post("/", async (req, res) => {
  const { id, prompt, framework, tool, score, preview } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "prompt is required" });
  }

  const entry = {
    id: id != null ? id : uuidv4(),
    savedAt: new Date().toISOString(),
    prompt,
    framework: framework || null,
    tool: tool || null,
    score: typeof score === "number" ? score : null,
    preview: preview || (prompt.length > 100 ? prompt.slice(0, 100) + "..." : prompt),
  };

  await addHistory(entry);
  res.status(201).json(entry);
});

router.delete("/", async (_req, res) => {
  await clearHistory();
  res.json({ message: "History cleared" });
});

router.delete("/:id", async (req, res) => {
  const removed = await removeHistoryEntry(req.params.id);
  if (!removed) return res.status(404).json({ error: "Entry not found" });
  res.json({ message: "Entry removed" });
});

module.exports = router;
