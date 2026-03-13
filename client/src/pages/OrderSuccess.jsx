import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl text-center shadow-2xl max-w-md w-full text-white"
      >

        <motion.div
          initial={{ rotate: -180 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl mb-6 text-green-400"
        >
          ✔
        </motion.div>

        <h1 className="text-3xl font-serif mb-3">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-300">
          Redirecting to Home...
        </p>

      </motion.div>

    </div>
  );
}
