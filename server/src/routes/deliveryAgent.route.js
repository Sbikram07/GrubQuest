const express = require("express")
const router = express.Router()
const {
  getAgentDashboard,
  updateAvailability,
  updateLocation,
  getDeliveryHistory,
} = require("../controller/deliveryAgent.controller")
const requireLogin = require("../middleware/requireLogin")
const authorized = require("../middleware/authorized.middleware")

// All routes require delivery agent role
router.use(requireLogin)
router.use(authorized("deliveryAgent"))

// Dashboard and profile routes
router.get("/dashboard", getAgentDashboard)
router.put("/availability", updateAvailability)
router.put("/location", updateLocation)
router.get("/history", getDeliveryHistory)

module.exports = router

