import React, { useState } from "react";

const sampleFilters = [
  "All",
  "Offers",
  "Fast Delivery",
  "Veg Only",
  "Non-Veg",
  "Rating 4.0+",
  "Pure Veg",
  "New Arrivals",
  "Low Cost",
  "Top Rated",
  "Nearby",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Desserts",
  "Drinks",
  "Street Food",
  "Biryani",
  "Pizza",
  "Burger",
  "Chinese",
  "North Indian",
  "South Indian",
  "Mughlai",
  "Tandoori",
  "Paneer Dishes",
  "Seafood",
  "Healthy",
  "Quick Bites",
  "Family Meals",
  "Combo Meals",
];
const FilterChips = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const handleClick = (filter) => {
    setSelectedFilter(filter);
    // Optional: trigger a callback or filter function
  };

  return (
    <div className="w-full overflow-x-auto px-4 py-3 scrollbar-hide">
      <div className="flex gap-3">
        {sampleFilters.map((filter, index) => (
          <button
            key={index}
            onClick={() => handleClick(filter)}
            className={`px-4 py-2 text-sm rounded-full border 
              ${
                selectedFilter === filter
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-700 border-gray-300"
              } 
              hover:shadow-md whitespace-nowrap transition`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterChips;
