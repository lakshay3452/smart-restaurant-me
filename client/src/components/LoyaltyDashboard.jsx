import { useState, useEffect } from "react";
import { Gift, TrendingUp } from "lucide-react";

export default function LoyaltyDashboard() {
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const fetchLoyaltyData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/loyalty", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setLoyaltyData(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch loyalty data:", err);
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (pointsToRedeem <= 0 || pointsToRedeem > loyaltyData.availablePoints) {
      alert("Invalid points amount");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/loyalty/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pointsToRedeem }),
      });
      const data = await response.json();
      alert(`Redeemed! Discount: ₹${data.discountAmount}`);
      setPointsToRedeem(0);
      fetchLoyaltyData();
    } catch (err) {
      console.error("Failed to redeem points:", err);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!loyaltyData) return <div className="text-center py-8">No loyalty account</div>;

  const tierColors = {
    Bronze: "from-yellow-700 to-yellow-500",
    Silver: "from-gray-400 to-gray-300",
    Gold: "from-yellow-400 to-yellow-300",
    Platinum: "from-blue-400 to-purple-400",
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Loyalty Program</h2>

      {/* Tier Card */}
      <div className={`bg-gradient-to-r ${tierColors[loyaltyData.tier]} rounded-lg p-6 mb-6 text-white shadow-lg`}>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm opacity-90">Current Tier</p>
            <h3 className="text-4xl font-bold">{loyaltyData.tier}</h3>
          </div>
          <Gift size={48} />
        </div>
      </div>

      {/* Points Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Total Points</p>
          <p className="text-3xl font-bold text-orange-500">{loyaltyData.totalPoints}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Available Points</p>
          <p className="text-3xl font-bold text-green-500">{loyaltyData.availablePoints}</p>
        </div>
      </div>

      {/* Redeem Section */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Redeem Points</h3>
        <div className="flex gap-2">
          <input
            type="number"
            max={loyaltyData.availablePoints}
            value={pointsToRedeem}
            onChange={(e) => setPointsToRedeem(parseInt(e.target.value) || 0)}
            className="flex-1 px-4 py-2 border rounded-lg dark:bg-slate-700 dark:text-white"
            placeholder="Points to redeem"
          />
          <button
            onClick={handleRedeem}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Redeem
          </button>
        </div>
        {pointsToRedeem > 0 && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Estimated discount: ₹{(pointsToRedeem / 100) * 500}
          </p>
        )}
      </div>

      {/* Point History */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp size={20} /> Point History
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {loyaltyData.pointHistory.slice(-10).reverse().map((entry, idx) => (
            <div key={idx} className="flex justify-between items-center text-sm pb-2 border-b dark:border-slate-700">
              <div>
                <p className="font-medium text-gray-800 dark:text-white">{entry.description}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(entry.date).toLocaleDateString()}
                </p>
              </div>
              <p className={`font-bold ${entry.type === "earned" ? "text-green-500" : "text-red-500"}`}>
                {entry.type === "earned" ? "+" : "-"}{entry.points}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
