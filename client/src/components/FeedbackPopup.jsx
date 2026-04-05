import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Send } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function FeedbackPopup({ order, onClose }) {
  const [rating, setRating] = useState(0);
  const [foodRating, setFoodRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [hoverFood, setHoverFood] = useState(0);
  const [hoverDelivery, setHoverDelivery] = useState(0);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleSubmit = async () => {
    if (!rating) { toast.error("Please give an overall rating"); return; }
    setLoading(true);
    try {
      await axios.post("/api/feedback", {
        orderId: order._id || order.id,
        email: user?.email || "",
        rating,
        foodRating,
        deliveryRating,
        comment,
      });
      toast.success("Thank you for your feedback! 🙏");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit");
    }
    setLoading(false);
  };

  const StarRow = ({ value, setValue, hover, setHover, label }) => (
    <div>
      <p className="text-white/50 text-xs mb-1.5">{label}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(i => (
          <button
            key={i}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setValue(i)}
            className="transition-transform hover:scale-110"
          >
            <Star size={22} className={i <= (hover || value) ? "text-amber-400 fill-amber-400" : "text-white/20"} />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md p-6"
        >
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-white font-serif text-lg">Rate Your Order</h2>
            <button onClick={onClose} className="text-white/40 hover:text-white transition">
              <X size={20} />
            </button>
          </div>

          <p className="text-white/40 text-xs mb-5">Order #{(order._id || order.id)?.slice(-6)}</p>

          <div className="space-y-4">
            <StarRow value={rating} setValue={setRating} hover={hoverRating} setHover={setHoverRating} label="Overall Experience" />
            <StarRow value={foodRating} setValue={setFoodRating} hover={hoverFood} setHover={setHoverFood} label="Food Quality" />
            <StarRow value={deliveryRating} setValue={setDeliveryRating} hover={hoverDelivery} setHover={setHoverDelivery} label="Delivery Experience" />

            <div>
              <p className="text-white/50 text-xs mb-1.5">Comments (optional)</p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about your experience..."
                className="w-full px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-500/50 resize-none h-20"
                maxLength={500}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-5 w-full bg-amber-500 text-black py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-amber-400 transition disabled:opacity-50"
          >
            <Send size={16} />
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
