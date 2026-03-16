const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
  category: { type: String, default: "Other" },
  available: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Menu", menuSchema);
