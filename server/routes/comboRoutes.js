const express = require("express");
const router = express.Router();
const Combo = require("../models/Combo");
const authMiddleware = require("../middleware/authMiddleware");

// Get all available combos
router.get("/", async (req, res) => {
  try {
    const combos = await Combo.find({ available: true })
      .populate("items.menuItemId", "name price image");
    res.json(combos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get combo by ID
router.get("/:comboId", async (req, res) => {
  try {
    const combo = await Combo.findById(req.params.comboId).populate(
      "items.menuItemId"
    );
    if (!combo) return res.status(404).json({ error: "Combo not found" });
    res.json(combo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create combo (ADMIN)
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const combo = new Combo(req.body);
    await combo.save();
    res.json({ message: "Combo created", combo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update combo (ADMIN)
router.put("/:comboId", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const combo = await Combo.findByIdAndUpdate(req.params.comboId, req.body, {
      new: true,
    });
    res.json({ message: "Combo updated", combo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete combo (ADMIN)
router.delete("/:comboId", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    await Combo.findByIdAndDelete(req.params.comboId);
    res.json({ message: "Combo deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
