const { Router } = require("express");
const { getFavorites, addFavorite, removeFavorite } = require("../data/store");

const router = Router();

router.get("/", (_req, res) => {
  res.json(getFavorites());
});

router.post("/:id", async (req, res) => {
  const favorites = await addFavorite(req.params.id);
  res.status(201).json(favorites);
});

router.delete("/:id", async (req, res) => {
  const removed = await removeFavorite(req.params.id);
  if (!removed) return res.status(404).json({ error: "Favourite not found" });
  res.json({ message: "Favourite removed" });
});

module.exports = router;
