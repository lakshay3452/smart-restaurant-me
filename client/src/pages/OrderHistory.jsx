import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedOrders =
      JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-12 py-12">

      <h1 className="text-3xl md:text-4xl font-serif mb-10">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-400">
          No orders yet.
        </p>
      ) : (
        <div className="space-y-6">

          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-lg"
            >

              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-400">
                    {order.date}
                  </p>
                  <h2 className="font-semibold text-lg">
                    {order.id}
                  </h2>
                </div>

                <span className="text-amber-400">
                  {order.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between border-t border-white/20 pt-4">
                <span>Total</span>
                <span className="font-bold text-amber-400">
                  ₹{order.total}
                </span>
              </div>

              <button
                onClick={() => navigate("/track")}
                className="mt-4 bg-amber-500 text-black px-4 py-2 rounded-lg text-sm"
              >
                Track Order
              </button>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
