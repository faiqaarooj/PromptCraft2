const { Router } = require("express");
const {
  AI_TOOLS, CATEGORIES, TONES, FRAMEWORKS, PROMPT_LIBRARY, PROMPT_TIPS,
} = require("../data/promptData");

const router = Router();

router.get("/tools",      (_req, res) => res.json(AI_TOOLS));
router.get("/categories", (_req, res) => res.json(CATEGORIES));
router.get("/tones",      (_req, res) => res.json(TONES));
router.get("/frameworks", (_req, res) => res.json(FRAMEWORKS));
router.get("/tips",       (_req, res) => res.json(PROMPT_TIPS));

router.get("/prompts", (req, res) => {
  const { category, tool, search } = req.query;
  let results = PROMPT_LIBRARY;

  if (category && category !== "all") {
    results = results.filter((p) => p.category === category);
  }
  if (tool && tool !== "all") {
    results = results.filter((p) => p.tool === tool);
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  res.json(results);
});

router.get("/prompts/:id", (req, res) => {
  const prompt = PROMPT_LIBRARY.find((p) => p.id === req.params.id);
  if (!prompt) return res.status(404).json({ error: "Prompt not found" });
  res.json(prompt);
});

module.exports = router;
