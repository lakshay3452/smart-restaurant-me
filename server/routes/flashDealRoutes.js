const express = require("express");
const router = express.Router();
const FlashDeal = require("../models/FlashDeal");

// Get all flash deals (admin)
router.get("/all", async (req, res) => {
  try {
    const deals = await FlashDeal.find().sort({ createdAt: -1 });
    res.json(deals);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch flash deals" });
  }
});

// Get currently active deals (customer)
router.get("/active", async (req, res) => {
  try {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
    const currentDay = now.getDay();

    const deals = await FlashDeal.find({ active: true });
    const activeNow = deals.filter(deal => {
      const timeOk = currentTime >= deal.startTime && currentTime <= deal.endTime;
      const dayOk = deal.daysOfWeek.length === 0 || deal.daysOfWeek.includes(currentDay);
      return timeOk && dayOk;
    });

    res.json(activeNow);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch active deals" });
  }
});

// Create flash deal (admin)
router.post("/", async (req, res) => {
  try {
    const deal = await FlashDeal.create(req.body);
    res.status(201).json(deal);
  } catch (err) {
    res.status(500).json({ message: "Failed to create flash deal" });
  }
});

// Update flash deal (admin)
router.put("/:id", async (req, res) => {
  try {
    const deal = await FlashDeal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(deal);
  } catch (err) {
    res.status(500).json({ message: "Failed to update flash deal" });
  }
});

// Delete flash deal (admin)
router.delete("/:id", async (req, res) => {
  try {
    await FlashDeal.findByIdAndDelete(req.params.id);
    res.json({ message: "Flash deal deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete flash deal" });
  }
});

module.exports = router;
