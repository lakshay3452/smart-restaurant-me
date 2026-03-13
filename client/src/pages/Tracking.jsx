import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function TrackOrder() {
  const steps = [
    "Order Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="text-2xl md:text-3xl font-serif">
          Live Order Tracking
        </h1>
      </div>

      {/* MAP SECTION */}
      <div className="h-[300px] md:h-[400px] w-full">
        <iframe
          title="map"
          width="100%"
          height="100%"
          className="grayscale"
          src="https://maps.google.com/maps?q=delhi&t=&z=13&ie=UTF8&iwloc=&output=embed"
        />
      </div>

      {/* TRACKING STATUS */}
      <div className="px-6 py-10">

        <div className="space-y-10 max-w-3xl">

          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-6">

              {/* Circle */}
              <motion.div
                animate={{
                  scale: currentStep >= index ? 1.2 : 1,
                  backgroundColor:
                    currentStep >= index ? "#f59e0b" : "#374151",
                }}
                className="w-6 h-6 rounded-full"
              />

              {/* Line */}
              {index !== steps.length - 1 && (
                <div className="absolute ml-[11px] mt-6 w-[2px] h-16 bg-gray-700" />
              )}

              <p
                className={`text-lg ${
                  currentStep >= index
                    ? "text-amber-400"
                    : "text-gray-400"
                }`}
              >
                {step}
              </p>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}
