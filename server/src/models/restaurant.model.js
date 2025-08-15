const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Restaurant name is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    required: [true, "Restaurant address is required"],
  },
  image: {
    url: {
      type: String,
      required: [true, "Restaurant image URL is required"],
    },
    publicId: {
      type: String,
      required: [true, "Restaurant image publicId is required"],
    },
  },
  rating: {
    type: Number,
    default: 0,
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Restaurant must have an owner"],
  },
  tags:{
    type:[String],
    default:[]

  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;
