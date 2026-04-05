const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// Submit feedback
router.post("/", async (req, res) => {
  try {
    const { orderId, email, rating, comment, deliveryRating, foodRating } = req.body;
    if (!orderId || !email || !rating) return res.status(400).json({ message: "orderId, email, and rating required" });

    const existing = await Feedback.findOne({ orderId });
    if (existing) return res.status(400).json({ message: "Feedback already submitted for this order" });

    const feedback = await Feedback.create({ orderId, email, rating, comment, deliveryRating, foodRating });
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: "Failed to submit feedback" });
  }
});

// Check if feedback exists for an order
router.get("/check/:orderId", async (req, res) => {
  try {
    const feedback = await Feedback.findOne({ orderId: req.params.orderId });
    res.json({ exists: !!feedback, feedback });
  } catch (err) {
    res.status(500).json({ message: "Failed to check feedback" });
  }
});

// Get all feedback (admin)
router.get("/all", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
});

module.exports = router;
