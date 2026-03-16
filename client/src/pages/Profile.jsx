import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <p className="text-gray-400 mb-4">You are not logged in</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-amber-500 text-black px-6 py-2 rounded-xl font-semibold"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-8 max-w-5xl mx-auto px-6">

      <h1 className="text-4xl font-serif mb-10">
        My Profile
      </h1>

      {/* User Info */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {user.name}
          </h2>
          <p className="text-gray-400">
            {user.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded-lg font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Order History */}
      <h2 className="text-2xl font-serif mb-6">
        Order History
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-400">No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <motion.div
              key={order.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-xl rounded-xl p-6 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{order.id}</p>
                <p className="text-gray-400 text-sm">{order.date}</p>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  &#8377;{order.total}
                </p>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  order.status === "Delivered"
                    ? "bg-green-500"
                    : "bg-yellow-500"
                }`}>
                  {order.status}
                </span>
              </div>

            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}
