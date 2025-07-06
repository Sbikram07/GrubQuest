import React from "react";

const RestaurantCard = ({ restaurant }) => {
  const {
    restaurantName,
    address,
    type,
    parkingLot,
    restaurantImage,
  } = restaurant;

  return (
    <div className="max-w-sm rounded-2xl overflow-hidden shadow-md bg-white hover:shadow-xl transition-shadow duration-300">
      <img
        className="w-full h-48 object-cover"
        src={restaurantImage}
        alt={restaurantName}
        onError={(e) =>
          (e.target.src =
            "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg")
        }
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{restaurantName}</h3>
        <p className="text-sm text-gray-600 mb-1">{address}</p>
        <p className="text-sm text-gray-700 mb-2">
          Cuisine: <span className="font-medium">{type}</span>
        </p>
        <div className="text-sm">
          <span
            className={`inline-block px-2 py-1 rounded-full ${
              parkingLot ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {parkingLot ? "Parking Available" : "No Parking"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
