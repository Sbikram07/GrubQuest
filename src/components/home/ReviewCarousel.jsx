import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import ReviewCard from "./ReviewCard"; // Ensure path is correct

const ReviewCarousel = ({ reviews }) => {
  const [sliderRef] = useKeenSlider({
    loop: true,
    mode: "free-snap",
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 2, spacing: 16 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 3, spacing: 20 },
      },
    },
  });

  return (
    <div className="p-4 bg-neutral-50 rounded-2xl shadow-sm">
      <h2 className="text-center text-2xl  font-bold mb-4 text-gray-800">What Our Customers Say</h2>
      <div ref={sliderRef} className="keen-slider">
        {reviews.map((review, index) => (
          <div key={index} className="keen-slider__slide px-2">
            <ReviewCard review={review} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewCarousel;
