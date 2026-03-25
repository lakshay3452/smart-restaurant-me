import { useState } from "react";
import { Star } from "lucide-react";

export default function ReviewForm({ menuItemId, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    rating: 0,
    title: "",
    comment: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) {
      alert("Please select a rating");
      return;
    }
    try {
      await onSubmit(formData);
      setFormData({ rating: 0, title: "", comment: "" });
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Rate This Item</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating Stars */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="focus:outline-none"
                >
                  <Star
                    size={32}
                    className={
                      star <= formData.rating
                        ? "fill-orange-500 text-orange-500"
                        : "text-gray-300 hover:text-orange-300"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="Sum up your experience"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600"
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your Review
            </label>
            <textarea
              placeholder="Share your experience with others"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Submit Review
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
