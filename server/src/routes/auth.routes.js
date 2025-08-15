const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
} = require("../controller/auth.controller");
const requireLogin = require("../middleware/requireLogin");

// PUBLIC ROUTES
router.post("/register", register);
router.post("/login", login);

// PROTECTED ROUTES
router.get("/me", requireLogin, getMe);
router.post("/logout", requireLogin, logout);

module.exports = router;
