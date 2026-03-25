import { useState, useEffect } from "react";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";

export default function OrderTracker({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(() => {
      if (autoRefresh) fetchOrder();
    }, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/single/${orderId}`);
      const data = await response.json();
      setOrder(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch order:", err);
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock size={24} className="text-yellow-500" />;
      case "Confirmed":
      case "Preparing":
        return <Package size={24} className="text-blue-500" />;
      case "Ready":
      case "Dispatched":
        return <Truck size={24} className="text-orange-500" />;
      case "Delivered":
        return <CheckCircle size={24} className="text-green-500" />;
      case "Cancelled":
        return <X size={24} className="text-red-500" />;
      default:
        return null;
    }
  };

  const statusSequence = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Ready",
    "Dispatched",
    "Delivered",
  ];
  const currentStatusIndex = statusSequence.indexOf(order?.status || "Pending");

  if (loading) return <div className="text-center py-8">Loading order...</div>;
  if (!order) return <div className="text-center py-8">Order not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Order #{order._id.slice(-8)}</h2>

      {/* Order Status Timeline */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Order Status</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">Auto-refresh</span>
          </label>
        </div>

        {/* Timeline */}
        <div className="relative">
          {statusSequence.map((status, idx) => (
            <div key={status} className="flex items-center mb-6 last:mb-0">
              {/* Connector Line */}
              {idx < statusSequence.length - 1 && (
                <div
                  className={`absolute left-6 top-16 w-1 h-12 ${
                    idx < currentStatusIndex ? "bg-green-500" : "bg-gray-300 dark:bg-slate-600"
                  }`}
                />
              )}

              {/* Status Circle */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  idx <= currentStatusIndex
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 dark:bg-slate-600 text-gray-500"
                }`}
              >
                {idx < currentStatusIndex ? (
                  <CheckCircle size={24} />
                ) : idx === currentStatusIndex ? (
                  <div className="w-6 h-6 bg-white rounded-full animate-pulse" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              {/* Status Info */}
              <div className="ml-4 flex-1">
                <h4 className={`font-semibold ${idx <= currentStatusIndex ? "text-green-600" : "text-gray-500"}`}>
                  {status}
                </h4>
                {order.statusHistory && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {order.statusHistory.find((s) => s.status === status)
                      ? new Date(order.statusHistory.find((s) => s.status === status).timestamp).toLocaleString()
                      : "Pending"}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Items */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Items Ordered</h3>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start pb-3 border-b dark:border-slate-700">
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">{item.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-orange-500">₹{item.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Name</span>
              <span className="font-medium">{order.name}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Phone</span>
              <span className="font-medium">{order.phone}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Delivery Address</span>
              <span className="font-medium text-right text-sm">{order.address}</span>
            </div>
            {order.estimatedDeliveryTime && (
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Est. Delivery</span>
                <span className="font-medium">{new Date(order.estimatedDeliveryTime).toLocaleTimeString()}</span>
              </div>
            )}
            {order.deliveryPartner && (
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Delivery Partner</span>
                <span className="font-medium">{order.deliveryPartner}</span>
              </div>
            )}
            <hr className="dark:border-slate-700" />
            <div className="flex justify-between text-lg font-bold text-orange-500">
              <span>Total Amount</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Points Earned */}
      {order.loyaltyPointsEarned > 0 && (
        <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-700 p-4 rounded-lg border-l-4 border-orange-500">
          <p className="text-sm text-gray-600 dark:text-gray-400">Loyalty Points Earned</p>
          <p className="text-2xl font-bold text-orange-500">+{order.loyaltyPointsEarned} points</p>
        </div>
      )}
    </div>
  );
}
