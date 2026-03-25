import { useState, useEffect } from "react";
import { Share2, Copy, Users } from "lucide-react";

export default function ReferralDashboard() {
  const [referralData, setReferralData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/referral", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setReferralData(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch referral data:", err);
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(referralData.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `Join me on Smart Restaurant using my referral code: ${referralData?.referralCode}. Get ₹100 bonus!`;

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!referralData) return <div className="text-center py-8">Referral data not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Referral Program</h2>

      {/* Your Referral Code */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 mb-6 text-white shadow-lg">
        <p className="text-sm opacity-90 mb-2">Your Referral Code</p>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-4xl font-bold font-mono">{referralData.referralCode}</h3>
          <button
            onClick={copyCode}
            className="p-2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-lg transition"
            title="Copy code"
          >
            <Copy size={20} />
          </button>
        </div>
        {copied && <p className="text-sm">Copied!</p>}
      </div>

      {/* Share Options */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <Share2 size={20} /> Share Your Code
        </h3>
        <div className="space-y-2">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
            className="block w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-center font-semibold transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            Share on WhatsApp
          </a>
          <a
            href={`https://facebook.com/sharer/sharer.php?u=${window.location.origin}&quote=${encodeURIComponent(shareText)}`}
            className="block w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-center font-semibold transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            Share on Facebook
          </a>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "Smart Restaurant Referral",
                  text: shareText,
                });
              }
            }}
            className="w-full px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-semibold transition"
          >
            Share More...
          </button>
        </div>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400 text-sm">People Referred</p>
          <p className="text-3xl font-bold text-orange-500">{referralData.totalReferrals}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Bonus Earned</p>
          <p className="text-3xl font-bold text-green-500">₹{referralData.totalBonusEarned}</p>
        </div>
      </div>

      {/* Referred Users List */}
      {referralData.referredUsers.length > 0 && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Users size={20} /> Your Referrals
          </h3>
          <div className="space-y-3">
            {referralData.referredUsers.map((user, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded">
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">{user.email}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Joined {new Date(user.joinedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-sm font-semibold ${user.bonusApplied ? "text-green-500" : "text-yellow-500"}`}>
                  {user.bonusApplied ? "✓ Bonus Applied" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {referralData.referredUsers.length === 0 && (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          <p>No referrals yet. Start sharing your code!</p>
        </div>
      )}
    </div>
  );
}
