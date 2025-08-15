const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// At least one of restaurant or item is required
reviewSchema.pre("validate", function (next) {
  if (!this.restaurant && !this.item) {
    next(new Error("Review must be for either a restaurant or an item."));
  } else {
    next();
  }
});

module.exports = mongoose.model("Review", reviewSchema);
