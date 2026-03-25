const express = require("express");
const router = express.Router();
const Wallet = require("../models/Wallet");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// Get wallet balance
router.get("/", authMiddleware, async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.user._id });

    if (!wallet) {
      wallet = new Wallet({ userId: req.user._id });
      await wallet.save();
    }

    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add money to wallet
router.post("/add-money", authMiddleware, async (req, res) => {
  try {
    const { amount, paymentId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    let wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      wallet = new Wallet({ userId: req.user._id });
    }

    wallet.balance += amount;
    wallet.totalCredit += amount;

    wallet.transactionHistory.push({
      type: "credit",
      amount,
      description: "Money added to wallet",
      refNumber: paymentId,
    });

    await wallet.save();

    // Also update user wallet balance
    await User.findByIdAndUpdate(req.user._id, {
      walletBalance: wallet.balance,
    });

    res.json({ message: "Money added to wallet", wallet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Use wallet for payment
router.post("/use-balance", authMiddleware, async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    let wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ error: "Insufficient wallet balance" });
    }

    wallet.balance -= amount;
    wallet.totalDebit += amount;

    wallet.transactionHistory.push({
      type: "debit",
      amount,
      description: "Payment from wallet",
      orderId,
    });

    await wallet.save();

    // Update user
    await User.findByIdAndUpdate(req.user._id, {
      walletBalance: wallet.balance,
    });

    res.json({ message: "Payment processed from wallet", wallet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get transaction history
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    res.json(wallet.transactionHistory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
