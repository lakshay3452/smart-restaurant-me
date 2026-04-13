import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Wallet, Users, Trophy, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoyaltyDashboard from "../components/LoyaltyDashboard";
import WalletDashboard from "../components/WalletDashboard";
import ReferralDashboard from "../components/ReferralDashboard";

const tabs = [
  { id: "loyalty", label: "Loyalty", icon: Trophy, color: "amber" },
  { id: "wallet", label: "Wallet", icon: Wallet, color: "blue" },
  { id: "referral", label: "Referral", icon: Users, color: "green" },
];

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState("loyalty");
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <Gift size={48} className="text-amber-500/30 mb-4" />
        <p className="text-white/40 mb-4 text-sm">Please login to access rewards</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-amber-500 text-black px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-amber-400 transition"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="text-white/40 hover:text-white transition">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif text-white">
              My <span className="text-amber-400">Rewards</span>
            </h1>
            <p className="text-white/40 text-xs sm:text-sm mt-0.5">
              Loyalty points, wallet & referral bonuses
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-amber-500 text-black"
                  : "bg-white/[0.06] text-white/50 hover:bg-white/[0.1]"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "loyalty" && <LoyaltyDashboard />}
          {activeTab === "wallet" && <WalletDashboard />}
          {activeTab === "referral" && <ReferralDashboard />}
        </motion.div>
      </div>
    </div>
  );
}
