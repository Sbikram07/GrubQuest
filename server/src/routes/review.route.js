const express = require("express");
const router = express.Router();
const {
  createReview,
  getRestaurantReviews,
  getItemReviews,
  deleteReview,
} = require("../controller/review.controller");

const requireLogin = require("../middleware/requireLogin");

// Create review
router.post("/create", requireLogin, createReview);

// Get reviews for a restaurant
router.get("/restaurant/:restaurantId", getRestaurantReviews);

// Get reviews for an item
router.get("/item/:itemId", getItemReviews);

// Delete a review
router.delete("/:reviewId", requireLogin, deleteReview);

module.exports = router;
