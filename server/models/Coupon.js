const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discount: { type: Number, required: true },
  type: { type: String, enum: ["percent", "flat"], default: "percent" },
  minOrder: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: 0 },
  description: String,
  active: { type: Boolean, default: true },
  usageLimit: { type: Number, default: 0 }, // 0 = unlimited
  usedCount: { type: Number, default: 0 },
  expiresAt: Date,
}, { timestamps: true });

module.exports = mongoose.model("Coupon", couponSchema);
