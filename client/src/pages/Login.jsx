import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = credentials, 2 = OTP verify
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/login/send-otp", {
        email,
        password,
      });

      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login/verify-otp", {
        email,
        otp,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/login/send-otp", {
        email,
        password,
      });
      toast.success("OTP resent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-serif mb-6 text-center text-white">
            Login
          </h2>

          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="border border-white/30 rounded-xl px-4 py-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-transparent outline-none text-white placeholder-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="border border-white/30 rounded-xl px-4 py-3">
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full bg-transparent outline-none text-white placeholder-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 text-black py-3 rounded-xl font-semibold hover:scale-105 transition disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <p className="text-center text-gray-300 text-sm mb-2">
                OTP sent to <span className="text-amber-400">{email}</span>
              </p>

              <div className="border border-amber-500/50 rounded-xl px-4 py-3">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  className="w-full bg-transparent outline-none text-white placeholder-gray-400 text-center text-xl tracking-[0.5em]"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-amber-500 text-black py-3 rounded-xl font-semibold hover:scale-105 transition disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => { setStep(1); setOtp(""); }}
                  className="text-gray-400 text-sm hover:text-white transition"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-amber-400 text-sm hover:underline disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-amber-400 hover:underline">
              Register
            </Link>
          </p>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Admin? <Link to="/admin-login" className="text-amber-400 hover:underline">Login here</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
