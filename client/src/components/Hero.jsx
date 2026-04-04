import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Clock, Star } from "lucide-react";

const FLOATING_BADGES = [
  { icon: <Star size={14} fill="currentColor" />, text: "4.9 Rated", cls: "top-[20%] left-[5%] sm:left-[8%]" },
  { icon: <Clock size={14} />, text: "30 min delivery", cls: "top-[15%] right-[5%] sm:right-[10%]" },
  { icon: <Sparkles size={14} />, text: "100% Fresh", cls: "bottom-[30%] left-[3%] sm:left-[6%]" },
];

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden text-white">

      {/* Background Image with Ken Burns */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=2000&auto=format&fit=crop')",
        }}
      />

      {/* Multi-layer gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

      {/* Floating glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/8 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-emerald-500/5 rounded-full blur-[80px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center px-6 min-h-screen">

        {/* Top pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex items-center gap-2 bg-white/[0.06] border border-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 sm:mb-8"
        >
          <Sparkles size={14} className="text-amber-400" />
          <span className="text-xs sm:text-sm text-white/70 font-medium tracking-wide">
            Award-Winning Fine Dining
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.1] tracking-tight"
        >
          A Symphony of <br />
          <span className="text-amber-400 relative">
            Luxury Dining
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute -bottom-2 left-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent"
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mt-5 sm:mt-8 max-w-xl text-white/50 text-sm sm:text-base lg:text-lg leading-relaxed px-2"
        >
          Experience Michelin-level craftsmanship where every dish tells a story.
          Premium ingredients. Master chefs. Timeless elegance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Link to="/menu">
            <button className="group px-7 sm:px-8 py-3.5 sm:py-4 bg-amber-500 text-black rounded-full font-semibold hover:bg-amber-400 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/25 hover:shadow-amber-400/40 hover:scale-105 active:scale-95 text-sm sm:text-base">
              Explore Menu
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>

          <a
            href="#book-table"
            className="px-7 sm:px-8 py-3.5 sm:py-4 rounded-full border border-white/20 backdrop-blur-lg bg-white/[0.06] hover:bg-white/10 hover:border-white/30 transition-all inline-block text-center text-sm sm:text-base"
          >
            Book a Table
          </a>
        </motion.div>

      </div>

      {/* Floating Badges — Desktop only */}
      <div className="hidden lg:block">
        {FLOATING_BADGES.map((badge, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2 + i * 0.3, duration: 0.5 }}
            className={`absolute ${badge.cls} z-20 flex items-center gap-2 bg-white/[0.06] border border-white/10 backdrop-blur-md text-white/60 text-xs px-3 py-2 rounded-full`}
          >
            <span className="text-amber-400">{badge.icon}</span>
            {badge.text}
          </motion.div>
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1 h-1.5 bg-amber-400 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
