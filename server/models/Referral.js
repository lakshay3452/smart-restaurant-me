const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema({
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  referrerName: String,
  referrerEmail: String,
  referralCode: { type: String, unique: true, required: true },
  referredUsers: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      email: String,
      joinedAt: Date,
      bonusApplied: { type: Boolean, default: false }
    }
  ],
  bonusAmount: { type: Number, default: 100 },
  totalBonusEarned: { type: Number, default: 0 },
  totalReferrals: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Referral", referralSchema);
