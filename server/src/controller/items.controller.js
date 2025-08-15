const Item = require("../models/items.model");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utility/cloudinary.helper");

const allItem = async (req, res) => {
  try {
    const allitems = await Item.find().populate("restaurant"); // ✅ Await the query

    res.status(200).json({
      success: true,
      message: "All items fetched successfully",
      allitems,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

const addItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const restaurantId = req.params.restaurantId;
    // console.log("body:", name, price, description, category);
    // console.log("file:", req.file);

    if (!name || !price || !category || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Name, price, category, and image are required",
      });
    }

    const { url, publicId } = await uploadToCloudinary(
      req.file.path,
      "GrubQuest/items"
    );

    const item = await Item.create({
      name,
      description,
      price,
      category,
      image: { url, publicId },
      restaurant: restaurantId,
    });

    res.status(201).json({
      success: true,
      message: "Item added successfully",
      item,
    });
  } catch (err) {
    // console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    // You can also check here if item.restaurant belongs to req.userInfo.id (if middleware not used)

    const { name, description, price, category } = req.body;

    if (req.file) {
      // Optionally delete old image from Cloudinary
      // await deleteFromCloudinary(item.image.publicId);
      const { url, publicId } = await uploadToCloudinary(
        req.file.path,
        "GrubQuest/items"
      );
      item.image = { url, publicId };
    }

    item.name = name || item.name;
    item.description = description || item.description;
    item.price = price || item.price;
    item.category = category || item.category;

    await item.save();

    res.status(200).json({ success: true, message: "Item updated", item });
  } catch (err) {
    // console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    // Optionally delete image from Cloudinary
    await deleteFromCloudinary(item.image.publicId);

    await item.deleteOne();

    res.status(200).json({ success: true, message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const getItemsByRestaurant = async (req, res) => {
  try {
    const items = await Item.find({ restaurant: req.params.restaurantId });
    res.status(200).json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Split by hyphen to separate category and possible name
    const [mainCategory, ...nameParts] = category.toLowerCase().split("-");
    const nameSearch = nameParts.join(" ");

    // Build query
    const query = {
      category: mainCategory,
    };

    if (nameSearch) {
      query.name = { $regex: nameSearch, $options: "i" }; // case-insensitive name match
    }

    const items = await Item.find(query).populate("restaurant");

    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No items found in the "${category}" category`,
      });
    }

    res.status(200).json({
      success: true,
      items,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getItemById = async (req, res) => {
  try {
    const itemId = req.params.id;
    // console.log(itemId);
    const item = await Item.findById(itemId).populate("restaurant"); // populate restaurant details

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    // console.log(item);
    return res.status(200).json({ success: true, item });
  } catch (error) {
    console.error("Error fetching item by ID:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  allItem,
  addItem,
  updateItem,
  deleteItem,
  getItemsByRestaurant,
  getItemsByCategory,
  getItemById,
};
