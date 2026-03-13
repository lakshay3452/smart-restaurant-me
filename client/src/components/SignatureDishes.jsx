import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";

const dishes = [
  {
    id: 1,
    name: "Truffle Pasta",
    price: 340,
    image:
      "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Farmhouse Pizza",
    price: 320,
    image:
      "/Farmhouse Pizza.jpg",
  },
  {
    id: 3,
    name: "Grilled Salmon",
    price: 280,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Gourmet Burger",
    price: 160,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function SignatureDishes() {
  const { addToCart } = useCart();

  return (
    <section className="py-20 px-4 bg-black text-white">

      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-serif">
          Our Signature Dishes
        </h2>
        <p className="text-gray-400 mt-3 text-sm md:text-base">
          Crafted by master chefs with premium ingredients.
        </p>
      </div>

      {/* 👇 GRID FIXED */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 max-w-6xl mx-auto">

        {dishes.map((dish, index) => (
          <motion.div
            key={dish.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl"
          >
            {/* 👇 IMAGE HEIGHT REDUCED */}
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-[220px] md:h-[380px] object-cover group-hover:scale-110 transition duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-4">

              <h3 className="text-base md:text-2xl font-semibold">
                {dish.name}
              </h3>

              <p className="text-amber-400 text-sm md:text-lg mt-1">
                ₹{dish.price}
              </p>

              <button
                onClick={() => addToCart(dish)}
                className="mt-3 px-4 py-1.5 md:px-6 md:py-2 bg-amber-400 text-black text-sm md:text-base rounded-full font-medium hover:scale-105 transition"
              >
                Add
              </button>

            </div>
          </motion.div>
        ))}

      </div>
    </section>
  );
}
