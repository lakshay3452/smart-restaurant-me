const express = require("express");
const router = express.Router();
const Coupon = require("../models/Coupon");

// Get all coupons (admin)
router.get("/all", async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch coupons" });
  }
});

// Get active coupons (customer)
router.get("/active", async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      active: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }]
    });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch coupons" });
  }
});

// Validate & apply coupon
router.post("/validate", async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (!coupon) return res.status(400).json({ message: "Invalid coupon code" });
    if (!coupon.active) return res.status(400).json({ message: "Coupon is inactive" });
    if (coupon.expiresAt && new Date() > coupon.expiresAt) return res.status(400).json({ message: "Coupon has expired" });
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ message: "Coupon usage limit reached" });
    if (orderTotal < coupon.minOrder) return res.status(400).json({ message: `Minimum order ₹${coupon.minOrder} required` });

    let discount = 0;
    if (coupon.type === "percent") {
      discount = Math.min(Math.round(orderTotal * coupon.discount / 100), coupon.maxDiscount || Infinity);
    } else {
      discount = coupon.discount;
    }

    res.json({ coupon, discount });
  } catch (err) {
    res.status(500).json({ message: "Failed to validate coupon" });
  }
});

// Create coupon (admin)
router.post("/", async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "Coupon code already exists" });
    res.status(500).json({ message: "Failed to create coupon" });
  }
});

// Update coupon (admin)
router.put("/:id", async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: "Failed to update coupon" });
  }
});

// Delete coupon (admin)
router.delete("/:id", async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: "Coupon deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete coupon" });
  }
});

module.exports = router;
