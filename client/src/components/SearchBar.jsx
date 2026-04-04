import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ALL_ITEMS = [
  "Dosa", "Idli", "Vada", "Uttapam", "Sambar Rice",
  "Paneer Butter Masala", "Dal Makhani", "Chole", "Rajma", "Kadhai Paneer",
  "Noodles", "Fried Rice", "Manchurian", "Spring Roll", "Chilli Paneer",
  "Pizza", "Pasta", "Lasagna", "Garlic Bread", "Risotto",
  "Burger", "Sandwich", "Fries", "Wrap", "Hotdog"
];

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Generate suggestions based on input
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = ALL_ITEMS.filter(item =>
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSuggestions(filtered);
    setActiveSuggestionIndex(-1);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions) {
      if (e.key === "Enter") {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveSuggestionIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveSuggestionIndex(prev =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (activeSuggestionIndex >= 0) {
          selectSuggestion(suggestions[activeSuggestionIndex]);
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
      default:
        break;
    }
  };

  const selectSuggestion = (item) => {
    setSearchQuery(item);
    navigate(`/menu?search=${encodeURIComponent(item)}`);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div ref={searchRef} className="w-full relative">
      {/* Search Input Container */}
      <div className="relative">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-4 py-3 flex items-center gap-3 hover:bg-white/20 transition focus-within:bg-white/20 focus-within:border-amber-400/50">
          <Search size={18} className="text-gray-400" />
          
          <input
            type="text"
            placeholder="Search dishes, cuisines..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => searchQuery && setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
          />

          {searchQuery && (
            <button
              onClick={clearSearch}
              className="text-gray-400 hover:text-white transition"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-black border border-white/20 rounded-2xl shadow-2xl z-40 overflow-hidden backdrop-blur-xl"
          >
            <div className="max-h-96 overflow-y-auto">
              {suggestions.map((item, index) => (
                <motion.button
                  key={item}
                  onClick={() => selectSuggestion(item)}
                  onMouseEnter={() => setActiveSuggestionIndex(index)}
                  className={`w-full px-4 py-3 text-left flex items-center gap-3 transition ${
                    activeSuggestionIndex === index
                      ? "bg-amber-500/20 border-l-2 border-amber-400"
                      : "hover:bg-white/5"
                  }`}
                >
                  <Search size={16} className="text-gray-400" />
                  <span className="text-white">{item}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* No Results Message */}
        {showSuggestions && searchQuery && suggestions.length === 0 && (
          <div className="absolute top-full mt-2 w-full bg-black border border-white/20 rounded-2xl p-4 text-center text-gray-400 backdrop-blur-xl">
            No items found for "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}
