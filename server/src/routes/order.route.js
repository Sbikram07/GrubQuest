const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  updateOrderStatus,
  cancelOrder,
  assignOrderToAgent,
  getAgentOrders,
  getAvailableOrders,
  pickupOrder,
  orderyByRestaurant,
  getRestaurantOrders,
} = require("../controller/order.controller");
const requireLogin = require("../middleware/requireLogin");
const authorized = require("../middleware/authorized.middleware");

// Customer routes
router.post("/place", requireLogin, placeOrder);
router.get("/my-orders", requireLogin, getMyOrders);
router.delete("/:orderId/cancel", requireLogin, cancelOrder);

// General order status update (customer, agent, admin)
router.put("/status/:orderId", requireLogin, updateOrderStatus);

// Admin routes for order management
router.put(
  "/assign/:orderId",
  requireLogin,
  authorized("admin"),
  assignOrderToAgent
);

// Delivery agent routes
router.get(
  "/agent/my-orders",
  requireLogin,
  authorized("deliveryAgent"),
  getAgentOrders
);
router.get(
  "/agent/available",
  requireLogin,
  authorized("deliveryAgent"),
  getAvailableOrders
);
router.put(
  "/agent/pickup/:orderId",
  requireLogin,
  authorized("deliveryAgent"),
  pickupOrder
);
router.get("/restaurant/:id",requireLogin,getRestaurantOrders)

module.exports = router;
