

// src/components/ReviewCard.jsx
import { Star } from "lucide-react";

export default function ReviewCard({
  name,
  user,
  rating,
  comment,
  avatarUrl,
  date,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 w-full max-w-sm space-y-2 hover:shadow-lg transition">
      {/* Header: Avatar and User Info */}
      <div className="flex items-center gap-3">
        <img
          src={avatarUrl}
          alt={user}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h4 className="font-semibold text-gray-800">{user}</h4>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>

      {/* Rating Section */}
      <div className="flex items-center gap-1 text-yellow-500">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? "fill-current" : ""}
          />
        ))}
      </div>

      {/* Comment Section */}
      <p className="text-sm text-gray-600 line-clamp-3">{comment}</p>
    </div>
  );
}
