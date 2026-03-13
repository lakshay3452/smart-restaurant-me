import { motion } from "framer-motion";

export default function Testimonials() {

  const reviews = [
    { name: "Riya", text: "Best dining experience ever!" },
    { name: "Arjun", text: "Food quality is Michelin level 🔥" },
    { name: "Meera", text: "Fast delivery and premium taste." }
  ];

  return (
    <section className="py-20 px-6">

      <h2 className="text-4xl font-serif text-center mb-12">
        What Our Customers Say
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

        {reviews.map((review, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 text-center"
          >
            <p className="mb-4 italic">
              "{review.text}"
            </p>
            <h4 className="font-semibold">
              {review.name}
            </h4>
          </motion.div>
        ))}

      </div>

    </section>
  );
}
