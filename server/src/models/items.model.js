const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Item price is required"],
      min: [0, "Price must be greater than or equal to 0"],
    },
    image: {
      url: {
        type: String,
        required: [true, "Item image URL is required"],
      },
      publicId: {
        type: String,
        required: [true, "Item image publicId is required"],
      },
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: [true, "Each item must belong to a restaurant"],
    },
    category: {
      type: String,
      trim: true,
    },
    rating:{
      type:Number,
      max:5,
      min:0,
      default:0,
      reqired:true
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Item", itemSchema);
