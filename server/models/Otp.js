const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  purpose: { type: String, required: true }, // "register" or "login"
  name: String,
  password: String,
  expiresAt: { type: Date, required: true }
});

// Auto-delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Otp", otpSchema);
