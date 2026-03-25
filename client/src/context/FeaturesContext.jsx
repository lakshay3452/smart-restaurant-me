import { createContext, useState, useCallback } from "react";

export const FeaturesContext = createContext();

export const FeaturesProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [loyalty, setLoyalty] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [referral, setReferral] = useState(null);
  const [combos, setCombos] = useState([]);
  const [orders, setOrders] = useState([]);

  // Review functions
  const submitReview = useCallback(async (menuItemId, reviewData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ menuItemId, ...reviewData }),
      });
      return await response.json();
    } catch (err) {
      console.error("Failed to submit review:", err);
      throw err;
    }
  }, []);

  const updateReview = useCallback(async (reviewId, updateData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });
      return await response.json();
    } catch (err) {
      console.error("Failed to update review:", err);
      throw err;
    }
  }, []);

  const deleteReview = useCallback(async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Failed to delete review:", err);
      throw err;
    }
  }, []);

  // Loyalty functions
  const redeemPoints = useCallback(async (points) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/loyalty/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pointsToRedeem: points }),
      });
      return await response.json();
    } catch (err) {
      console.error("Failed to redeem points:", err);
      throw err;
    }
  }, []);

  // Wallet functions
  const addToWallet = useCallback(async (amount) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/wallet/add-money", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, paymentId: "PAY" + Date.now() }),
      });
      return await response.json();
    } catch (err) {
      console.error("Failed to add wallet money:", err);
      throw err;
    }
  }, []);

  // Referral functions
  const applyReferral = useCallback(async (referralCode) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/referral/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ referralCode }),
      });
      return await response.json();
    } catch (err) {
      console.error("Failed to apply referral:", err);
      throw err;
    }
  }, []);

  const value = {
    reviews,
    setReviews,
    submitReview,
    updateReview,
    deleteReview,
    loyalty,
    setLoyalty,
    redeemPoints,
    wallet,
    setWallet,
    addToWallet,
    referral,
    setReferral,
    applyReferral,
    combos,
    setCombos,
    orders,
    setOrders,
  };

  return <FeaturesContext.Provider value={value}>{children}</FeaturesContext.Provider>;
};
