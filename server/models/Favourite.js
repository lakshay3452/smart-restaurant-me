const mongoose = require("mongoose");

const favouriteSchema = new mongoose.Schema({
  email: { type: String, required: true },
  menuItemId: { type: String, required: true },
  name: String,
  price: Number,
  image: String,
  category: String,
  isVeg: Boolean,
  rating: Number,
}, { timestamps: true });

favouriteSchema.index({ email: 1, menuItemId: 1 }, { unique: true });

module.exports = mongoose.model("Favourite", favouriteSchema);
