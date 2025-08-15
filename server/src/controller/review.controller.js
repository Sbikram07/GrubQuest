const Review = require("../models/review.model");
const Restaurant = require("../models/restaurant.model");
const Item = require("../models/items.model");
const mongoose=require("mongoose")
// Create review for item or restaurant

const createReview = async (req, res) => {
  try {
    const { restaurantId, itemId, rating, comment } = req.body;
    const userId = req.userInfo.id;

    if (!rating || (!restaurantId && !itemId)) {
      return res.status(400).json({
        success: false,
        message: "Rating and either restaurantId or itemId is required",
      });
    }

    // Prevent duplicate review
    const existingReview = await Review.findOne({
      user: userId,
      ...(restaurantId ? { restaurant: restaurantId } : {}),
      ...(itemId ? { item: itemId } : {}),
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this item/restaurant",
      });
    }

    // Save review
    const review = await Review.create({
      user: userId,
      restaurant: restaurantId || null,
      item: itemId || null,
      rating: Number(rating),
      comment,
    });

    // Update average rating
    if (restaurantId) {
      const stats = await Review.aggregate([
        { $match: { restaurant: new mongoose.Types.ObjectId(restaurantId) } },
        { $group: { _id: "$restaurant", avgRating: { $avg: "$rating" } } },
      ]);
      // console.log("Restaurant Stats:", stats);
      await Restaurant.findByIdAndUpdate(restaurantId, {
        rating: stats.length > 0 ? stats[0].avgRating : 0,
      });
    } else if (itemId) {
      const stats = await Review.aggregate([
        { $match: { item: new mongoose.Types.ObjectId(itemId) } },
        { $group: { _id: "$item", avgRating: { $avg: "$rating" } } },
      ]);
      // console.log("Item Stats:", stats);
      await Item.findByIdAndUpdate(itemId, {
        rating: stats.length > 0 ? stats[0].avgRating : 0,
      });
    }

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all reviews for a restaurant
const getRestaurantReviews = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const reviews = await Review.find({ restaurant: restaurantId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all reviews for an item
const getItemReviews = async (req, res) => {
  try {
    const { itemId } = req.params;
    const reviews = await Review.find({ item: itemId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.userInfo.id;
    const role = req.userInfo.role;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    if (review.user.toString() !== userId && role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await Review.findByIdAndDelete(reviewId);
    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createReview,
  getRestaurantReviews,
  getItemReviews,
  deleteReview,
};
