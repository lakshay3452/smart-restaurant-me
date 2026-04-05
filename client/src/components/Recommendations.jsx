import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Recommendations() {
  const [items, setItems] = useState([]);
  const [basedOn, setBasedOn] = useState("popular");
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user?.email) return;
    fetch(`/api/recommendations/${encodeURIComponent(user.email)}`)
      .then(r => r.json())
      .then(data => {
        setItems(data.recommendations || []);
        setBasedOn(data.basedOn || "popular");
      })
      .catch(() => {});
  }, []);

  if (!user?.email || items.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={20} className="text-amber-400" />
          <h2 className="text-xl sm:text-2xl font-serif text-white">
            {basedOn === "order_history" ? "Recommended For You" : "Popular Picks"}
          </h2>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {items.slice(0, 8).map((item, i) => (
            <motion.div
              key={item._id || i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="flex-shrink-0 w-40 sm:w-48 bg-white/[0.04] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-amber-500/20 transition cursor-pointer"
              onClick={() => navigate("/menu")}
            >
              <div className="h-28 sm:h-32 bg-gradient-to-br from-amber-900/20 to-gray-900 overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl opacity-30">🍽️</div>
                )}
              </div>
              <div className="p-3">
                <h3 className="text-white text-xs sm:text-sm font-medium truncate">{item.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-amber-400 font-bold text-sm">₹{item.price}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                    className="bg-amber-500 text-black text-[10px] font-bold px-3 py-1 rounded-lg hover:bg-amber-400 transition"
                  >
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
