import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { Minus, Plus, X } from "lucide-react";
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

  return (
    <>
      {/* Cart Toggle Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-[9997] bg-amber-500 text-black p-3 rounded-full shadow-lg hover:scale-110 transition"
      >
        <span className="text-xl">&#128722;</span>
        {cartItems.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {cartItems.reduce((a, b) => a + b.quantity, 0)}
          </span>
        )}
      </button>

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
              className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 p-6 shadow-2xl overflow-y-auto z-[9999]"
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-black dark:text-white">Your Cart</h2>
                <button onClick={() => setOpen(false)}>
                  <X className="text-black dark:text-white" />
                </button>
              </div>

              {cartItems.length === 0 && (
                <div className="text-center text-gray-400 mt-20">
                  Your cart is empty
                </div>
              )}

              {cartItems.map(item => (
                <div key={item.id} className="mb-6 border-b pb-4">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-black dark:text-white">{item.name}</h3>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3 bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-full">
                      <button onClick={() => decreaseQty(item.id)}>
                        <Minus size={16} className="text-black dark:text-white" />
                      </button>
                      <span className="text-black dark:text-white">{item.quantity}</span>
                      <button onClick={() => increaseQty(item.id)}>
                        <Plus size={16} className="text-black dark:text-white" />
                      </button>
                    </div>
                    <span className="font-semibold text-black dark:text-white">
                      &#8377;{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}

              {cartItems.length > 0 && (
                <>
                  <div className="mt-6 font-bold text-lg text-black dark:text-white">
                    Total: &#8377;{totalPrice}
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
    </>
  );
}
