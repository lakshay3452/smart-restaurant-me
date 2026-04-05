import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Clock } from "lucide-react";

export default function FlashDealBanner() {
  const [deals, setDeals] = useState([]);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    fetch("/api/flash-deals/active")
      .then(r => r.json())
      .then(data => setDeals(data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (deals.length === 0) return;
    const timer = setInterval(() => {
      const now = new Date();
      const endParts = deals[0].endTime.split(":");
      const end = new Date();
      end.setHours(parseInt(endParts[0]), parseInt(endParts[1]), 0);
      const diff = end - now;
      if (diff <= 0) { setTimeLeft("Ended"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, [deals]);

  if (deals.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-600/90 to-red-600/90 backdrop-blur-sm py-2.5 px-4"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 flex-wrap text-center">
          <Zap size={16} className="text-yellow-300 animate-pulse" />
          <span className="text-white font-semibold text-sm">
            {deals[0].title} — {deals[0].discountPercent}% OFF
          </span>
          {deals[0].description && (
            <span className="text-white/80 text-xs hidden sm:inline">
              {deals[0].description}
            </span>
          )}
          <span className="flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded text-[11px] text-yellow-300 font-mono">
            <Clock size={11} />
            {timeLeft}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
