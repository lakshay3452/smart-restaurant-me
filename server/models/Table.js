const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true, unique: true },
  seats: { type: Number, default: 4 },
  qrCode: String, // base64 or URL
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Table", tableSchema);
