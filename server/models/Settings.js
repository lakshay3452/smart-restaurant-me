const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  restaurantName: { type: String, default: "Smart Restaurant" },
  address: { type: String, default: "" },
  phone: { type: String, default: "" },
  email: { type: String, default: "" },
  openingTime: { type: String, default: "10:00 AM" },
  closingTime: { type: String, default: "11:00 PM" },
  taxPercent: { type: Number, default: 5 }
}, { timestamps: true });

module.exports = mongoose.model("Settings", settingsSchema);
