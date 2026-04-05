const express = require("express");
const router = express.Router();
const Favourite = require("../models/Favourite");

// Get user's favourites
router.get("/:email", async (req, res) => {
  try {
    const favs = await Favourite.find({ email: req.params.email }).sort({ createdAt: -1 });
    res.json(favs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch favourites" });
  }
});

// Add to favourites
router.post("/", async (req, res) => {
  try {
    const { email, menuItemId, name, price, image, category, isVeg, rating } = req.body;
    if (!email || !menuItemId) return res.status(400).json({ message: "Email and menuItemId required" });

    const existing = await Favourite.findOne({ email, menuItemId });
    if (existing) return res.status(400).json({ message: "Already in favourites" });

    const fav = await Favourite.create({ email, menuItemId, name, price, image, category, isVeg, rating });
    res.status(201).json(fav);
  } catch (err) {
    res.status(500).json({ message: "Failed to add favourite" });
  }
});

// Remove from favourites
router.delete("/:email/:menuItemId", async (req, res) => {
  try {
    await Favourite.findOneAndDelete({ email: req.params.email, menuItemId: req.params.menuItemId });
    res.json({ message: "Removed from favourites" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove favourite" });
  }
});

module.exports = router;
