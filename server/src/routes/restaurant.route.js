const express = require("express");
const router = express.Router();

const {
  addRestaurant,
  getAllRestaurants,
  getRestaurantById,
  deleteRestaurant,
  updateRestaurant,
  RestaurantByOwner
} = require("../controller/restaurant.controller");

const requireLogin = require("../middleware/requireLogin");
const authorized = require("../middleware/authorized.middleware");
const upload = require("../middleware/multer.middleware"); 
const verifyRestaurantOwnership = require("../middleware/verifyRestaurantOwnership.middleware");

// CREATE - Upload image and create restaurant (only user/admin can create)
router.post(
  "/create",
  requireLogin,
  upload.single("image"), 
 addRestaurant
);

// READ - Public access
router.get("/getall", getAllRestaurants);
router.get("/get/:id", getRestaurantById);
router.get("/getby/owned",requireLogin,authorized("restaurantOwner"),RestaurantByOwner)

// UPDATE - Owner/Admin only
router.put(
  "/update/:id",
  requireLogin,
  authorized("restaurantOwner", "admin"),
  upload.single("image"), 
  updateRestaurant
);

// DELETE - Owner/Admin only
router.delete(
  "/delete/:id",
  requireLogin,
  authorized("restaurantOwner", "admin"),
  deleteRestaurant
);

module.exports = router;
