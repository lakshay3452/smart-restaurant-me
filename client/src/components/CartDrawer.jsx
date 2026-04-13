import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function CartDrawer() {
  const {
    cartItems,
    totalPrice,
    increaseQty,
    decreaseQty,
    removeFromCart
  } = useCart();

  const [open, setOpen] = useState(false);
  const itemCount = cartItems.reduce((a, b) => a + b.quantity, 0);

  return (
    <>
      {/* ── Floating Cart Button ── */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-20 z-[9997] bg-amber-500 text-black p-3.5 rounded-full shadow-xl shadow-amber-500/30 hover:scale-110 hover:bg-amber-400 transition-all active:scale-95"
      >
        <ShoppingBag size={22} />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
            {itemCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* ── Overlay ── */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* ── Drawer ── */}
            <motion.div
              className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-[#111115] shadow-2xl z-[9999] flex flex-col border-l border-white/[0.06]"
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-5 border-b border-white/[0.06]">
                <div>
                  <h2 className="text-xl font-bold text-white">Your Cart</h2>
                  <p className="text-white/40 text-xs mt-0.5">
                    {itemCount} item{itemCount !== 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition"
                >
                  <X size={20} className="text-white/60" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 menu-scrollbar-hide">
                {cartItems.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-5xl mb-4 opacity-40">🛒</div>
                    <p className="text-white/40 text-sm">Your cart is empty</p>
                    <p className="text-white/25 text-xs mt-1">Add items from the menu</p>
                  </div>
                )}

                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id || item._id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 bg-white/[0.04] rounded-xl p-3 border border-white/[0.06]"
                    >
                      {/* Item Thumbnail */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-amber-900/20 to-gray-800 shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => (e.target.style.display = "none")}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl opacity-40">
                            🍽️
                          </div>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <h3 className="font-medium text-white text-sm truncate">
                              {item.name}
                            </h3>
                            {item.extras && item.extras.length > 0 && (
                              <p className="text-amber-400/50 text-[10px] truncate">+ {item.extras.join(", ")}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id || item._id)}
                            className="text-white/30 hover:text-red-400 transition shrink-0"
                          >
                            <X size={14} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-2.5">
                          {/* Qty Controls */}
                          <div className="flex items-center gap-0.5 bg-white/[0.06] rounded-lg border border-white/[0.06]">
                            <button
                              onClick={() => decreaseQty(item.id || item._id)}
                              className="p-1.5 hover:bg-white/10 rounded-l-lg transition"
                            >
                              <Minus size={12} className="text-white/60" />
                            </button>
                            <span className="text-white text-xs font-bold min-w-[24px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => increaseQty(item.id || item._id)}
                              className="p-1.5 hover:bg-white/10 rounded-r-lg transition"
                            >
                              <Plus size={12} className="text-white/60" />
                            </button>
                          </div>

                          {/* Price */}
                          <span className="font-semibold text-amber-400 text-sm">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Footer — Bill & Checkout */}
              {cartItems.length > 0 && (
                <div className="border-t border-white/[0.06] p-5 space-y-3 bg-[#111115]">
                  {/* Bill Summary */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-white/40">
                      <span>Subtotal</span>
                      <span>₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-white/40">
                      <span>Delivery Fee</span>
                      <span className="text-green-400">FREE</span>
                    </div>
                    <div className="border-t border-white/[0.06] pt-2 flex justify-between text-white font-bold text-base">
                      <span>Total</span>
                      <span className="text-amber-400">₹{totalPrice}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Link to="/checkout" onClick={() => setOpen(false)}>
                    <button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3.5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 mt-2">
                      Proceed to Checkout
                      <ArrowRight size={18} />
                    </button>
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
