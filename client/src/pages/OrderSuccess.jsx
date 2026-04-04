import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Home, Clock } from "lucide-react";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="bg-white/[0.04] border border-white/[0.06] backdrop-blur-xl p-8 sm:p-10 rounded-3xl text-center shadow-2xl max-w-md w-full text-white"
      >

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6 flex justify-center"
        >
          <CheckCircle size={72} className="text-green-400" />
        </motion.div>

        <h1 className="text-2xl sm:text-3xl font-serif mb-2">
          Order Placed!
        </h1>

        <p className="text-white/50 text-sm sm:text-base mb-8">
          Your food is being prepared with love. Sit back and relax!
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/orders")}
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
          >
            <Clock size={16} />
            Track Order
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-white/[0.06] border border-white/10 text-white font-medium py-3 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Home size={16} />
            Go Home
          </button>
        </div>

      </motion.div>

    </div>
  );
}
