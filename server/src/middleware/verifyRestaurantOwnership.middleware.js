// src/middleware/verifyRestaurantOwnership.js
const Restaurant = require("../models/restaurant.model");

const verifyRestaurantOwnership = async (req, res, next) => {
  try {
    const restaurantId = req.params.restaurantId || req.body.restaurantId;
    // const restaurantId =  req.body.restaurantId;
    const userId = req.userInfo.id;

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: "Restaurant ID is required for this action",
      });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    if (restaurant.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to perform this action on this restaurant",
      });
    }

    req.restaurant = restaurant; // pass the restaurant doc to next middleware/controller
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = verifyRestaurantOwnership;
