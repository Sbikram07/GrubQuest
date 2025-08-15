const Restaurant = require("../models/restaurant.model");
const User = require("../models/user.model");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utility/cloudinary.helper");

// @desc    Add new restaurant
// @route   POST /api/restaurants
// @access  Private (Admin/Owner)
const addRestaurant = async (req, res) => {
  try {
    const { name, description, address } = req.body;
    const tags=req.body.tags? JSON.parse(req.body.tags):[]

    // console.log("Body:", req.body);
    // console.log("File:", req.file);
    // console.log("User Info:", req.userInfo);

    if (!name || !address || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Name, address, and image are required",
      });
    }

    const { url, publicId } = await uploadToCloudinary(
      req.file.path,
      "GrubQuest/restaurants"
    );
    // console.log("Uploaded Image:", { url, publicId });

    const restaurant = await Restaurant.create({
      name,
      description,
      address,
      image: { url, publicId },
      owner: req.userInfo.id,
      tags
    });

    const user = await User.findById(req.userInfo.id);
    if (user.role === "user") {
      user.role = "restaurantOwner";
      await user.save();
    }

    return res.status(201).json({ success: true, data: restaurant });
  } catch (error) {
    console.error("Restaurant creation failed:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    return res.status(200).json({ success: true, data: restaurants });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get restaurant by ID
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = async (req, res) => {
  try {
    const idr = req.params.id;
    // console.log(idr);
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }
        // console.log(restaurant);
    return res.status(200).json({ success: true, data: restaurant });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private (Admin/Owner)
const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    if (
      restaurant.owner.toString() !== req.userInfo.id.toString() &&
      req.userInfo.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Delete image from Cloudinary
    await deleteFromCloudinary(restaurant.image.publicId);

    // Delete restaurant
    await restaurant.deleteOne();

    // Role demotion if no restaurants left
    const remaining = await Restaurant.countDocuments({
      owner: req.userInfo.id,
    });
    if (remaining === 0) {
      const user = await User.findById(req.userInfo.id);
      if (user.role === "restaurantOwner") {
        user.role = "user";
        await user.save();
      }
    }

    return res
      .status(200)
      .json({ success: true, message: "Restaurant deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private (Admin/Owner)
const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    if (
      restaurant.owner.toString() !== req.userInfo.id.toString() &&
      req.userInfo.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Handle image replacement
    if (req.file) {
      await deleteFromCloudinary(restaurant.image.publicId);
      const { url, publicId } = await uploadToCloudinary(req.file.path,"GrubQuest/restaurants");
      req.body.image = { url, publicId };
    }

    const updated = await Restaurant.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ success: false, message: "Update failed" });
  }
};

const RestaurantByOwner = async (req, res) => {
  try {
    // Ensure the user info exists
    const userId = req.userInfo.id;
    // console.log(req.userInfo);
    // Fetch restaurants where owner matches the logged-in user's ID
    const restaurants = await Restaurant.find({ owner: userId });

    return res.status(200).json({
      success: true,
      message: "Owned restaurants fetched successfully",
      data: restaurants,
    });
  } catch (error) {
    console.error("Error fetching owned restaurants:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch owned restaurants",
    });
  }
};



module.exports = {
  addRestaurant,
  getAllRestaurants,
  getRestaurantById,
  deleteRestaurant,
  updateRestaurant,
  RestaurantByOwner
};
