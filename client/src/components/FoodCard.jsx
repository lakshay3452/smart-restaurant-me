import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { Star } from "lucide-react";

export default function FoodCard({ item, onQuickView }) {

  const { addToCart } = useCart();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg"
    >

      <div className="relative">
        <img src={item.image} className="w-full h-56 object-cover" />

        {/* Veg Badge */}
        <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs ${
          item.category === "Veg"
            ? "bg-green-500"
            : "bg-red-500"
        }`}>
          {item.category}
        </span>
      </div>

      <div className="p-4">

        <h2 className="font-serif text-xl">{item.name}</h2>

        <div className="flex items-center gap-1 text-yellow-400 my-2">
          <Star size={16} fill="currentColor" />
          {item.rating}
        </div>

        <p className="font-semibold text-amberAccent">
          ₹{item.price}
        </p>

        <div className="flex gap-3 mt-4">

          <button
            onClick={() => addToCart(item)}
            className="flex-1 bg-emeraldAccent py-2 rounded-xl"
          >
            Add
          </button>

          <button
            onClick={onQuickView}
            className="flex-1 bg-white/10 py-2 rounded-xl"
          >
            View
          </button>

        </div>

      </div>

    </motion.div>
  );
}
