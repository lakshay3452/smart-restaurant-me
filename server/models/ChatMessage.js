const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  conversationId: { type: String, required: true },
  sender: { type: String, enum: ["user", "admin"], required: true },
  senderEmail: String,
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

chatMessageSchema.index({ conversationId: 1, createdAt: 1 });

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
