import { useState, useEffect } from "react";
import { Gift, TrendingUp, Star, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

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
    } catch (err) {
      console.error("Failed to fetch loyalty data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (pointsToRedeem <= 0 || pointsToRedeem > loyaltyData.availablePoints) {
      toast.error("Invalid points amount");
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
      toast.success(`Redeemed! Discount: ₹${data.discountAmount}`);
      setPointsToRedeem(0);
      fetchLoyaltyData();
    } catch (err) {
      toast.error("Failed to redeem points");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!loyaltyData) {
    return (
      <div className="text-center py-12">
        <Gift size={40} className="text-white/20 mx-auto mb-3" />
        <p className="text-white/40 text-sm">Start ordering to earn loyalty points!</p>
      </div>
    );
  }

  const tierConfig = {
    Bronze: { gradient: "from-yellow-700/30 to-yellow-600/10", border: "border-yellow-600/30", text: "text-yellow-500" },
    Silver: { gradient: "from-gray-400/20 to-gray-500/10", border: "border-gray-400/30", text: "text-gray-300" },
    Gold: { gradient: "from-yellow-400/25 to-amber-500/10", border: "border-yellow-400/30", text: "text-yellow-400" },
    Platinum: { gradient: "from-blue-500/20 to-purple-500/10", border: "border-blue-400/30", text: "text-blue-400" },
  };

  const tier = tierConfig[loyaltyData.tier] || tierConfig.Bronze;

  return (
    <div className="space-y-4">
      {/* Tier Card */}
      <div className={`bg-gradient-to-r ${tier.gradient} border ${tier.border} rounded-2xl p-5 sm:p-6`}>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider">Current Tier</p>
            <h3 className={`text-3xl sm:text-4xl font-bold ${tier.text} font-serif`}>{loyaltyData.tier}</h3>
          </div>
          <div className={`w-14 h-14 rounded-2xl bg-white/[0.06] flex items-center justify-center`}>
            <Star size={28} className={tier.text} />
          </div>
        </div>
      </div>

      {/* Points Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/[0.04] border border-white/[0.06] p-4 rounded-xl">
          <p className="text-white/40 text-xs">Total Earned</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{loyaltyData.totalPoints}</p>
        </div>
        <div className="bg-white/[0.04] border border-white/[0.06] p-4 rounded-xl">
          <p className="text-white/40 text-xs">Available</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{loyaltyData.availablePoints}</p>
        </div>
      </div>

      {/* Redeem Section */}
      <div className="bg-white/[0.04] border border-white/[0.06] p-5 rounded-2xl">
        <h3 className="text-white font-semibold text-sm mb-3">Redeem Points</h3>
        <div className="flex gap-2">
          <input
            type="number"
            max={loyaltyData.availablePoints}
            value={pointsToRedeem}
            onChange={(e) => setPointsToRedeem(parseInt(e.target.value) || 0)}
            className="flex-1 px-4 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-500/50"
            placeholder="Enter points"
          />
          <button
            onClick={handleRedeem}
            disabled={pointsToRedeem <= 0}
            className="px-5 py-2.5 bg-amber-500 text-black rounded-xl text-sm font-semibold hover:bg-amber-400 transition disabled:opacity-40"
          >
            Redeem
          </button>
        </div>
        {pointsToRedeem > 0 && (
          <p className="mt-2 text-amber-400/70 text-xs">
            Estimated discount: ₹{Math.round((pointsToRedeem / 100) * 500)}
          </p>
        )}
      </div>

      {/* Point History */}
      {loyaltyData.pointHistory && loyaltyData.pointHistory.length > 0 && (
        <div className="bg-white/[0.04] border border-white/[0.06] p-5 rounded-2xl">
          <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-amber-400" /> Point History
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {loyaltyData.pointHistory.slice(-10).reverse().map((entry, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0">
                <div>
                  <p className="text-white text-sm">{entry.description}</p>
                  <p className="text-white/30 text-xs">{new Date(entry.date).toLocaleDateString()}</p>
                </div>
                <p className={`font-bold text-sm ${entry.type === "earned" ? "text-green-400" : "text-red-400"}`}>
                  {entry.type === "earned" ? "+" : "-"}{entry.points}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
