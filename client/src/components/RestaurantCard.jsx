

// src/components/RestaurantCard.jsx
import { MapPin, Star } from "lucide-react";

export default function RestaurantCard({ name, imageUrl, rating, location, tags ,onClick}) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer w-full max-w-sm mx-auto hover:shadow-lg transition-all duration-300 px-3 pt-3 hover:scale-105" onClick={onClick}>
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-44 sm:h-52 md:h-60 object-cover rounded-md shadow-2xl"
      />

      <div className="p-4 space-y-2">
        {/* Name & Rating */}
        <div className="flex justify-between items-center">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
            {name}
          </h3>
          <div className="flex items-center gap-1 text-yellow-500 text-sm">
            <Star size={16} fill="currentColor" />
            <span>{rating}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-gray-500 truncate">
          <MapPin size={14} />
          <span>{location}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 text-xs">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-rose-400 text-white px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
