import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { Minus, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function CartDrawer() {
  const {
    cart,
    total,
    open,
    setOpen,
    increaseQty,
    decreaseQty,
    removeFromCart
  } = useCart();

  // Scroll lock when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-charcoal p-6 shadow-2xl overflow-y-auto z-[9999]"
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif">Your Cart</h2>
              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            {cart.length === 0 && (
              <div className="text-center text-gray-400 mt-20">
                Your cart is empty 🛒
              </div>
            )}

            {cart.map(item => (
              <div key={item.id} className="mb-6 border-b pb-4">

                <div className="flex justify-between">
                  <h3 className="font-medium">{item.name}</h3>
                  <button onClick={() => removeFromCart(item.id)}>
                    ✕
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">

                  <div className="flex items-center gap-3 bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-full">

                    <button onClick={() => decreaseQty(item.id)}>
                      <Minus size={16} />
                    </button>

                    <span>{item.qty}</span>

                    <button onClick={() => increaseQty(item.id)}>
                      <Plus size={16} />
                    </button>

                  </div>

                  <span className="font-semibold">
                    ₹{item.price * item.qty}
                  </span>

                </div>

              </div>
            ))}

            {cart.length > 0 && (
              <>
                <div className="mt-6 font-bold text-lg">
                  Total: ₹{total}
                </div>

                <Link to="/checkout" onClick={() => setOpen(false)}>
                  <button className="mt-4 w-full bg-amber-400 text-black py-3 rounded-xl hover:scale-105 transition">
                    Proceed to Checkout
                  </button>
                </Link>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
