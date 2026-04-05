const express = require("express");
const Menu = require("../models/Menu");

const router = express.Router();

// Get all menu items
router.get("/", async (req, res) => {
  try {
    const items = await Menu.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add menu item
router.post("/", async (req, res) => {
  try {
    const item = new Menu(req.body);
    await item.save();
    res.json({ message: "Item added", item });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete menu item
router.delete("/:id", async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update menu item
router.put("/:id", async (req, res) => {
  try {
    const item = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item updated", item });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Toggle availability
router.patch("/:id/toggle", async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    item.available = !item.available;
    await item.save();
    res.json({ message: "Availability toggled", item });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Seed menu from frontend data (only if DB is empty)
router.post("/seed", async (req, res) => {
  try {
    const count = await Menu.countDocuments();
    if (count > 0) return res.json({ message: "Menu already has items", count });
    const items = req.body;
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: "No items provided" });
    const docs = items.map(({ id, ...rest }) => rest);
    await Menu.insertMany(docs);
    res.json({ message: `${docs.length} items seeded successfully` });
  } catch (err) {
    res.status(500).json({ message: "Seed failed" });
  }
});

module.exports = router;
