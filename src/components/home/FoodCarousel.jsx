import React, { useEffect, useState } from "react";
import "keen-slider/keen-slider.min.css";
import imageUrls from "../../data/imageUrls"; // adjust path if needed
import fallbackImage from "../../assets/fallback.jpeg";

const FoodCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Circular loop
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === imageUrls.length - 1 ? 0 : prev + 1
      );
    }, 2500); // change image every 2.5s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[300px] px-3.5 py-4 md:h-[500px] overflow-hidden  rounded-xl">

      <img
        src={imageUrls[currentIndex]}
        alt={`Food ${currentIndex + 1}`}
        className="w-full h-full object-cover transition duration-700 ease-in-out rounded-2xl"
        onError={(e) =>
          (e.target.src = fallbackImage) // must exist in public/
        }
      />
    </div>
  );
};

export default FoodCarousel;
