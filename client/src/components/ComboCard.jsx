import { useState, useEffect } from "react";
import { Zap } from "lucide-react";

export default function ComboCard({ combo, onAdd }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
      {/* Image */}
      <div className="relative h-48 bg-gray-200 dark:bg-slate-700 overflow-hidden">
        {combo.image ? (
          <img src={combo.image} alt={combo.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
        )}
        <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Save {combo.discount || 10}%
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
          <Zap size={18} className="text-orange-500" /> {combo.name}
        </h3>

        {combo.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{combo.description}</p>
        )}

        {/* Items in combo */}
        {combo.items && combo.items.length > 0 && (
          <div className="mb-3 p-2 bg-gray-50 dark:bg-slate-700 rounded text-sm">
            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Includes:</p>
            <ul className="text-gray-600 dark:text-gray-400 text-xs space-y-1">
              {combo.items.slice(0, 3).map((item, idx) => (
                <li key={idx}>• {item.menuItemId?.name || "Item"} (×{item.quantity})</li>
              ))}
              {combo.items.length > 3 && <li className="text-orange-500">+ {combo.items.length - 3} more</li>}
            </ul>
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-center justify-between mb-4">
          <div>
            {combo.originalPrice && (
              <p className="text-sm text-gray-500 line-through">₹{combo.originalPrice}</p>
            )}
            <p className="text-2xl font-bold text-orange-500">₹{combo.comboPrice}</p>
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={() => onAdd(combo)}
          className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default function ComboSection() {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCombos();
  }, []);

  const fetchCombos = async () => {
    try {
      const response = await fetch("/api/combos");
      const data = await response.json();
      setCombos(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch combos:", err);
      setLoading(false);
    }
  };

  const handleAddCombo = (combo) => {
    // This would integrate with your cart context
    console.log("Add combo to cart:", combo);
    // Example: addToCart(combo);
    alert(`${combo.name} added to cart!`);
  };

  if (loading) return <div className="text-center py-8">Loading combos...</div>;
  if (combos.length === 0) return <div className="text-center py-8">No combos available</div>;

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
        <Zap size={28} className="text-orange-500" /> Special Combo Deals
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {combos.map((combo) => (
          <ComboCard key={combo._id} combo={combo} onAdd={handleAddCombo} />
        ))}
      </div>
    </div>
  );
}
