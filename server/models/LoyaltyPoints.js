const mongoose = require("mongoose");

const loyaltyPointsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
  totalPoints: { type: Number, default: 0 },
  usedPoints: { type: Number, default: 0 },
  availablePoints: { type: Number, default: 0 },
  tier: { type: String, enum: ["Bronze", "Silver", "Gold", "Platinum"], default: "Bronze" },
  tier_progress: { type: Number, default: 0 },
  pointHistory: [
    {
      type: { type: String, enum: ["earned", "redeemed", "expired"] },
      points: Number,
      description: String,
      orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
      date: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("LoyaltyPoints", loyaltyPointsSchema);
