import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String
});

export default mongoose.model("Menu", menuSchema);
