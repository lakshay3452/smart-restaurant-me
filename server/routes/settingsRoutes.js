const express = require("express");
const Settings = require("../models/Settings");
const router = express.Router();

// Get settings
router.get("/", async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch settings" });
  }
});

// Update settings
router.put("/", async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json({ message: "Settings updated", settings });
  } catch (err) {
    res.status(500).json({ message: "Failed to update settings" });
  }
});

module.exports = router;
