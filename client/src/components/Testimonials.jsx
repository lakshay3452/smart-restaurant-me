import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Riya Sharma",
    role: "Food Blogger",
    avatar: "R",
    rating: 5,
    text: "Absolutely the best dining experience in Delhi! The Truffle Pasta is to die for. Every dish feels like a work of art.",
    color: "bg-amber-500",
  },
  {
    name: "Arjun Mehta",
    role: "Regular Customer",
    avatar: "A",
    rating: 5,
    text: "Food quality is Michelin level 🔥 The butter chicken and garlic naan combo is my go-to order. Fast delivery too!",
    color: "bg-emerald-500",
  },
  {
    name: "Meera Kapoor",
    role: "Corporate Events",
    avatar: "M",
    rating: 5,
    text: "We hosted our company dinner here and the private dining experience was phenomenal. The staff went above and beyond.",
    color: "bg-blue-500",
  },
  {
    name: "Vikram Singh",
    role: "First Time Visitor",
    avatar: "V",
    rating: 4,
    text: "Premium ambiance, great music, and the Chocolate Lava Cake is heavenly. Will definitely be coming back!",
    color: "bg-purple-500",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10 sm:mb-14">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-8 bg-amber-500" />
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-[0.2em]">
              Testimonials
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif">
            What Our <span className="text-amber-400">Guests</span> Say
          </h2>
          <p className="text-white/40 text-sm sm:text-base mt-2 max-w-lg">
            Real reviews from our valued customers
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 sm:p-6 hover:border-white/10 transition group"
            >
              {/* Quote icon */}
              <Quote size={24} className="text-amber-500/20 mb-3" />

              {/* Review text */}
              <p className="text-white/60 text-sm leading-relaxed mb-5">
                "{review.text}"
              </p>

              {/* Bottom — Profile + Stars */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${review.color} flex items-center justify-center text-black font-bold text-sm`}>
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">
                      {review.name}
                    </h4>
                    <p className="text-white/30 text-xs">{review.role}</p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} size={12} fill="#f59e0b" className="text-amber-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
