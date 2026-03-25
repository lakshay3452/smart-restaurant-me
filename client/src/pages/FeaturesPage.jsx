import { useState } from "react";
import LoyaltyDashboard from "../components/LoyaltyDashboard";
import WalletDashboard from "../components/WalletDashboard";
import ReferralDashboard from "../components/ReferralDashboard";

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState("loyalty");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Smart Restaurant Features
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Loyalty rewards, wallet payments, referral bonuses, and more
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-8 justify-center flex-wrap">
          <button
            onClick={() => setActiveTab("loyalty")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === "loyalty"
                ? "bg-orange-500 text-white"
                : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
            }`}
          >
            🎁 Loyalty Points
          </button>
          <button
            onClick={() => setActiveTab("wallet")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === "wallet"
                ? "bg-orange-500 text-white"
                : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
            }`}
          >
            💳 Wallet
          </button>
          <button
            onClick={() => setActiveTab("referral")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === "referral"
                ? "bg-orange-500 text-white"
                : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
            }`}
          >
            👥 Referral
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "loyalty" && <LoyaltyDashboard />}
          {activeTab === "wallet" && <WalletDashboard />}
          {activeTab === "referral" && <ReferralDashboard />}
        </div>
      </div>
    </div>
  );
}
