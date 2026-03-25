import { useState, useEffect } from "react";
import { Wallet, Plus, History } from "lucide-react";

export default function WalletDashboard() {
  const [wallet, setWallet] = useState(null);
  const [amountToAdd, setAmountToAdd] = useState(0);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch wallet:", err);
      setLoading(false);
    }
  };

  const handleAddMoney = async () => {
    if (amountToAdd <= 0) {
      alert("Enter valid amount");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/wallet/add-money", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: amountToAdd, paymentId: "PAY" + Date.now() }),
      });
      const data = await response.json();
      alert("Money added to wallet!");
      setAmountToAdd(0);
      setShowAddMoney(false);
      fetchWallet();
    } catch (err) {
      console.error("Failed to add money:", err);
      alert("Transaction failed");
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!wallet) return <div className="text-center py-8">Wallet not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">My Wallet</h2>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 mb-6 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm opacity-90">Wallet Balance</p>
            <h3 className="text-5xl font-bold">₹{wallet.balance.toFixed(2)}</h3>
          </div>
          <Wallet size={64} opacity={0.3} />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Total Credit</p>
          <p className="text-2xl font-bold text-green-500">₹{wallet.totalCredit.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Total Spent</p>
          <p className="text-2xl font-bold text-red-500">₹{wallet.totalDebit.toFixed(2)}</p>
        </div>
      </div>

      {/* Add Money Button */}
      <button
        onClick={() => setShowAddMoney(true)}
        className="w-full mb-6 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2 font-semibold"
      >
        <Plus size={20} /> Add Money to Wallet
      </button>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Add Money</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Amount</label>
              <input
                type="number"
                value={amountToAdd}
                onChange={(e) => setAmountToAdd(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:text-white"
                placeholder="Enter amount"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddMoney}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddMoney(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <History size={20} /> Transaction History
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {wallet.transactionHistory.slice().reverse().map((tx, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded">
              <div>
                <p className="font-medium text-gray-800 dark:text-white">{tx.description}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(tx.date).toLocaleString()}
                </p>
              </div>
              <p className={`text-lg font-bold ${tx.type === "credit" ? "text-green-500" : "text-red-500"}`}>
                {tx.type === "credit" ? "+" : "-"}₹{tx.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
