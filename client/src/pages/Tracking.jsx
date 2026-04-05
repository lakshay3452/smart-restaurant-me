import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, ChefHat, Truck, Package, Clock, XCircle } from "lucide-react";

const STEPS = [
  { label: "Order Confirmed", key: "Confirmed", icon: CheckCircle, desc: "Your order has been confirmed by the restaurant" },
  { label: "Preparing", key: "Preparing", icon: ChefHat, desc: "Chef is preparing your food" },
  { label: "Out for Delivery", key: "Out for Delivery", icon: Truck, desc: "Rider is on the way to you" },
  { label: "Delivered", key: "Delivered", icon: Package, desc: "Enjoy your meal!" },
];

function getStepIndex(status) {
  const idx = STEPS.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : -1;
}

function sendStatusNotification(status, orderId) {
  if (Notification.permission !== "granted") return;
  const messages = {
    Confirmed: "Your order has been confirmed! 🎉",
    Preparing: "Chef is now preparing your food 👨‍🍳",
    "Out for Delivery": "Your order is on the way! 🚀",
    Delivered: "Your order has been delivered. Enjoy! 🍽️",
    Rejected: "Sorry, your order was rejected ❌",
  };
  const body = messages[status] || `Order status: ${status}`;
  new Notification("LaCasa Order Update", {
    body,
    icon: "/icons/icon-192x192.png",
    tag: `order-${orderId}`,
  });
}

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const prevStatusRef = useRef(null);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const fetchOrder = async () => {
    if (!orderId) { setLoading(false); setError(true); return; }
    try {
      const res = await axios.get(`/api/orders/track/${orderId}`);
      const newOrder = res.data;

      // Send browser notification on status change
      if (prevStatusRef.current && prevStatusRef.current !== newOrder.status) {
        sendStatusNotification(newOrder.status, orderId);
      }
      prevStatusRef.current = newOrder.status;

      setOrder(newOrder);
      setError(false);
    } catch {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, [orderId]);

  const currentStep = order ? getStepIndex(order.status) : -1;
  const isRejected = order?.status === "Rejected";
  const isPending = order?.status === "Pending";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4 opacity-40">📦</div>
          <h2 className="text-white text-lg font-semibold mb-2">Order not found</h2>
          <p className="text-white/40 text-sm mb-6">Please check your order ID or go to your orders</p>
          <button
            onClick={() => navigate("/orders")}
            className="px-6 py-2.5 bg-amber-500 text-black rounded-xl text-sm font-semibold hover:bg-amber-400 transition"
          >
            My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">

      {/* HEADER */}
      <div className="px-4 sm:px-6 py-6 border-b border-white/[0.06]">
        <h1 className="text-2xl sm:text-3xl font-serif">
          Live <span className="text-amber-400">Order Tracking</span>
        </h1>
        <p className="text-white/40 text-xs sm:text-sm mt-1">
          Order #{orderId?.slice(-8)} • Real-time updates
        </p>
      </div>

      {/* MAP SECTION */}
      <div className="h-[200px] sm:h-[300px] md:h-[350px] w-full">
        <iframe
          title="map"
          width="100%"
          height="100%"
          className="grayscale opacity-70"
          src="https://maps.google.com/maps?q=delhi&t=&z=13&ie=UTF8&iwloc=&output=embed"
        />
      </div>

      {/* TRACKING STATUS */}
      <div className="px-4 sm:px-6 py-8 sm:py-10">
        <div className="max-w-2xl mx-auto">

          {/* Rejected State */}
          {isRejected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <XCircle size={64} className="text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-400 mb-2">Order Rejected</h2>
              <p className="text-white/40 text-sm">Sorry, your order has been rejected by the restaurant.</p>
              <button
                onClick={() => navigate("/menu")}
                className="mt-6 px-6 py-2.5 bg-amber-500 text-black rounded-xl text-sm font-semibold hover:bg-amber-400 transition"
              >
                Order Again
              </button>
            </motion.div>
          )}

          {/* Pending State */}
          {isPending && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <Clock size={64} className="text-yellow-400 mx-auto mb-4 animate-pulse" />
              <h2 className="text-xl font-semibold text-yellow-400 mb-2">Waiting for Confirmation</h2>
              <p className="text-white/40 text-sm">Your order is being reviewed by the restaurant. Please wait...</p>
              <div className="mt-4 flex items-center justify-center gap-2 text-white/20 text-xs">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping" />
                Auto-refreshing every 5 seconds
              </div>
            </motion.div>
          )}

          {/* Active Tracking Steps */}
          {!isRejected && !isPending && (
            <>
              {STEPS.map((step, index) => {
                const isActive = currentStep >= index;
                const isCurrent = currentStep === index;
                const StepIcon = step.icon;

                return (
                  <div key={index} className="flex gap-4 sm:gap-6">
                    {/* Left: Icon + Line */}
                    <div className="flex flex-col items-center">
                      <motion.div
                        animate={{
                          scale: isCurrent ? 1.15 : 1,
                          backgroundColor: isActive ? "#f59e0b" : "rgba(255,255,255,0.06)",
                        }}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 border-2"
                        style={{ borderColor: isActive ? "#f59e0b" : "rgba(255,255,255,0.1)" }}
                      >
                        <StepIcon size={18} className={isActive ? "text-black" : "text-white/30"} />
                      </motion.div>
                      {index < STEPS.length - 1 && (
                        <div className={`w-0.5 h-12 sm:h-14 my-1 transition-colors duration-500 ${
                          currentStep > index ? "bg-amber-500" : "bg-white/[0.06]"
                        }`} />
                      )}
                    </div>

                    {/* Right: Text */}
                    <div className="pt-2 sm:pt-2.5 pb-6">
                      <p className={`font-semibold text-sm sm:text-base ${
                        isActive ? "text-white" : "text-white/30"
                      }`}>
                        {step.label}
                        {isCurrent && (
                          <span className="ml-2 inline-block w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping" />
                        )}
                      </p>
                      <p className={`text-xs sm:text-sm mt-0.5 ${
                        isActive ? "text-white/50" : "text-white/20"
                      }`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </>
          )}

        </div>
      </div>

    </div>
  );
}
