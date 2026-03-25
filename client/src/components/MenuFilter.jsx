import { useState, useEffect } from "react";
import { Filter, X } from "lucide-react";

export default function MenuFilter({ onFilterChange }) {
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    isVegan: false,
    isGlutenFree: false,
    spiceLevel: "",
    search: "",
    sortBy: "newest",
  });
  const [categories, setCategories] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/menu/categories");
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const cleared = {
      category: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
      isVegan: false,
      isGlutenFree: false,
      spiceLevel: "",
      search: "",
      sortBy: "newest",
    };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  const hasActiveFilters =
    filters.category ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.minRating ||
    filters.isVegan ||
    filters.isGlutenFree ||
    filters.spiceLevel ||
    filters.search;

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search dishes..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Quick Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleFilterChange("category", filters.category === cat ? "" : cat)}
            className={`px-4 py-2 rounded-lg transition font-medium ${
              filters.category === cat
                ? "bg-orange-500 text-white"
                : "bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white hover:bg-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sort & Dietary Options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          className="px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price Low to High</option>
          <option value="price-desc">Price High to Low</option>
          <option value="rating">Top Rated</option>
        </select>

        <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={filters.isVegan}
            onChange={(e) => handleFilterChange("isVegan", e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium dark:text-white">Vegan</span>
        </label>

        <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={filters.isGlutenFree}
            onChange={(e) => handleFilterChange("isGlutenFree", e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium dark:text-white">Gluten Free</span>
        </label>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 font-medium"
        >
          <Filter size={18} /> Advanced
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min Price (₹)
              </label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600"
                placeholder="Min price"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Price (₹)
              </label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600"
                placeholder="Max price"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min Rating
              </label>
              <select
                value={filters.minRating}
                onChange={(e) => handleFilterChange("minRating", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600"
              >
                <option value="">Any Rating</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Spice Level
              </label>
              <select
                value={filters.spiceLevel}
                onChange={(e) => handleFilterChange("spiceLevel", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600"
              >
                <option value="">Any Level</option>
                <option value="Mild">Mild</option>
                <option value="Medium">Medium</option>
                <option value="Hot">Hot</option>
                <option value="Extra Hot">Extra Hot</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="mb-6 px-4 py-2 text-red-600 hover:text-red-800 dark:text-red-400 flex items-center gap-2 font-medium"
        >
          <X size={18} /> Clear Filters
        </button>
      )}
    </div>
  );
}
