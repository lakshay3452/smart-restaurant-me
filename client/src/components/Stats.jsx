import { motion } from "framer-motion";

export default function Stats() {

  const stats = [
    { label: "Happy Customers", value: "10K+" },
    { label: "Dishes Served", value: "500+" },
    { label: "5-Star Reviews", value: "2K+" }
  ];

  return (
    <section className="py-20 px-6 bg-white/5">

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">

        {stats.map((stat, i) => (
          <motion.div
            key={i}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            className="text-3xl font-serif"
          >
            <p className="text-emeraldAccent">
              {stat.value}
            </p>
            <p className="text-gray-400 text-lg">
              {stat.label}
            </p>
          </motion.div>
        ))}

      </div>

    </section>
  );
}
