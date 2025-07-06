import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import RestaurantCard from "./RestaurantCard"; // ensure the path is correct

const RestaurantCarousel = ({ restaurants }) => {
  const [sliderRef] = useKeenSlider({
    loop: true,
    mode: "free-snap",
    slides: {
      perView: 1.2, // partial next card visible
      spacing: 12,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 2.2, spacing: 16 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 3.2, spacing: 20 },
      },
      "(min-width: 1280px)": {
        slides: { perView: 4, spacing: 20 },
      },
    },
  });

  return (
    <div className="px-4 py-6 bg-neutral-100 rounded-3xl shadow-inner">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Top Restaurants</h2>
      <div ref={sliderRef} className="keen-slider">
        {restaurants.map((restaurant, index) => (
          <div
            key={`${restaurant.restaurantID}-${index}`}
            className="keen-slider__slide"
          >
            <div className="h-full">
              <RestaurantCard restaurant={restaurant} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantCarousel;
