const express = require("express");
const router = express.Router();
const LoyaltyPoints = require("../models/LoyaltyPoints");
const User = require("../models/User");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");

const POINTS_PER_RUPEE = 1; // 1 point per rupee spent
const TIER_THRESHOLDS = {
  Bronze: 0,
  Silver: 1000,
  Gold: 5000,
  Platinum: 10000,
};

// Get user loyalty points
router.get("/", authMiddleware, async (req, res) => {
  try {
    let loyaltyPoints = await LoyaltyPoints.findOne({ userId: req.user._id });

    if (!loyaltyPoints) {
      loyaltyPoints = new LoyaltyPoints({ userId: req.user._id });
      await loyaltyPoints.save();
    }

    res.json(loyaltyPoints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add points (called after order completion)
router.post("/add-points", authMiddleware, async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    let loyaltyPoints = await LoyaltyPoints.findOne({ userId: req.user._id });
    if (!loyaltyPoints) {
      loyaltyPoints = new LoyaltyPoints({ userId: req.user._id });
    }

    const pointsToAdd = Math.floor(amount * POINTS_PER_RUPEE);

    loyaltyPoints.totalPoints += pointsToAdd;
    loyaltyPoints.availablePoints += pointsToAdd;

    // Update tier
    if (loyaltyPoints.totalPoints >= TIER_THRESHOLDS.Platinum) {
      loyaltyPoints.tier = "Platinum";
    } else if (loyaltyPoints.totalPoints >= TIER_THRESHOLDS.Gold) {
      loyaltyPoints.tier = "Gold";
    } else if (loyaltyPoints.totalPoints >= TIER_THRESHOLDS.Silver) {
      loyaltyPoints.tier = "Silver";
    }

    loyaltyPoints.pointHistory.push({
      type: "earned",
      points: pointsToAdd,
      description: `Earned from order`,
      orderId,
    });

    await loyaltyPoints.save();
    res.json({ message: "Points added", loyaltyPoints });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Redeem points
router.post("/redeem", authMiddleware, async (req, res) => {
  try {
    const { pointsToRedeem } = req.body;

    let loyaltyPoints = await LoyaltyPoints.findOne({ userId: req.user._id });
    if (!loyaltyPoints) {
      return res.status(404).json({ error: "No loyalty account found" });
    }

    if (loyaltyPoints.availablePoints < pointsToRedeem) {
      return res.status(400).json({ error: "Insufficient points" });
    }

    loyaltyPoints.availablePoints -= pointsToRedeem;
    loyaltyPoints.usedPoints += pointsToRedeem;

    loyaltyPoints.pointHistory.push({
      type: "redeemed",
      points: pointsToRedeem,
      description: "Points redeemed",
    });

    await loyaltyPoints.save();

    // Calculate discount (100 points = 500 rupees approx)
    const discountAmount = (pointsToRedeem / 100) * 500;

    res.json({
      message: "Points redeemed",
      discountAmount,
      loyaltyPoints,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get point history
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const loyaltyPoints = await LoyaltyPoints.findOne({ userId: req.user._id });
    if (!loyaltyPoints) {
      return res.status(404).json({ error: "No loyalty account found" });
    }

    res.json(loyaltyPoints.pointHistory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
