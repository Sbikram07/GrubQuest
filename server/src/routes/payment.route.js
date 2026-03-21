const express = require("express");
const router = express.Router();
const {
  createCheckoutSession,
  
} = require("../controller/payment.controller");
router.post("/create-payment", createCheckoutSession);

module.exports = router;
