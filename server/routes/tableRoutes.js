const express = require("express");
const router = express.Router();
const Table = require("../models/Table");

// Get all tables (admin)
router.get("/", async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    res.json(tables);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tables" });
  }
});

// Create table (admin)
router.post("/", async (req, res) => {
  try {
    const { tableNumber, seats } = req.body;
    if (!tableNumber) return res.status(400).json({ message: "Table number required" });
    const table = await Table.create({ tableNumber, seats: seats || 4 });
    res.status(201).json(table);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "Table number already exists" });
    res.status(500).json({ message: "Failed to create table" });
  }
});

// Delete table (admin)
router.delete("/:id", async (req, res) => {
  try {
    await Table.findByIdAndDelete(req.params.id);
    res.json({ message: "Table deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete table" });
  }
});

// Get table by number (for QR scan)
router.get("/scan/:tableNumber", async (req, res) => {
  try {
    const table = await Table.findOne({ tableNumber: req.params.tableNumber, active: true });
    if (!table) return res.status(404).json({ message: "Table not found" });
    res.json(table);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch table" });
  }
});

module.exports = router;
