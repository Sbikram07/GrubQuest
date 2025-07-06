import React from "react";

import fallbackImage from "../../assets/fallback.jpeg";; // public/fallback.jpeg

const FoodCard = ({ item }) => {
  const {
    itemName,
    itemDescription,
    itemPrice,
    restaurantName,
    imageUrl,
  } = item;

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden transition p-4">
      <img
        src={imageUrl && imageUrl.trim() !== "" ? imageUrl : fallbackImage}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallbackImage;
        }}
        alt={itemName}
        className="w-full h-70 object-cover rounded-xl"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{itemName}</h3>
        <p className="text-sm text-gray-600 truncate">{itemDescription}</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-orange-500 font-bold">₹{itemPrice}</span>
          <span className="text-xs italic text-gray-500">
            {restaurantName}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
