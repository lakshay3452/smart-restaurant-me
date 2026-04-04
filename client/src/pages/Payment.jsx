import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function Payment() {
  const { totalPrice } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = () => {
    if (totalPrice === 0) {
      toast.error("Cart is empty!");
      return;
    }

    if (paymentMethod === "cod") {
      // Cash on Delivery
      toast.success("Order placed! Pay on delivery 📦");
      setTimeout(() => navigate("/success"), 1500);
      return;
    }

    // Razorpay Payment
    setLoading(true);
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SHwVlICvjFuJiH",
      amount: totalPrice * 100,
      currency: "INR",
      name: "LaCasa Restaurant",
      description: "Food Order Payment",
      image: "/herobackgroundimage.jfif",
      handler: (response) => {
        setLoading(false);
        toast.success(`Payment successful! ID: ${response.razorpay_payment_id}`);
        setTimeout(() => navigate("/success"), 1500);
      },
      modal: {
        ondismiss: () => {
          setLoading(false);
          toast.error("Payment cancelled");
        },
      },
      prefill: {
        name: "Guest",
        email: "guest@lacasa.com",
        contact: "9999999999",
      },
      theme: {
        color: "#f59e0b",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="min-h-screen text-white px-4 sm:px-6 py-6 sm:py-10">

      <h1 className="text-2xl sm:text-3xl font-serif mb-6 sm:mb-8">
        <span className="text-amber-400">Payment</span>
      </h1>

      <div className="max-w-xl mx-auto bg-white/[0.04] border border-white/[0.06] backdrop-blur-xl p-5 sm:p-8 rounded-2xl shadow-2xl">

        <h2 className="text-base sm:text-xl mb-4 sm:mb-6 font-semibold">
          Choose Payment Method
        </h2>

        <div className="space-y-3">

          <label className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.06] p-3 sm:p-4 rounded-xl cursor-pointer hover:bg-white/[0.08] transition text-sm sm:text-base">
            <input type="radio" name="payment" value="upi" checked={paymentMethod === "upi"} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-amber-500" />
            <span>UPI</span>
          </label>

          <label className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.06] p-3 sm:p-4 rounded-xl cursor-pointer hover:bg-white/[0.08] transition text-sm sm:text-base">
            <input type="radio" name="payment" value="card" checked={paymentMethod === "card"} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-amber-500" />
            <span>Credit / Debit Card</span>
          </label>

          <label className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.06] p-3 sm:p-4 rounded-xl cursor-pointer hover:bg-white/[0.08] transition text-sm sm:text-base">
            <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-amber-500" />
            <span>Cash on Delivery</span>
          </label>

        </div>

        <div className="mt-6 sm:mt-8 flex justify-between items-center border-t border-white/[0.06] pt-5 sm:pt-6">
          <span className="text-sm sm:text-lg">Total Amount</span>
          <span className="text-xl sm:text-2xl text-amber-400 font-bold">
            ₹{totalPrice}
          </span>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full mt-5 sm:mt-8 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-700 disabled:cursor-not-allowed text-black py-3 sm:py-3.5 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/20 text-sm sm:text-base"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

      </div>

    </div>
  );
}
