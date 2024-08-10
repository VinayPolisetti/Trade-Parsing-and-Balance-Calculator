const express = require("express");

const balanceController = require("../controllers/balanceController");

const router = express.Router();

// Route for getting asset balance at a specific timestamp
router.get("/timestamp", balanceController.getAssetBalanceAtTimestamp);

module.exports = router;
