import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {

  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [activeTab, setActiveTab] = useState("orders");
  const lastOrderCount = useRef(0);
  const lastReservationCount = useRef(0);
  const navigate = useNavigate();

  const fetchOrders = async () => {

    try {

      const res = await axios.get("/api/orders/json");

      const data = res.data.orders || res.data;

      // 🔔 Notification only if new order added
      if (lastOrderCount.current !== 0 && data.length > lastOrderCount.current) {
        alert("🔔 New Order Received!");
      }

      lastOrderCount.current = data.length;
      setOrders(data);

    } catch (error) {
      console.log("Fetch Orders Error:", error);
    }

  };

  const fetchReservations = async () => {

    try {

      const res = await axios.get("/api/reservations");

      const data = Array.isArray(res.data) ? res.data : res.data.reservations || [];

      // 🔔 Notification only if new reservation added
      if (lastReservationCount.current !== 0 && data.length > lastReservationCount.current) {
        alert("🔔 New Table Reservation Received!");
      }

      lastReservationCount.current = data.length;
      setReservations(data);

    } catch (error) {
      console.log("Fetch Reservations Error:", error);
    }

  };

  useEffect(() => {

    fetchOrders();
    fetchReservations();

    const interval = setInterval(() => {
      fetchOrders();
      fetchReservations();
    }, 3000);

    return () => clearInterval(interval);

  }, []);

  const updateOrderStatus = async (id, status) => {

    try {

      await axios.put(`/api/orders/${id}`, {
        status
      });

      fetchOrders();

    } catch (error) {
      console.log("Status Update Error:", error);
    }

  };

  const updateReservationStatus = async (id, status) => {

    try {

      await axios.put(`/api/reservations/${id}`, {
        status
      });

      fetchReservations();

    } catch (error) {
      console.log("Reservation Status Update Error:", error);
    }

  };

  const deleteReservation = async (id) => {

    if (!window.confirm("Are you sure you want to delete this reservation?")) return;

    try {

      await axios.delete(`/api/reservations/${id}`);

      fetchReservations();

    } catch (error) {
      console.log("Delete Reservation Error:", error);
    }

  };

  const deleteOrder = async (id) => {

    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {

      await axios.delete(`/api/orders/${id}`);

      fetchOrders();

    } catch (error) {
      console.log("Delete Order Error:", error);
    }

  };

  const getStatusColor = (status) => {
    if (status === "Pending") return "text-yellow-400";
    if (status === "Confirmed") return "text-blue-400";
    if (status === "Preparing") return "text-orange-400";
    if (status === "Out for Delivery") return "text-purple-400";
    if (status === "Delivered") return "text-green-400";
    if (status === "Rejected") return "text-red-400";
    return "text-white";
  };

  const ORDER_FLOW = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered"];

  const getNextStatus = (current) => {
    const idx = ORDER_FLOW.indexOf(current);
    if (idx >= 0 && idx < ORDER_FLOW.length - 1) return ORDER_FLOW[idx + 1];
    return null;
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

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 border-b border-gray-700 pb-4">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-6 py-2 font-semibold rounded-lg transition ${
            activeTab === "orders"
              ? "bg-amber-500 text-black"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          📦 Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("reservations")}
          className={`px-6 py-2 font-semibold rounded-lg transition ${
            activeTab === "reservations"
              ? "bg-amber-500 text-black"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          🪑 Table Reservations ({reservations.length})
        </button>
      </div>

      {/* ============ ORDERS TAB ============ */}
      {activeTab === "orders" && (
        <>
          {Array.isArray(orders) && orders.length === 0 && (
            <p className="text-gray-400">No Orders Yet</p>
          )}

          <div className="space-y-6">

            {Array.isArray(orders) && orders.map(order => (

              <div
                key={order._id || order.id}
                className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-amber-500 transition"
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

                <div className="flex flex-wrap gap-2 mt-4">

                  {/* Next Status Button */}
                  {getNextStatus(order.status) && (
                    <button
                      onClick={() => updateOrderStatus(order._id || order.id, getNextStatus(order.status))}
                      className="bg-amber-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-amber-400 transition"
                    >
                      → {getNextStatus(order.status)}
                    </button>
                  )}

                  {/* All Status Dropdown */}
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id || order.id, e.target.value)}
                    className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 cursor-pointer"
                  >
                    {ORDER_FLOW.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                    <option value="Rejected">Rejected</option>
                  </select>

                  {/* Reject (only if not already rejected/delivered) */}
                  {order.status !== "Rejected" && order.status !== "Delivered" && (
                    <button
                      onClick={() => updateOrderStatus(order._id || order.id, "Rejected")}
                      className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
                  )}

                  <button
                    onClick={() => deleteOrder(order._id || order.id)}
                    className="bg-red-900 px-4 py-2 rounded-lg hover:bg-red-800 transition text-red-300"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>
        </>
      )}

      {/* ============ RESERVATIONS TAB ============ */}
      {activeTab === "reservations" && (
        <>
          {Array.isArray(reservations) && reservations.length === 0 && (
            <p className="text-gray-400">No Table Reservations Yet</p>
          )}

          <div className="space-y-6">

            {Array.isArray(reservations) && reservations.map(reservation => (

              <div
                key={reservation._id}
                className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-amber-500 transition"
              >

                <h2 className="text-xl font-semibold mb-2">
                  Reservation #{reservation._id}
                </h2>

                <p className="mb-1">Name: <span className="font-semibold">{reservation.name}</span></p>
                <p className="mb-1">Phone: <span className="font-semibold">{reservation.phone}</span></p>
                <p className="mb-1">Guests: <span className="font-semibold">{reservation.guests} people</span></p>
                <p className="mb-1">Date: <span className="font-semibold">{reservation.date}</span></p>
                <p className="mb-4">Time: <span className="font-semibold">{reservation.time}</span></p>

                <p className={`mt-2 font-semibold ${getStatusColor(reservation.status)}`}>
                  Status: {reservation.status}
                </p>

                <div className="flex gap-3 mt-4">

                  <button
                    onClick={() => updateReservationStatus(reservation._id, "Confirmed")}
                    className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Confirm
                  </button>

                  <button
                    onClick={() => updateReservationStatus(reservation._id, "Cancelled")}
                    className="bg-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => deleteReservation(reservation._id)}
                    className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>
        </>
      )}

    </div>

  );

}