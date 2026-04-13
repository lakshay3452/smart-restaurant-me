import { useState, useEffect } from "react";
import { Share2, Copy, Users, Loader2, Gift, Check } from "lucide-react";
import toast from "react-hot-toast";

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
    } catch (err) {
      console.error("Failed to fetch referral data:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(referralData.referralCode);
    setCopied(true);
    toast.success("Code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `Join me on LaCasa using my referral code: ${referralData?.referralCode}. Get ₹100 bonus!`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!referralData) {
    return (
      <div className="text-center py-12">
        <Users size={40} className="text-white/20 mx-auto mb-3" />
        <p className="text-white/40 text-sm">Referral data not available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Referral Code Card */}
      <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/10 border border-emerald-500/20 rounded-2xl p-5 sm:p-6">
        <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Your Referral Code</p>
        <div className="flex items-center gap-3">
          <h3 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-widest">{referralData.referralCode}</h3>
          <button
            onClick={copyCode}
            className="p-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] transition border border-white/10"
            title="Copy code"
          >
            {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} className="text-white/60" />}
          </button>
        </div>
        <p className="text-white/40 text-xs mt-3 flex items-center gap-1.5">
          <Gift size={12} className="text-amber-400" /> Each referral earns you ₹100 bonus
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/[0.04] border border-white/[0.06] p-4 rounded-xl">
          <p className="text-white/40 text-xs mb-1">People Referred</p>
          <p className="text-xl font-bold text-amber-400">{referralData.totalReferrals}</p>
        </div>
        <div className="bg-white/[0.04] border border-white/[0.06] p-4 rounded-xl">
          <p className="text-white/40 text-xs mb-1">Bonus Earned</p>
          <p className="text-xl font-bold text-green-400">₹{referralData.totalBonusEarned}</p>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="bg-white/[0.04] border border-white/[0.06] p-5 rounded-2xl">
        <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
          <Share2 size={16} className="text-amber-400" /> Share Your Code
        </h3>
        <div className="space-y-2">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
            className="flex items-center justify-center gap-2 w-full py-3 bg-green-600/20 text-green-400 border border-green-500/20 rounded-xl hover:bg-green-600/30 text-sm font-semibold transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            Share on WhatsApp
          </a>
          <a
            href={`https://facebook.com/sharer/sharer.php?u=${typeof window !== "undefined" ? window.location.origin : ""}&quote=${encodeURIComponent(shareText)}`}
            className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-xl hover:bg-blue-600/30 text-sm font-semibold transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            Share on Facebook
          </a>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: "LaCasa Referral", text: shareText });
              } else {
                copyCode();
              }
            }}
            className="w-full py-3 bg-white/[0.06] text-white/70 border border-white/[0.08] rounded-xl hover:bg-white/[0.1] text-sm font-semibold transition"
          >
            More Options...
          </button>
        </div>
      </div>

      {/* Referred Users */}
      {referralData.referredUsers && referralData.referredUsers.length > 0 && (
        <div className="bg-white/[0.04] border border-white/[0.06] p-5 rounded-2xl">
          <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <Users size={16} className="text-amber-400" /> Your Referrals
          </h3>
          <div className="space-y-2">
            {referralData.referredUsers.map((user, idx) => (
              <div key={idx} className="flex justify-between items-center py-2.5 border-b border-white/[0.04] last:border-0">
                <div>
                  <p className="text-white text-sm">{user.email}</p>
                  <p className="text-white/30 text-xs">Joined {new Date(user.joinedAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  user.bonusApplied
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                }`}>
                  {user.bonusApplied ? "✓ Bonus" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!referralData.referredUsers || referralData.referredUsers.length === 0) && (
        <div className="text-center py-8">
          <Users size={32} className="text-white/10 mx-auto mb-2" />
          <p className="text-white/30 text-sm">No referrals yet — share your code!</p>
        </div>
      )}
    </div>
  );
}
