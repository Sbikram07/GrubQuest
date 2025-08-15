const express = require("express");
const router = express.Router();
const {
  addItem,
  updateItem,
  deleteItem,
  getItemsByRestaurant,
  getItemsByCategory,
  allItem,
  getItemById,
} = require("../controller/items.controller");

const requireLogin = require("../middleware/requireLogin");
const verifyRestaurantOwnershipMiddleware = require("../middleware/verifyRestaurantOwnership.middleware"); // To verify restaurant ownership
const upload = require("../middleware/multer.middleware"); // For image upload if used

// 🔐 Protected routes for owners (Create, Update, Delete)
router.post(
  "/add/:restaurantId",
  requireLogin,
  verifyRestaurantOwnershipMiddleware,
  upload.single("image"),
  addItem
);

router.put(
  "/:restaurantId/update/:itemId",
  requireLogin,
  verifyRestaurantOwnershipMiddleware,
  upload.single("image"),
  updateItem
);

router.delete(
  "/:restaurantId/delete/:itemId",
  requireLogin,
  verifyRestaurantOwnershipMiddleware,
  deleteItem
);

// 📦 Public routes (View)
router.get("/restaurant/:restaurantId", getItemsByRestaurant);
router.get("/category/:category", getItemsByCategory);
router.get("/allitems", allItem);
router.get("/get/:id", getItemById);

module.exports = router;
