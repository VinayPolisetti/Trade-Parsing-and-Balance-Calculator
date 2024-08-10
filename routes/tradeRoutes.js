const express = require("express");

const tradeController = require("../controllers/tradeController");
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Route for uploading trade CSV file in the file feild of form-data
router.post("/upload", upload.single('file'), tradeController.uploadTradeDataCSV);

module.exports = router;
