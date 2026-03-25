const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
  balance: { type: Number, default: 0 },
  transactionHistory: [
    {
      type: { type: String, enum: ["credit", "debit"] },
      amount: Number,
      description: String,
      orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
      refNumber: String,
      date: { type: Date, default: Date.now }
    }
  ],
  totalCredit: { type: Number, default: 0 },
  totalDebit: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Wallet", walletSchema);
