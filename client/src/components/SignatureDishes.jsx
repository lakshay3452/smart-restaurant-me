import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { Star, Plus, Minus, ChevronLeft, ChevronRight, Flame, Award } from "lucide-react";

const dishes = [
  {
    id: "sig-1",
    name: "Truffle Pasta",
    description: "Hand-rolled pasta tossed in black truffle cream sauce with parmesan shavings",
    price: 340,
    rating: 4.8,
    reviews: 324,
    tag: "Chef's Special",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "sig-2",
    name: "Farmhouse Pizza",
    description: "Wood-fired pizza loaded with fresh veggies, mozzarella & our secret herb blend",
    price: 320,
    rating: 4.6,
    reviews: 512,
    tag: "Most Ordered",
    isVeg: true,
    image: "/Farmhouse Pizza.jpg",
  },
  {
    id: "sig-3",
    name: "Grilled Salmon",
    description: "Norwegian salmon fillet grilled to perfection, served with lemon butter & asparagus",
    price: 480,
    rating: 4.9,
    reviews: 198,
    tag: "Premium",
    isVeg: false,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "sig-4",
    name: "Gourmet Burger",
    description: "Double smashed patty with aged cheddar, caramelised onions & truffle aioli",
    price: 260,
    rating: 4.7,
    reviews: 678,
    tag: "Bestseller",
    isVeg: false,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "sig-5",
    name: "Paneer Tikka Platter",
    description: "Charcoal-grilled paneer cubes marinated in smoky tandoori spices with mint chutney",
    price: 280,
    rating: 4.5,
    reviews: 432,
    tag: "Fan Favourite",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "sig-6",
    name: "Chocolate Lava Cake",
    description: "Warm molten chocolate cake with a gooey center, paired with vanilla bean ice cream",
    price: 220,
    rating: 4.8,
    reviews: 856,
    tag: "Must Try",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=1200&auto=format&fit=crop",
  },
];

const TAG_STYLES = {
  "Chef's Special": "bg-purple-500/15 text-purple-400 border-purple-500/25",
  "Most Ordered": "bg-blue-500/15 text-blue-400 border-blue-500/25",
  "Premium": "bg-amber-500/15 text-amber-400 border-amber-500/25",
  "Bestseller": "bg-green-500/15 text-green-400 border-green-500/25",
  "Fan Favourite": "bg-pink-500/15 text-pink-400 border-pink-500/25",
  "Must Try": "bg-orange-500/15 text-orange-400 border-orange-500/25",
};

function DishCard({ dish, index }) {
  const { cartItems, addToCart, increaseQty, decreaseQty } = useCart();
  const [imgError, setImgError] = useState(false);

  const itemId = dish.id;
  const cartItem = cartItems.find((ci) => (ci.id ?? ci._id) === itemId);
  const qty = cartItem?.quantity || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      viewport={{ once: true }}
      className="group relative flex-shrink-0 w-[280px] sm:w-auto bg-white/[0.04] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-amber-500/20 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-44 sm:h-52 overflow-hidden bg-gradient-to-br from-amber-900/20 to-gray-900">
        {!imgError ? (
          <img
            src={dish.image}
            alt={dish.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">
            🍽️
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Tag Badge */}
        {dish.tag && (
          <div
            className={`absolute top-3 left-3 text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm uppercase tracking-wider ${
              TAG_STYLES[dish.tag] || "bg-amber-500/15 text-amber-400 border-amber-500/25"
            }`}
          >
            {dish.tag}
          </div>
        )}

        {/* Veg / Non-Veg */}
        <div
          className={`absolute top-3 right-3 w-5 h-5 border-2 rounded-sm flex items-center justify-center bg-black/50 backdrop-blur-sm ${
            dish.isVeg ? "border-green-500" : "border-red-500"
          }`}
        >
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              dish.isVeg ? "bg-green-500" : "bg-red-500"
            }`}
          />
        </div>

        {/* Rating pill at bottom of image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-green-600/90 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-md">
          <Star size={10} fill="white" />
          {dish.rating}
          <span className="text-white/60 font-normal ml-0.5">({dish.reviews})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <h3 className="text-white font-semibold text-[15px] sm:text-base leading-tight truncate">
          {dish.name}
        </h3>

        <p className="text-white/35 text-[11px] sm:text-xs mt-1.5 line-clamp-2 leading-relaxed">
          {dish.description}
        </p>

        <div className="flex items-center justify-between mt-4 gap-2">
          <span className="text-amber-400 font-bold text-base sm:text-lg">
            ₹{dish.price}
          </span>

          {/* ADD / Qty Controls */}
          {qty === 0 ? (
            <button
              onClick={() => addToCart(dish)}
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-[11px] px-5 py-1.5 rounded-lg transition-all hover:scale-105 active:scale-95 shadow-md shadow-amber-500/20 uppercase tracking-wide"
            >
              Add
            </button>
          ) : (
            <div className="flex items-center bg-amber-500 rounded-lg overflow-hidden shadow-md shadow-amber-500/20">
              <button
                onClick={() => decreaseQty(itemId)}
                className="px-2.5 py-1.5 hover:bg-amber-400 transition text-black"
              >
                <Minus size={13} strokeWidth={3} />
              </button>
              <span className="text-black font-bold text-xs min-w-[22px] text-center">
                {qty}
              </span>
              <button
                onClick={() => increaseQty(itemId)}
                className="px-2.5 py-1.5 hover:bg-amber-400 transition text-black"
              >
                <Plus size={13} strokeWidth={3} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function SignatureDishes() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-16 sm:py-24 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-8 bg-amber-500" />
              <span className="text-amber-400 text-xs font-semibold uppercase tracking-[0.2em]">
                Handpicked for you
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">
              Our <span className="text-amber-400">Signature</span> Dishes
            </h2>
            <p className="text-white/40 mt-2 text-sm sm:text-base max-w-lg">
              Crafted by master chefs with premium ingredients — the dishes that made us famous.
            </p>
          </div>

          {/* Scroll Arrows — visible when scrollable (below lg) */}
          <div className="hidden sm:flex lg:hidden items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-2.5 rounded-full bg-white/[0.06] border border-white/[0.08] hover:bg-white/10 hover:border-amber-500/30 transition active:scale-90"
            >
              <ChevronLeft size={18} className="text-white/60" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2.5 rounded-full bg-white/[0.06] border border-white/[0.08] hover:bg-white/10 hover:border-amber-500/30 transition active:scale-90"
            >
              <ChevronRight size={18} className="text-white/60" />
            </button>
          </div>
        </div>

        {/* Mobile/Tablet: Horizontal scroll | Desktop: Grid */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0 menu-scrollbar-hide scroll-smooth"
        >
          {dishes.map((dish, i) => (
            <div key={dish.id} className="snap-start">
              <DishCard dish={dish} index={i} />
            </div>
          ))}
        </div>

        {/* Mobile scroll hint dots */}
        <div className="flex justify-center gap-1.5 mt-6 lg:hidden">
          {dishes.map((d) => (
            <div
              key={d.id}
              className="w-1.5 h-1.5 rounded-full bg-white/15"
            />
          ))}
        </div>

      </div>
    </section>
  );
}
