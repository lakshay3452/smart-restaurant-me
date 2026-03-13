import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-black text-white">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=2000&auto=format&fit=crop')",
        }}
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center px-6 min-h-screen">

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-serif leading-tight"
        >
          A Symphony of <br />
          <span className="text-amber-400">
            Luxury Dining
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mt-6 max-w-2xl text-gray-300 text-lg"
        >
          Experience Michelin-level craftsmanship where every dish tells a story.
          Premium ingredients. Master chefs. Timeless elegance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="mt-10 flex flex-col sm:flex-row gap-6"
        >
          <Link to="/menu">
            <button className="px-8 py-4 bg-amber-400 text-black rounded-full font-semibold hover:scale-105 transition flex items-center gap-2 shadow-lg shadow-amber-400/30">
              Explore Menu <ArrowRight size={18} />
            </button>
          </Link>

          <a
  href="#book-table"
  className="px-8 py-4 rounded-full border border-white/30 backdrop-blur-lg bg-white/10 hover:bg-white/20 transition inline-block"
>
  Book a Table
</a>

        </motion.div>

        {/* Floating Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-20 grid grid-cols-3 gap-8 text-center"
        >
          <div>
            <h3 className="text-3xl font-bold text-emerald-400">15+</h3>
            <p className="text-gray-400 text-sm">Expert Chefs</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-amber-400">1200+</h3>
            <p className="text-gray-400 text-sm">Happy Guests</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-blue-400">5★</h3>
            <p className="text-gray-400 text-sm">Top Rated</p>
          </div>
        </motion.div>

      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-400 text-sm"
      >
        Scroll ↓
      </motion.div>
    </section>
  );
}
