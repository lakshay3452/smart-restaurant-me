const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    address: String,
    items: [
      {
        name: String,
        price: Number,
        quantity: Number,
        image: String,
        extras: [String],
        spiceLevel: String,
      },
    ],
    totalAmount: Number,
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
