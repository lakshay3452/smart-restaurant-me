import { useCart } from "../context/CartContext";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQty,
    decreaseQty,
    totalPrice,
  } = useCart();

  const navigate = useNavigate();
  const itemCount = cartItems.reduce((a, b) => a + b.quantity, 0);

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif text-white">
              Your <span className="text-amber-400">Cart</span>
            </h1>
            <p className="text-white/40 text-xs sm:text-sm mt-1">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>
          {cartItems.length > 0 && (
            <span className="bg-amber-500/10 text-amber-400 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full border border-amber-500/20">
              ₹{totalPrice}
            </span>
          )}
        </div>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4 opacity-40">🛒</div>
            <h3 className="text-white/60 text-lg font-medium">Your cart is empty</h3>
            <p className="text-white/30 text-sm mt-1">Browse our menu to add delicious items</p>
            <button
              onClick={() => navigate("/menu")}
              className="mt-6 px-6 py-2.5 bg-amber-500 text-black rounded-xl text-sm font-semibold hover:bg-amber-400 transition active:scale-95"
            >
              Explore Menu
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Left — Cart Items */}
            <div className="flex-1 space-y-3 sm:space-y-4">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item._id || item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-3 sm:gap-4 bg-white/[0.04] rounded-2xl p-3 sm:p-4 border border-white/[0.06] hover:border-white/10 transition"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gradient-to-br from-amber-900/20 to-gray-800 shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                            {item.name}
                          </h3>
                          <p className="text-white/30 text-xs sm:text-sm mt-0.5">
                            ₹{item.price} each
                          </p>
                          {item.extras && item.extras.length > 0 && (
                            <p className="text-amber-400/60 text-[10px] sm:text-xs mt-0.5">
                              + {item.extras.join(", ")}
                            </p>
                          )}
                          {item.spiceLevel && (
                            <p className="text-white/20 text-[10px] mt-0.5">🌶️ {item.spiceLevel}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item._id || item.id)}
                          className="text-white/30 hover:text-red-400 transition shrink-0 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2 sm:mt-3">
                        {/* Qty */}
                        <div className="flex items-center bg-white/[0.06] rounded-lg border border-white/[0.06]">
                          <button
                            onClick={() => decreaseQty(item._id || item.id)}
                            className="p-1.5 sm:p-2 hover:bg-white/10 rounded-l-lg transition"
                          >
                            <Minus size={14} className="text-white/60" />
                          </button>
                          <span className="text-white text-sm font-bold min-w-[28px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQty(item._id || item.id)}
                            className="p-1.5 sm:p-2 hover:bg-white/10 rounded-r-lg transition"
                          >
                            <Plus size={14} className="text-white/60" />
                          </button>
                        </div>

                        <span className="font-bold text-amber-400 text-sm sm:text-base">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Right — Bill Summary */}
            <div className="lg:w-80 shrink-0">
              <div className="bg-white/[0.04] rounded-2xl p-5 sm:p-6 border border-white/[0.06] sticky top-24">
                <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">Bill Summary</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-white/40">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-white/40">
                    <span>Delivery Fee</span>
                    <span className="text-green-400 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between text-white/40">
                    <span>Taxes</span>
                    <span>₹{Math.round(totalPrice * 0.05)}</span>
                  </div>

                  <div className="border-t border-white/[0.06] pt-3 flex justify-between text-white font-bold text-base sm:text-lg">
                    <span>Total</span>
                    <span className="text-amber-400">₹{totalPrice + Math.round(totalPrice * 0.05)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full mt-5 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 sm:py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
