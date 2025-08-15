const Order = require("../models/order.model");
const Item = require("../models/items.model");
const User = require("../models/user.model");
const mongoose=require("mongoose")

// Helper function to find available delivery agent
const findAvailableAgent = async () => {
  try {
    // Find delivery agents who are not currently assigned to any active orders
    const availableAgents = await User.find({
      role: "deliveryAgent",
      isActive: true,
    });

    if (availableAgents.length === 0) return null;

    // Find agents with least active orders (load balancing)
    const agentWithLeastOrders = await User.aggregate([
      {
        $match: {
          role: "deliveryAgent",
          isActive: true,
        },
      },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "deliveryAgent",
          as: "activeOrders",
          pipeline: [
            {
              $match: {
                orderStatus: { $in: ["ready", "picked"] },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          activeOrderCount: { $size: "$activeOrders" },
        },
      },
      {
        $sort: { activeOrderCount: 1 },
      },
      {
        $limit: 1,
      },
    ]);

    return agentWithLeastOrders[0] || null;
  } catch (error) {
    console.error("Error finding available agent:", error);
    return null;
  }
};

const placeOrder = async (req, res) => {
  try {
    const { restaurantId, items, deliveryAddress } = req.body;
    const userId = req.userInfo.id;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Items required" });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const i of items) {
      const itemDoc = await Item.findById(i.itemId);
      if (!itemDoc) {
        return res
          .status(404)
          .json({ success: false, message: "Item not found" });
      }

      totalPrice += itemDoc.price * i.quantity;

      orderItems.push({
        item: itemDoc._id,
        quantity: i.quantity,
      });
    }

    // Find available delivery agent
    const availableAgent = await findAvailableAgent();

    // Calculate estimated delivery time (30-45 minutes from now)
    const estimatedDeliveryTime = new Date();
    estimatedDeliveryTime.setMinutes(estimatedDeliveryTime.getMinutes() + 35);

    const newOrder = await Order.create({
      customer: userId,
      restaurant: restaurantId,
      items: orderItems,
      totalPrice,
      deliveryAddress,
      deliveryAgent: availableAgent?._id || null,
      assignedAt: availableAgent ? new Date() : null,
      estimatedDeliveryTime,
    });

    // Populate the order with related data
    const populatedOrder = await Order.findById(newOrder._id)
      .populate("customer", "name email phone")
      .populate("restaurant", "name address")
      .populate("deliveryAgent", "name email phone")
      .populate("items.item", "name price image");

    res.status(201).json({
      success: true,
      message: availableAgent
        ? "Order placed and assigned to delivery agent successfully"
        : "Order placed successfully. Will be assigned to agent soon.",
      order: populatedOrder,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.userInfo.id;

    const orders = await Order.find({ customer: userId })
      .populate("items.item")
      .populate("restaurant")
      .populate("deliveryAgent", "name phone")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const userId = req.userInfo.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Check if user is authorized to update this order
    const isCustomer = order.customer.toString() === userId;
    const isDeliveryAgent = order.deliveryAgent?.toString() === userId;
    const isOwner = req.userInfo.role === "restaurantOwner";

    if (!isCustomer && !isDeliveryAgent && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this order",
      });
    }

    // Update timestamps based on status
    if (status === "picked" && !order.pickedAt) {
      order.pickedAt = new Date();
    } else if (status === "delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    order.orderStatus = status;
    await order.save();

    const updatedOrder = await Order.findById(orderId)
      .populate("customer", "name email phone")
      .populate("restaurant", "name address")
      .populate("deliveryAgent", "name phone")
      .populate("items.item");

    res.json({
      success: true,
      message: "Order status updated",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.userInfo.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.customer.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this order",
      });
    }

    if (
      order.orderStatus === "delivered" ||
      order.orderStatus === "cancelled" ||
      order.orderStatus === "picked"
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel an order that is already ${order.orderStatus}`,
      });
    }

    order.orderStatus = "cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// New controller functions for delivery agent management

const assignOrderToAgent = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { agentId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== "deliveryAgent") {
      return res.status(404).json({
        success: false,
        message: "Delivery agent not found",
      });
    }

    order.deliveryAgent = agentId;
    order.assignedAt = new Date();
    await order.save();

    const updatedOrder = await Order.findById(orderId)
      .populate("deliveryAgent", "name phone email")
      .populate("customer", "name phone")
      .populate("restaurant", "name address");

    res.json({
      success: true,
      message: "Order assigned to delivery agent successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAgentOrders = async (req, res) => {
  try {
    const agentId = req.userInfo.id;

    // Check if user is a delivery agent
    if (req.userInfo.role !== "deliveryAgent") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only delivery agents can access this.",
      });
    }

    const orders = await Order.find({
      deliveryAgent: agentId,
      orderStatus: { $in: ["ready", "picked"] },
    })
      .populate("customer", "name phone address")
      .populate("restaurant", "name address phone")
      .populate("items.item", "name price")
      .sort({ assignedAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAvailableOrders = async (req, res) => {
  try {
    // Only delivery agents can access this
    if (req.userInfo.role !== "deliveryAgent") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only delivery agents can access this.",
      });
    }

    const availableOrders = await Order.find({
      deliveryAgent: null,
      orderStatus: "ready",
    })
      .populate("customer", "name phone")
      .populate("restaurant", "name address")
      .populate("items.item", "name price")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      orders: availableOrders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getRestaurantOrders = async (req, res) => {
  try {
    // const restaurantId = req.restaurantId || req.query.restaurantId;
    const restaurantId = req.params.id;
    if (!restaurantId) {
      return res
        .status(400)
        .json({ success: false, message: "Restaurant ID required" });
    }

    const statusFilter = req.query.status; // e.g., "placed", "ready", etc.
    const search = req.query.search?.trim(); // order ID or customer name

    const baseMatch = {
      restaurant: new mongoose.Types.ObjectId(restaurantId),
    };
    if (statusFilter) baseMatch.orderStatus = statusFilter;

    let orders = [];

    if (search) {
      // Aggregation to support customer name or order ID search
      const pipeline = [
        { $match: baseMatch },
        {
          $lookup: {
            from: "users",
            localField: "customer",
            foreignField: "_id",
            as: "customer",
          },
        },
        { $unwind: "$customer" },
        {
          $match: {
            $or: [
              { _id: { $regex: search, $options: "i" } },
              { "customer.name": { $regex: search, $options: "i" } },
            ],
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $project: {
            customer: { name: 1, phone: 1, _id: 1 },
            orderStatus: 1,
            totalPrice: 1,
            createdAt: 1,
            _id: 1,
            // include other necessary fields here
          },
        },
      ];

      orders = await Order.aggregate(pipeline);
    } else {
      orders = await Order.find(baseMatch)
        .sort({ createdAt: -1 })
        .populate("customer", "name phone email")
        .populate("items.item", "name price") // <-- this line populates item details
        .lean();
    }

    // Summary stats (grouped by status + totals)
    const statsAgg = await Order.aggregate([
      { $match: { restaurant: new mongoose.Types.ObjectId(restaurantId) } },
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0),
      byStatus: {},
    };
    statsAgg.forEach((s) => {
      stats.byStatus[s._id] = {
        count: s.count,
        revenue: s.revenue,
      };
    });

    return res.json({
      success: true,
      data: {
        orders,
        stats,
      },
    });
  } catch (err) {
    console.error("getRestaurantOrders error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};


const pickupOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const agentId = req.userInfo.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order is available for pickup
    if (order.deliveryAgent && order.deliveryAgent.toString() !== agentId) {
      return res.status(400).json({
        success: false,
        message: "Order is already assigned to another agent",
      });
    }

    if (order.orderStatus !== "ready") {
      return res.status(400).json({
        success: false,
        message: "Order is not ready for pickup",
      });
    }

    // Assign agent if not already assigned
    if (!order.deliveryAgent) {
      order.deliveryAgent = agentId;
      order.assignedAt = new Date();
    }

    order.orderStatus = "picked";
    order.pickedAt = new Date();
    await order.save();

    const updatedOrder = await Order.findById(orderId)
      .populate("customer", "name phone")
      .populate("restaurant", "name address")
      .populate("items.item", "name price");

    res.json({
      success: true,
      message: "Order picked up successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  updateOrderStatus,
  cancelOrder,
  assignOrderToAgent,
  getAgentOrders,
  getAvailableOrders,
  pickupOrder,
  getRestaurantOrders
};
