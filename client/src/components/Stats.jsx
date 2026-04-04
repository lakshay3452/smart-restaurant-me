import { motion } from "framer-motion";
import { Users, UtensilsCrossed, Star, Truck } from "lucide-react";

const stats = [
  { icon: <Users size={22} />, value: "10K+", label: "Happy Customers", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  { icon: <UtensilsCrossed size={22} />, value: "500+", label: "Dishes Served", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { icon: <Star size={22} />, value: "2K+", label: "5-Star Reviews", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { icon: <Truck size={22} />, value: "30 min", label: "Avg Delivery", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
];

export default function Stats() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 sm:p-6 text-center hover:border-white/10 transition group"
            >
              <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl border ${stat.bg} ${stat.color} mb-3 group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <p className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-white/40 text-xs sm:text-sm mt-1">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
