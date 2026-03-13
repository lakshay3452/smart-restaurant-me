const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    totalAmount: Number,
    status: {
      type: String,
      default: "Preparing",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
