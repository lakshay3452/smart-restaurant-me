import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {

  const [orders, setOrders] = useState([]);
  const lastCount = useRef(0);
  const navigate = useNavigate();

  const fetchOrders = async () => {

    try {

      const res = await axios.get("http://localhost:5000/api/orders/json");

      const data = res.data.orders || res.data;

      // 🔔 Notification only if new order added
      if (lastCount.current !== 0 && data.length > lastCount.current) {
        alert("🔔 New Order Received!");
      }

      lastCount.current = data.length;
      setOrders(data);

    } catch (error) {
      console.log("Fetch Orders Error:", error);
    }

  };

  useEffect(() => {

    fetchOrders();

    const interval = setInterval(fetchOrders, 3000);

    return () => clearInterval(interval);

  }, []);

  const updateStatus = async (id, status) => {

    try {

      await axios.put(`http://localhost:5000/api/orders/${id}`, {
        status
      });

      fetchOrders();

    } catch (error) {
      console.log("Status Update Error:", error);
    }

  };

  const getStatusColor = (status) => {

    if (status === "Pending") return "text-yellow-400";
    if (status === "Accepted") return "text-green-400";
    if (status === "Rejected") return "text-red-400";

    return "text-white";
  };

  return (

    <div className="min-h-screen bg-black text-white pt-6 px-6">

      {/* Admin Nav */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif">
          Admin Dashboard
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin-menu")}
            className="bg-amber-500 text-black px-4 py-2 rounded-lg font-semibold"
          >
            Manage Menu
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("adminAuth");
              navigate("/admin-login");
            }}
            className="bg-red-600 px-4 py-2 rounded-lg font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      {Array.isArray(orders) && orders.length === 0 && (
        <p>No Orders Yet</p>
      )}

      <div className="space-y-6">

        {Array.isArray(orders) && orders.map(order => (

          <div
            key={order._id || order.id}
            className="bg-gray-900 p-6 rounded-xl border border-gray-800"
          >

            <h2 className="text-xl font-semibold mb-2">
              Order #{order._id || order.id}
            </h2>

            <p>Name: {order.name}</p>
            <p>Phone: {order.phone}</p>
            <p>Address: {order.address}</p>

            <div className="mt-4">

              <p className="font-semibold mb-1">Items:</p>

              {order.items?.map((item, i) => (
                <p key={i}>
                  {item.name} x {item.quantity}
                </p>
              ))}

            </div>

            <p className="mt-4 text-amber-400 font-semibold">
              Total ₹{order.totalAmount || order.total}
            </p>

            <p className={`mt-2 font-semibold ${getStatusColor(order.status)}`}>
              Status: {order.status}
            </p>

            <div className="flex gap-3 mt-4">

              <button
                onClick={() => updateStatus(order._id || order.id, "Accepted")}
                className="bg-green-600 px-4 py-2 rounded-lg"
              >
                Accept
              </button>

              <button
                onClick={() => updateStatus(order._id || order.id, "Rejected")}
                className="bg-red-600 px-4 py-2 rounded-lg"
              >
                Reject
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}