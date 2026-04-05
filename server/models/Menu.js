const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
  category: { type: String, default: "Other" },
  available: { type: Boolean, default: true },
  isVeg: { type: Boolean, default: true },
  rating: { type: Number, default: 4.0 },
  bestseller: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Menu", menuSchema);
