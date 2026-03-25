const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: String,
  rating: { type: Number, min: 1, max: 5, required: true },
  title: String,
  comment: String,
  images: [String],
  helpful: { type: Number, default: 0 },
  verified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
