const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "restaurantOwner", "deliveryAgent"],
      default: "user",
    },
    avatar: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dhiv7nn03/image/upload/v1753718550/GrubQuest/restaurants/rryvhejlcq826gpoklv0.jpg",
      },
      publicId: String,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    // Delivery agent specific fields
    isActive: {
      type: Boolean,
      default: true,
    },
    vehicleType: {
      type: String,
      enum: ["bike", "scooter", "bicycle", "car","NA"],
      default: "NA",
    },
    vehicleNumber: {
      type: String,
      default: null,
    },
    currentLocation: {
      latitude: {
        type: Number,
        default: null,
      },
      longitude: {
        type: Number,
        default: null,
      },
    },
    totalDeliveries: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema)
