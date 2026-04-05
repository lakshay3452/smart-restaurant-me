const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  deliveryRating: { type: Number, min: 1, max: 5 },
  foodRating: { type: Number, min: 1, max: 5 },
}, { timestamps: true });

module.exports = mongoose.model("Feedback", feedbackSchema);
