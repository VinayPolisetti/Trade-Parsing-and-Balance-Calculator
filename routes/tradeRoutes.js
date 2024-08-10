const express = require("express");

const tradeController = require("../controllers/tradeController");

const router = express.Router();

// Route for uploading trade CSV file in the file feild of form-data
router.post("/upload", tradeController.uploadTradeDataCSV);

module.exports = router;
