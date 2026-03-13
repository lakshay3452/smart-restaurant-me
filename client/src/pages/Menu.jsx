import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";

export default function Menu() {

  const { addToCart } = useCart();
  const [category, setCategory] = useState("All");

  const menuItems = [
    { id: 1, name: "Paneer Tikka", price: 220, category: "Starters", image: "/public/paneer-tikka.jpg" },
    { id: 2, name: "Paneer Butter Masala", price: 260, category: "Main Course", image: "/public/paneer-butter-masala.jpg" },
    { id: 3, name: "Dal Makhani", price: 240, category: "Main Course", image: "/public/dal-makhani.jpg" },
    { id: 4, name: "Veg Biryani", price: 250, category: "Rice & Biryani", image: "/public/veg-biryani.jpg" },
    { id: 5, name: "Chocolate Lava", price: 170, category: "Desserts", image: "/public/chocolate-lava.jpg" },
    { id: 6, name: "Vanilla Ice Cream", price: 80, category: "Desserts", image: "/public/vanilla-ice-cream.jpg" },
    { id: 7, name: "Plain Rice", price: 120, category: "Rice & Biryani", image: "/public/plain-rice.jpg" },
    { id: 8, name: "Butter Naan", price: 60, category: "Breads", image: "/public/butter-naan.jpg" },
    { id: 9, name: "Mineral Water", price: 30, category: "Beverages", image: "/public/mineral-water.jpg" },
    { id: 10, name: "Cold Coffee", price: 120, category: "Beverages", image: "/public/cold-coffee.jpg" },
    { id: 11, name: "Rasmalai", price: 100, category: "Desserts", image: "/public/rasmalai.jpg" },
    { id: 12, name: "Brownie with Ice Cream", price: 150, category: "Desserts", image: "/public/brownie.jpg" },
    { id: 13, name: "Veg Spring Rolls", price: 180, category: "Starters", image: "/public/spring-roll.jpg" },
    { id: 14, name: "Mix Veg Curry", price: 230, category: "Main Course", image: "/public/mix-veg.jpg" },
    { id: 15, name: "Kadai Paneer", price: 270, category: "Main Course", image: "/public/kadai-paneer.jpg" },
    { id: 16, name: "Jeera Rice", price: 160, category: "Rice & Biryani", image: "/public/jeera-rice.jpg" },
    { id: 17, name: "Veg Burger", price: 80, category: "Fast Food", image: "/public/veg-burger.jpg" },
    { id: 18, name: "Gulab Jamun", price: 40, category: "Desserts", image: "/public/gulab-jamun.jpg" },
    { id: 19, name: "Veg Hakka Noodles", price: 190, category: "Chinese", image: "/public/hakka-noodles.jpg" },
    { id: 20, name: "Lachha Paratha", price: 60, category: "Breads", image: "/public/lachha-paratha.jpg" },
    { id: 21, name: "Mango Shake", price: 80, category: "Beverages", image: "/public/mango-shake.jpg" },
    { id: 22, name: "Chilli Garlic Noodles", price: 220, category: "Chinese", image: "/public/chilli-noodles.jpg" },
    { id: 23, name: "French Fries", price: 100, category: "Fast Food", image: "/public/fries.jpg" },
    { id: 24, name: "Cheese Burger", price: 150, category: "Fast Food", image: "/pu/cheese-burger.jpg" }
  ];

  const filteredItems =
    category === "All"
      ? menuItems
      : menuItems.filter(item => item.category === category);

  return (
    <div className="px-4 py-10">

      <h1 className="text-3xl font-serif text-center mb-8">
        Our Menu
      </h1>

      {/* Category Filters */}
      <div className="flex justify-center gap-3 mb-8 flex-wrap">
        {[
          "All",
          "Starters",
          "Main Course",
          "Rice & Biryani",
          "Breads",
          "Beverages",
          "Desserts",
          "Chinese",
          "Fast Food"
        ].map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1 text-sm rounded-full border transition ${
              category === cat
                ? "bg-amber-500 text-black border-amber-500"
                : "border-gray-500 hover:border-amber-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl shadow-lg"
          >

            <img
              src={item.image}
              alt={item.name}
              className="w-full h-[220px] md:h-[260px] object-cover group-hover:scale-110 transition duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-4">

              <h3 className="text-sm md:text-lg font-semibold text-white">
                {item.name}
              </h3>

              <p className="text-amber-400 text-sm md:text-base mt-1">
                ₹{item.price}
              </p>

              <button
                onClick={() => addToCart(item)}
                className="mt-2 px-4 py-1.5 bg-amber-400 text-black text-xs md:text-sm rounded-full font-medium hover:scale-105 transition"
              >
                Add
              </button>

            </div>

          </motion.div>
        ))}

      </div>

    </div>
  );
}