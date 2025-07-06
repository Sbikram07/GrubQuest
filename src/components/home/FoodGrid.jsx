import React from "react";
import FoodCard from "./FoodCard";
import foodItems from "../../data/resturantItems.json"; // alias OR use relative path

const FoodGrid = () => {
  return (
    <div className="px-4 py-6 bg-orange-50 rounded-2xl border-amber-100 shadow-amber-200 shadow-2xs">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Popular Dishes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {foodItems.map((item) => (
          <FoodCard key={item.itemID} item={item} />
        ))}
      </div>
    </div>
  );
};

export default FoodGrid;
