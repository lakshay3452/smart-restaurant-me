import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/admin/stats");
        setStats(res.data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  if (!stats) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Failed to load analytics</div>;

  const StatCard = ({ label, value, color = "text-amber-400", sub }) => (
    <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
      {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pt-6 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif">Analytics Dashboard</h1>
        <button onClick={() => navigate("/admin")} className="bg-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-600">← Dashboard</button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Revenue" value={`₹${stats.totalRevenue?.toLocaleString() || 0}`} />
        <StatCard label="Today's Revenue" value={`₹${stats.todayRevenue?.toLocaleString() || 0}`} color="text-green-400" />
        <StatCard label="Total Orders" value={stats.totalOrders || 0} color="text-blue-400" />
        <StatCard label="Today's Orders" value={stats.todayOrders || 0} color="text-purple-400" />
        <StatCard label="Total Users" value={stats.totalUsers || 0} color="text-cyan-400" />
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-8">
        <h2 className="text-lg font-semibold mb-4">Order Status Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Pending", count: stats.pendingOrders, color: "bg-yellow-500" },
            { label: "Confirmed", count: stats.acceptedOrders, color: "bg-blue-500" },
            { label: "Preparing", count: stats.preparingOrders, color: "bg-orange-500" },
            { label: "Ready", count: stats.readyOrders, color: "bg-purple-500" },
            { label: "Delivered", count: stats.deliveredOrders, color: "bg-green-500" },
            { label: "Rejected", count: stats.rejectedOrders, color: "bg-red-500" },
          ].map(item => (
            <div key={item.label} className="text-center p-3 bg-black rounded-lg">
              <div className={`w-3 h-3 rounded-full ${item.color} mx-auto mb-2`} />
              <p className="text-xs text-gray-400">{item.label}</p>
              <p className="text-xl font-bold text-white">{item.count || 0}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Last 7 Days Chart (simple bar chart) */}
      {stats.last7Days && (
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-8">
          <h2 className="text-lg font-semibold mb-4">Last 7 Days</h2>
          <div className="flex items-end gap-2 h-40">
            {stats.last7Days.map((day, i) => {
              const maxRev = Math.max(...stats.last7Days.map(d => d.revenue || 1));
              const height = ((day.revenue || 0) / maxRev) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-amber-400">₹{day.revenue || 0}</span>
                  <div className="w-full bg-amber-500/80 rounded-t transition-all" style={{ height: `${Math.max(height, 4)}%` }} />
                  <span className="text-[10px] text-gray-500">{day.orders || 0}</span>
                  <span className="text-[9px] text-gray-600">{day.date}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      {stats.recentOrders && stats.recentOrders.length > 0 && (
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {stats.recentOrders.map(order => (
              <div key={order._id} className="flex justify-between items-center p-3 bg-black rounded-lg">
                <div>
                  <p className="text-sm font-medium">{order.name}</p>
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-amber-400 font-semibold">₹{order.totalAmount || order.total}</p>
                  <p className="text-xs text-gray-500">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
