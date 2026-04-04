import { motion } from "framer-motion";
import { Utensils, Flame, Leaf, Clock } from "lucide-react";

const cards = [
  {
    title: "Farm to Fork",
    desc: "Fresh ingredients sourced daily from local organic farms",
    icon: <Leaf size={20} />,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop",
    span: "md:col-span-2 md:row-span-2",
    height: "h-48 sm:h-56 md:h-[360px]",
    overlay: "from-black/80 via-black/40",
  },
  {
    title: "Signature Desserts",
    desc: "Heavenly handcrafted sweets",
    icon: <Utensils size={18} />,
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=800&auto=format&fit=crop",
    span: "",
    height: "h-40 sm:h-44",
    overlay: "from-emerald-900/80 via-emerald-900/40",
    accent: "emerald",
  },
  {
    title: "Chef's Specials",
    desc: "Curated by our master chefs",
    icon: <Flame size={18} />,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop",
    span: "",
    height: "h-40 sm:h-44",
    overlay: "from-amber-900/80 via-amber-900/40",
    accent: "amber",
  },
  {
    title: "30 Min Express",
    desc: "Lightning-fast delivery to your door",
    icon: <Clock size={18} />,
    span: "md:col-span-3",
    height: "h-32 sm:h-36",
    gradient: true,
  },
];

export default function BentoGrid() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10 sm:mb-14">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-8 bg-amber-500" />
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-[0.2em]">
              Why Choose Us
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif">
            The <span className="text-amber-400">LaCasa</span> Experience
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className={`relative rounded-2xl overflow-hidden group ${card.span} ${card.height} border border-white/[0.06]`}
            >
              {card.gradient ? (
                /* Text-only gradient card */
                <div className="w-full h-full bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-emerald-500/10 flex items-center justify-center gap-4 px-6">
                  <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base sm:text-lg">{card.title}</h3>
                    <p className="text-white/40 text-xs sm:text-sm">{card.desc}</p>
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${card.overlay} to-transparent`} />
                  <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
                    <div className={`inline-flex items-center gap-1.5 text-xs font-semibold mb-2 ${
                      card.accent === "emerald"
                        ? "text-emerald-400"
                        : card.accent === "amber"
                        ? "text-amber-400"
                        : "text-amber-400"
                    }`}>
                      {card.icon}
                      <span className="uppercase tracking-wider">{card.title}</span>
                    </div>
                    <p className="text-white/60 text-xs sm:text-sm">{card.desc}</p>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
