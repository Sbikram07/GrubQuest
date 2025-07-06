import React from "react";

const ReviewCard = ({ review }) => {
  const { name, photo, review: text } = review;

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl p-4 flex flex-col gap-3 border border-gray-100 h-[200px]">
      <div className="flex items-center gap-4">
        <img
          src={photo}
          alt={name}
          onError={(e) =>
            (e.target.src =
              "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png")
          }
          className="w-12 h-12 rounded-full object-cover border"
        />
        <div>
          <h4 className="text-md font-semibold text-gray-800">{name}</h4>
          <p className="text-xs text-gray-500">Verified Diner</p>
        </div>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">“{text}”</p>
    </div>
  );
};

export default ReviewCard;
