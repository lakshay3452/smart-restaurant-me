const express = require("express");
const router = express.Router();
const Referral = require("../models/Referral");
const User = require("../models/User");
const Wallet = require("../models/Wallet");
const authMiddleware = require("../middleware/authMiddleware");
const crypto = require("crypto");

const REFERRAL_BONUS = 100;

// Generate referral code
function generateReferralCode() {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

// Get user's referral info
router.get("/", authMiddleware, async (req, res) => {
  try {
    let referral = await Referral.findOne({ referrerId: req.user._id });

    if (!referral) {
      const code = generateReferralCode();
      referral = new Referral({
        referrerId: req.user._id,
        referrerName: req.user.name,
        referrerEmail: req.user.email,
        referralCode: code,
      });
      await referral.save();

      // Update user with referral code
      await User.findByIdAndUpdate(req.user._id, { referralCode: code });
    }

    res.json(referral);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Apply referral code (when new user signs up)
router.post("/apply", authMiddleware, async (req, res) => {
  try {
    const { referralCode } = req.body;

    const referral = await Referral.findOne({ referralCode });
    if (!referral) {
      return res.status(404).json({ error: "Invalid referral code" });
    }

    // Check if already referred
    const alreadyReferred = referral.referredUsers.some(
      (u) => u.userId?.toString() === req.user._id.toString()
    );
    if (alreadyReferred) {
      return res.status(400).json({ error: "Already referred by this user" });
    }

    // Add referred user
    referral.referredUsers.push({
      userId: req.user._id,
      email: req.user.email,
      joinedAt: new Date(),
      bonusApplied: false,
    });

    referral.totalReferrals = referral.referredUsers.length;
    await referral.save();

    // Give bonus to referred user
    let wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      wallet = new Wallet({ userId: req.user._id, balance: REFERRAL_BONUS });
    } else {
      wallet.balance += REFERRAL_BONUS;
    }

    wallet.transactionHistory.push({
      type: "credit",
      amount: REFERRAL_BONUS,
      description: `Referral bonus from ${referral.referrerName}`,
      refNumber: referralCode,
    });

    await wallet.save();
    await User.findByIdAndUpdate(req.user._id, {
      walletBalance: wallet.balance,
    });

    // Give bonus to referrer too
    let referrerWallet = await Wallet.findOne({
      userId: referral.referrerId,
    });
    if (!referrerWallet) {
      referrerWallet = new Wallet({
        userId: referral.referrerId,
        balance: REFERRAL_BONUS,
      });
    } else {
      referrerWallet.balance += REFERRAL_BONUS;
    }

    referrerWallet.transactionHistory.push({
      type: "credit",
      amount: REFERRAL_BONUS,
      description: `Referral bonus from ${req.user.name}`,
    });

    referrerWallet.save();
    referral.totalBonusEarned += REFERRAL_BONUS;
    await referral.save();

    res.json({ message: "Referral applied successfully", wallet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get referral stats
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const referral = await Referral.findOne({ referrerId: req.user._id });
    if (!referral) {
      return res.status(404).json({ error: "No referral found" });
    }

    res.json({
      referralCode: referral.referralCode,
      totalReferrals: referral.totalReferrals,
      totalBonusEarned: referral.totalBonusEarned,
      referredUsers: referral.referredUsers,
      bonusPerReferral: REFERRAL_BONUS,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
