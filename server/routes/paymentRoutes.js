const express = require("express");
const router = express.Router();
const crypto = require("crypto");

// Create Order
router.post("/create-order", async (req, res) => {
  try {
    const razorpay = require("../utils/razorpay");
    if (!razorpay) {
      return res.status(503).json({ message: "Payment service not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env" });
    }

    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error creating order" });
  }
});

// Verify Payment
router.post("/verify-payment", (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
});

module.exports = router;
