const express = require("express");
require("dotenv").config()
const Authroute = require("./src/routes/auth.routes");
const restaurantRouter = require("./src/routes/restaurant.route");
const itemRoute = require("./src/routes/item.route");
const orderRoute = require("./src/routes/order.route");
const userRoute = require("./src/routes/user.route");
const reviewRoute = require("./src/routes/review.route");
const deliveryAgentRoute = require("./src/routes/deliveryAgent.route");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");

app.use(cookieParser());
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : ["http://localhost:5173", "http://localhost:3000"],

    credentials: true,
  })
);

// Routes
app.use("/api/auth", Authroute);
app.use("/api/restaurants", restaurantRouter);
app.use("/api/items", itemRoute);
app.use("/api/review", reviewRoute);
app.use("/api/order", orderRoute);
app.use("/api/user", userRoute);
app.use("/api/delivery-agent", deliveryAgentRoute);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;
