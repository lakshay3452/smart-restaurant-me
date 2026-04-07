import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Package, ArrowRight, RotateCcw, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import InvoiceDownload from "../components/InvoiceDownload";
import FeedbackPopup from "../components/FeedbackPopup";

const STATUS_COLORS = {
  Pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Preparing: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Out for Delivery": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Delivered: "bg-green-500/10 text-green-400 border-green-500/20",
  Rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackOrder, setFeedbackOrder] = useState(null);
  const [feedbackDone, setFeedbackDone] = useState({});
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchOrders = async () => {
    if (!user?.email) return;
    try {
      const res = await axios.get(`/api/orders/my-orders/${encodeURIComponent(user.email)}`);
      setOrders(res.data || []);
    } catch {
      setOrders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user?.email) {
      navigate("/login", { replace: true });
      return;
    }
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-2xl sm:text-3xl font-serif text-white mb-6 sm:mb-8">
          My <span className="text-amber-400">Orders</span>
        </h1>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-5xl mb-4 opacity-30">📦</div>
            <p className="text-white/40 text-sm">No orders yet</p>
            <button
              onClick={() => navigate("/menu")}
              className="mt-5 px-6 py-2.5 bg-amber-500 text-black rounded-xl text-sm font-semibold hover:bg-amber-400 transition active:scale-95"
            >
              Browse Menu
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">

            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.04] border border-white/[0.06] p-4 sm:p-5 rounded-2xl hover:border-white/10 transition"
              >

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <p className="text-xs text-white/30">
                      {order.date}
                    </p>
                    <h2 className="font-semibold text-white text-sm sm:text-base">
                      {order.id}
                    </h2>
                  </div>

                  <span className={`self-start sm:self-auto text-xs px-3 py-1 rounded-full font-medium border ${STATUS_COLORS[order.status] || STATUS_COLORS["Pending"]}`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-1.5 mb-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id || item._id}
                      className="flex justify-between text-xs sm:text-sm text-white/50"
                    >
                      <span className="truncate mr-3">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="shrink-0">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-sm">Total</span>
                    <span className="font-bold text-amber-400 text-sm sm:text-base">
                      ₹{order.total}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {/* Repeat Order */}
                    <button
                      onClick={() => {
                        order.items.forEach(item => addToCart({ ...item, _id: item.id || item._id }));
                        navigate("/cart");
                      }}
                      className="flex items-center gap-1.5 text-xs font-medium bg-white/[0.06] text-white/60 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white transition"
                    >
                      <RotateCcw size={12} />
                      Reorder
                    </button>

                    {/* Invoice */}
                    <InvoiceDownload order={order} />

                    {/* Feedback - only for delivered orders */}
                    {order.status === "Delivered" && !feedbackDone[order._id || order.id] && (
                      <button
                        onClick={() => setFeedbackOrder(order)}
                        className="flex items-center gap-1.5 text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1.5 rounded-lg hover:bg-green-500/20 transition"
                      >
                        <Star size={12} />
                        Rate
                      </button>
                    )}

                    {/* Track */}
                    <button
                      onClick={() => navigate(`/tracking?orderId=${order._id || order.id}`)}
                      className="flex items-center gap-1.5 text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-lg hover:bg-amber-500/20 transition"
                    >
                      Track
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>

              </motion.div>
            ))}

          </div>
        )}

        {/* Feedback Popup */}
        {feedbackOrder && (
          <FeedbackPopup
            order={feedbackOrder}
            onClose={() => {
              setFeedbackDone(prev => ({ ...prev, [feedbackOrder._id || feedbackOrder.id]: true }));
              setFeedbackOrder(null);
            }}
          />
        )}

      </div>
    </div>
  );
}
