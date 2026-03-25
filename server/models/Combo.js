const mongoose = require("mongoose");

const comboSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
  originalPrice: Number,
  comboPrice: { type: Number, required: true },
  discount: Number,
  items: [
    {
      menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
      quantity: Number
    }
  ],
  category: String,
  available: { type: Boolean, default: true },
  validFrom: Date,
  validUntil: Date
}, { timestamps: true });

module.exports = mongoose.model("Combo", comboSchema);
