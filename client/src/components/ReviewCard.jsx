import { useState } from "react";
import { Star, MessageSquare, ThumbsUp } from "lucide-react";

export default function ReviewCard({ review, onDelete, onUpdate }) {
  const [helpful, setHelpful] = useState(review.helpful || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    rating: review.rating,
    title: review.title,
    comment: review.comment,
  });

  const handleSubmitEdit = async () => {
    try {
      await onUpdate(review._id, editData);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update review:", err);
    }
  };

  const handleHelpful = () => {
    setHelpful(helpful + 1);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border-l-4 border-orange-500">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-white">{review.userName}</h4>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < review.rating ? "fill-orange-500 text-orange-500" : "text-gray-300"}
              />
            ))}
          </div>
        </div>
        {!isEditing && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(review._id)}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-white"
          />
          <textarea
            placeholder="Your review"
            value={editData.comment}
            onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
            className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-white"
            rows="3"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmitEdit}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {review.title && <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">{review.title}</h5>}
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{review.comment}</p>
          <div className="flex gap-4 items-center">
            <button
              onClick={handleHelpful}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 transition"
            >
              <ThumbsUp size={16} />
              Helpful ({helpful})
            </button>
            <p className="text-xs text-gray-400">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
