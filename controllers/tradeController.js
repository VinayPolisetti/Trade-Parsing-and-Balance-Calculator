const fs = require('fs');

const Trade = require('../models/tradeModel');
const Balance = require('../models/balanceModel');

const { insertTrades } = require('../services/tardeService');
const { updateBalances } = require('../services/balanceService');
const {  processCSVTradeData } = require('../utils/csvUtils')

// Handler for uploading and processing trade data from a CSV file
exports.uploadTradeDataCSV = async (req, res) => {
  // Check if multer middlewarwe succeeded and a file is present
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Extract trade data from CSV in db format
    const trades = await processCSVTradeData(req.file.path);

    // Clear existing trade and balance data to avoid collision and confusion with multiple csv files
    await Trade.deleteMany({});
    await Balance.deleteMany({});

    // Insert the new trade data and update balance respectively
    await insertTrades(trades);
    await updateBalances(trades);

    // Respond with a message
    res.status(201).send('File processed and data stored');
  } catch (error) {
    console.error('Error processing file and storing :', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
