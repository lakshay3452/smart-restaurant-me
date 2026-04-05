import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { Heart, Trash2, ShoppingCart, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Favourites() {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchFavourites = async () => {
    if (!user?.email) { setLoading(false); return; }
    try {
      const res = await axios.get(`/api/favourites/${encodeURIComponent(user.email)}`);
      setFavourites(res.data);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchFavourites(); }, []);

  const removeFav = async (menuItemId) => {
    try {
      await axios.delete(`/api/favourites/${encodeURIComponent(user.email)}/${menuItemId}`);
      setFavourites(prev => prev.filter(f => f.menuItemId !== menuItemId));
      toast.success("Removed from favourites");
    } catch {
      toast.error("Failed to remove");
    }
  };

  const addItemToCart = (item) => {
    addToCart({
      _id: item.menuItemId,
      name: item.name,
      price: item.price,
      image: item.image,
      isVeg: item.isVeg,
      category: item.category,
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <Heart size={48} className="text-white/20 mb-4" />
        <p className="text-white/40 text-sm mb-4">Login to see your favourites</p>
        <button onClick={() => navigate("/login")} className="px-6 py-2.5 bg-amber-500 text-black rounded-xl text-sm font-semibold">
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-serif text-white mb-6 sm:mb-8">
          My <span className="text-amber-400">Favourites</span>
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/[0.04] rounded-2xl h-56 animate-pulse" />
            ))}
          </div>
        ) : favourites.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <Heart size={48} className="mx-auto text-white/20 mb-4" />
            <p className="text-white/40 text-sm">No favourites yet</p>
            <button onClick={() => navigate("/menu")} className="mt-5 px-6 py-2.5 bg-amber-500 text-black rounded-xl text-sm font-semibold hover:bg-amber-400 transition">
              Browse Menu
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {favourites.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/[0.04] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-amber-500/20 transition"
                >
                  <div className="relative h-36 bg-gradient-to-br from-amber-900/20 to-gray-900">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl opacity-40">🍽️</div>
                    )}
                    <div className={`absolute top-2 right-2 w-5 h-5 border-2 rounded-sm flex items-center justify-center bg-black/40 ${item.isVeg ? "border-green-500" : "border-red-500"}`}>
                      <div className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? "bg-green-500" : "bg-red-500"}`} />
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-white text-sm truncate">{item.name}</h3>
                    <p className="text-white/40 text-xs mt-1">{item.category}</p>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-amber-400 font-bold text-sm">₹{item.price}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => addItemToCart(item)}
                          className="bg-amber-500 hover:bg-amber-400 text-black p-2 rounded-lg transition"
                          title="Add to cart"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() => removeFav(item.menuItemId)}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded-lg transition"
                          title="Remove"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
