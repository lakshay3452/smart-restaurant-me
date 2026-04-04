import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle, Circle, ChefHat, Truck, Package } from "lucide-react";

const STEPS = [
  { label: "Order Confirmed", icon: CheckCircle, desc: "Your order has been placed" },
  { label: "Preparing", icon: ChefHat, desc: "Chef is preparing your food" },
  { label: "Out for Delivery", icon: Truck, desc: "Rider is on the way" },
  { label: "Delivered", icon: Package, desc: "Enjoy your meal!" },
];

export default function TrackOrder() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  return (
    <div className="min-h-screen text-white">

      {/* HEADER */}
      <div className="px-4 sm:px-6 py-6 border-b border-white/[0.06]">
        <h1 className="text-2xl sm:text-3xl font-serif">
          Live <span className="text-amber-400">Order Tracking</span>
        </h1>
        <p className="text-white/40 text-xs sm:text-sm mt-1">Real-time updates on your order</p>
      </div>

      {/* MAP SECTION */}
      <div className="h-[200px] sm:h-[300px] md:h-[350px] w-full">
        <iframe
          title="map"
          width="100%"
          height="100%"
          className="grayscale opacity-70"
          src="https://maps.google.com/maps?q=delhi&t=&z=13&ie=UTF8&iwloc=&output=embed"
        />
      </div>

      {/* TRACKING STATUS */}
      <div className="px-4 sm:px-6 py-8 sm:py-10">
        <div className="max-w-2xl mx-auto">

          {STEPS.map((step, index) => {
            const isActive = currentStep >= index;
            const isCurrent = currentStep === index;
            const StepIcon = step.icon;

            return (
              <div key={index} className="flex gap-4 sm:gap-6">
                {/* Left: Icon + Line */}
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      scale: isCurrent ? 1.15 : 1,
                      backgroundColor: isActive ? "#f59e0b" : "rgba(255,255,255,0.06)",
                    }}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 border-2"
                    style={{ borderColor: isActive ? "#f59e0b" : "rgba(255,255,255,0.1)" }}
                  >
                    <StepIcon size={18} className={isActive ? "text-black" : "text-white/30"} />
                  </motion.div>
                  {index < STEPS.length - 1 && (
                    <div className={`w-0.5 h-12 sm:h-14 my-1 transition-colors duration-500 ${
                      currentStep > index ? "bg-amber-500" : "bg-white/[0.06]"
                    }`} />
                  )}
                </div>

                {/* Right: Text */}
                <div className="pt-2 sm:pt-2.5 pb-6">
                  <p className={`font-semibold text-sm sm:text-base ${
                    isActive ? "text-white" : "text-white/30"
                  }`}>
                    {step.label}
                    {isCurrent && (
                      <span className="ml-2 inline-block w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping" />
                    )}
                  </p>
                  <p className={`text-xs sm:text-sm mt-0.5 ${
                    isActive ? "text-white/50" : "text-white/20"
                  }`}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}

        </div>
      </div>

    </div>
  );
}
