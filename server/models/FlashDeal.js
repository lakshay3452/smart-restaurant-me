const mongoose = require("mongoose");

const flashDealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  discountPercent: { type: Number, required: true },
  menuItems: [{ type: String }], // menu item IDs or "all"
  startTime: { type: String, required: true }, // "HH:mm" format
  endTime: { type: String, required: true },
  daysOfWeek: [{ type: Number }], // 0=Sun, 1=Mon... 6=Sat. Empty = every day
  active: { type: Boolean, default: true },
  banner: String, // optional banner image URL
}, { timestamps: true });

module.exports = mongoose.model("FlashDeal", flashDealSchema);
