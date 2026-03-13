import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {

  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);

  const inputs = useRef([]);

  // Countdown Timer
  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-black via-charcoal to-black">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">

        <AnimatePresence mode="wait">

          {/* STEP 1 - Mobile Input */}
          {step === 1 && (
            <motion.div
              key="mobile"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-serif mb-6 text-center">
                Login with Mobile
              </h2>

              <div className="flex items-center border border-white/30 rounded-xl px-4 py-3 mb-6">
                <span className="mr-2 text-gray-300">+91</span>
                <input
                  type="tel"
                  maxLength="10"
                  placeholder="Enter mobile number"
                  className="w-full bg-transparent outline-none"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>

              <button
                disabled={mobile.length !== 10}
                onClick={() => setStep(2)}
                className="w-full bg-amberAccent text-white py-3 rounded-xl font-semibold hover:scale-105 transition"
              >
                Send OTP
              </button>

              <p className="text-xs text-gray-400 mt-4 text-center">
                By continuing, you agree to our Terms & Privacy Policy
              </p>
            </motion.div>
          )}

          {/* STEP 2 - OTP INPUT */}
          {step === 2 && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-serif mb-4 text-center">
                Enter OTP
              </h2>

              <p className="text-center text-gray-400 mb-6">
                Sent to +91 {mobile}
              </p>

              <div className="flex justify-between mb-6">

                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) =>
                      handleOtpChange(e.target.value, index)
                    }
                    className="w-12 h-14 text-center text-xl rounded-xl bg-white/10 border border-white/30 focus:border-amberAccent outline-none"
                  />
                ))}

              </div>

              <button
                className="w-full bg-emeraldAccent text-white py-3 rounded-xl font-semibold hover:scale-105 transition"
              >
                Verify OTP
              </button>

              <div className="text-center mt-4 text-sm text-gray-400">

                {timer > 0 ? (
                  <span>Resend OTP in {timer}s</span>
                ) : (
                  <button
                    onClick={() => setTimer(30)}
                    className="text-amberAccent"
                  >
                    Resend OTP
                  </button>
                )}

              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
}
