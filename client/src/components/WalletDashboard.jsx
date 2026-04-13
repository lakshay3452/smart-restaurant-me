import { useState, useEffect } from "react";
import { Wallet, Plus, History, X, Loader2, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import toast from "react-hot-toast";

const QUICK_AMOUNTS = [100, 200, 500, 1000];

export default function WalletDashboard() {
  const [wallet, setWallet] = useState(null);
  const [amountToAdd, setAmountToAdd] = useState("");
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/wallet", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setWallet(data);
    } catch (err) {
      console.error("Failed to fetch wallet:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = async () => {
    const amount = parseFloat(amountToAdd);
    if (!amount || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    setAdding(true);
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/wallet/add-money", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, paymentId: "PAY" + Date.now() }),
      });
      toast.success(`₹${amount} added to wallet!`);
      setAmountToAdd("");
      setShowAddMoney(false);
      fetchWallet();
    } catch (err) {
      toast.error("Transaction failed");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="text-center py-12">
        <Wallet size={40} className="text-white/20 mx-auto mb-3" />
        <p className="text-white/40 text-sm">Wallet will be created on your first transaction</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/10 border border-blue-500/20 rounded-2xl p-5 sm:p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider">Wallet Balance</p>
            <h3 className="text-3xl sm:text-4xl font-bold text-white mt-1">₹{wallet.balance.toFixed(0)}</h3>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/[0.06] flex items-center justify-center">
            <Wallet size={28} className="text-blue-400" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/[0.04] border border-white/[0.06] p-4 rounded-xl">
          <div className="flex items-center gap-1.5 mb-1">
            <ArrowDownLeft size={12} className="text-green-400" />
            <p className="text-white/40 text-xs">Total Credit</p>
          </div>
          <p className="text-xl font-bold text-green-400">₹{wallet.totalCredit.toFixed(0)}</p>
        </div>
        <div className="bg-white/[0.04] border border-white/[0.06] p-4 rounded-xl">
          <div className="flex items-center gap-1.5 mb-1">
            <ArrowUpRight size={12} className="text-red-400" />
            <p className="text-white/40 text-xs">Total Spent</p>
          </div>
          <p className="text-xl font-bold text-red-400">₹{wallet.totalDebit.toFixed(0)}</p>
        </div>
      </div>

      {/* Add Money Button */}
      <button
        onClick={() => setShowAddMoney(true)}
        className="w-full py-3 bg-amber-500 text-black rounded-xl font-semibold hover:bg-amber-400 transition flex items-center justify-center gap-2 text-sm"
      >
        <Plus size={18} /> Add Money
      </button>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowAddMoney(false)}>
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-white font-semibold">Add Money</h3>
              <button onClick={() => setShowAddMoney(false)} className="text-white/40 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmountToAdd(String(amt))}
                  className={`py-2 rounded-xl text-sm font-medium transition border ${
                    String(amt) === amountToAdd
                      ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                      : "bg-white/[0.04] border-white/[0.08] text-white/60 hover:border-white/20"
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <input
              type="number"
              value={amountToAdd}
              onChange={(e) => setAmountToAdd(e.target.value)}
              className="w-full px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-500/50 mb-4"
              placeholder="Enter custom amount"
            />

            <div className="flex gap-2">
              <button
                onClick={handleAddMoney}
                disabled={adding}
                className="flex-1 py-3 bg-amber-500 text-black rounded-xl font-semibold hover:bg-amber-400 transition disabled:opacity-50 text-sm"
              >
                {adding ? "Adding..." : "Add Money"}
              </button>
              <button
                onClick={() => setShowAddMoney(false)}
                className="px-5 py-3 bg-white/[0.06] text-white/60 rounded-xl text-sm hover:bg-white/[0.1] transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History */}
      {wallet.transactionHistory && wallet.transactionHistory.length > 0 && (
        <div className="bg-white/[0.04] border border-white/[0.06] p-5 rounded-2xl">
          <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <History size={16} className="text-amber-400" /> Transactions
          </h3>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {wallet.transactionHistory.slice().reverse().map((tx, idx) => (
              <div key={idx} className="flex justify-between items-center py-2.5 border-b border-white/[0.04] last:border-0">
                <div>
                  <p className="text-white text-sm">{tx.description}</p>
                  <p className="text-white/30 text-xs">{new Date(tx.date).toLocaleString()}</p>
                </div>
                <p className={`font-bold text-sm ${tx.type === "credit" ? "text-green-400" : "text-red-400"}`}>
                  {tx.type === "credit" ? "+" : "-"}₹{tx.amount.toFixed(0)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
