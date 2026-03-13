import { motion } from "framer-motion";

const orders = [
  {
    id: "#ORD123",
    total: 1299,
    status: "Delivered",
    date: "12 Feb 2026"
  },
  {
    id: "#ORD124",
    total: 899,
    status: "Preparing",
    date: "14 Feb 2026"
  }
];

export default function Profile() {
  return (
    <div className="pt-28 max-w-5xl mx-auto px-6">

      <h1 className="text-4xl font-serif mb-10">
        My Profile
      </h1>

      {/* User Info */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-10">
        <h2 className="text-xl font-semibold mb-2">
          Lakshay Gupta
        </h2>
        <p className="text-gray-400">
          lakshay@email.com
        </p>
      </div>

      {/* Order History */}
      <h2 className="text-2xl font-serif mb-6">
        Order History
      </h2>

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
                ₹{order.total}
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

    </div>
  );
}
