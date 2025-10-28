const express = require("express");
const router = express.Router();
const paystackWebhook = require("../middleware/Paystack");

// must use express.raw or express.json depending on setup
router.post("/paystack/webhook", express.json({ type: "*/*" }), paystackWebhook);

module.exports = router;
