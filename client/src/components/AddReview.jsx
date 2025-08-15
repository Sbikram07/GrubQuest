// components/reviews/AddReview.jsx
"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export default function AddReview({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  const handleRating = (value) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (rating && text.trim()) {
      onSubmit?.({ rating, text });
      setRating(0);
      setText("");
    }
  };

  return (
    <div className="border rounded-xl p-4 shadow-md bg-white dark:bg-neutral-900 space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
        Leave a Review
      </h3>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-6 h-6 cursor-pointer ${
              i <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
            onClick={() => handleRating(i)}
            fill={i <= rating ? "#facc15" : "none"}
          />
        ))}
      </div>
      <Textarea
        placeholder="Share your experience..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[100px]"
      />
      <Button onClick={handleSubmit} disabled={!rating || !text.trim()}>
        Submit Review
      </Button>
    </div>
  );
}
