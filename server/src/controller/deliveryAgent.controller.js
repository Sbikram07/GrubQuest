const mongoose = require("mongoose")
const User = require("../models/user.model")
const Order = require("../models/order.model")

// Get delivery agent dashboard data
const getAgentDashboard = async (req, res) => {
  try {
    const agentId = req.userInfo.id

    // Get agent details
    const agent = await User.findById(agentId).select("-password")

    // Get assigned orders (ready for pickup)
    const assignedOrders = await Order.find({
      deliveryAgent: agentId,
      orderStatus: "ready",
    })
      .populate("restaurant", "name address phone")
      .populate("customer", "name phone")
      .sort({ assignedAt: 1 })

    // Get picked orders (in transit)
    const pickedOrders = await Order.find({
      deliveryAgent: agentId,
      orderStatus: "picked",
    })
      .populate("customer", "name phone address")
      .populate("restaurant", "name address")
      .sort({ pickedAt: 1 })

    // Get delivery statistics
    const stats = await Order.aggregate([
      { $match: { deliveryAgent: new mongoose.Types.ObjectId(agentId) } },
      {
        $group: {
          _id: null,
          totalDeliveries: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "delivered"] }, 1, 0] },
          },
          totalEarnings: {
            $sum: {
              $cond: [
                { $eq: ["$orderStatus", "delivered"] },
                { $multiply: ["$totalPrice", 0.1] }, // 10% commission
                0,
              ],
            },
          },
          activeOrders: {
            $sum: {
              $cond: [{ $in: ["$orderStatus", ["ready", "picked"]] }, 1, 0],
            },
          },
        },
      },
    ])

    res.json({
      success: true,
      data: {
        agent,
        assignedOrders,
        pickedOrders,
        stats: stats[0] || {
          totalDeliveries: 0,
          totalEarnings: 0,
          activeOrders: 0,
        },
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Update agent availability status
const updateAvailability = async (req, res) => {
  try {
    const agentId = req.userInfo.id
    const { isActive } = req.body

    const agent = await User.findByIdAndUpdate(agentId, { isActive }, { new: true }).select("-password")

    res.json({
      success: true,
      message: `Agent status updated to ${isActive ? "active" : "inactive"}`,
      agent,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Update agent location
const updateLocation = async (req, res) => {
  try {
    const agentId = req.userInfo.id
    const { latitude, longitude } = req.body

    const agent = await User.findByIdAndUpdate(
      agentId,
      {
        currentLocation: { latitude, longitude },
      },
      { new: true },
    ).select("-password")

    res.json({
      success: true,
      message: "Location updated successfully",
      agent,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get delivery history
const getDeliveryHistory = async (req, res) => {
  try {
    const agentId = req.userInfo.id
    const { page = 1, limit = 10 } = req.query

    const deliveries = await Order.find({
      deliveryAgent: agentId,
      orderStatus: "delivered",
    })
      .populate("customer", "name")
      .populate("restaurant", "name")
      .sort({ deliveredAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Order.countDocuments({
      deliveryAgent: agentId,
      orderStatus: "delivered",
    })

    res.json({
      success: true,
      deliveries,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  getAgentDashboard,
  updateAvailability,
  updateLocation,
  getDeliveryHistory,
}
