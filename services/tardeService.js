const fs = require('fs');
const csv = require('csv-parser');

const Trade = require('../models/tradeModel');

// Function to insert trades into the database
exports.insertTrades = async (trades) => {
  try {
    // Sort trades by their timestamp in ascending order to ensure they are processed in chronological order
    trades.sort((a, b) => new Date(a.utcTime) - new Date(b.utcTime));

    // Insert the trades into db
    await Trade.insertMany(trades);
  } catch (error) {
    // Any errors including validation will be caught here
    throw new Error('Error inserting trades: ' + error.message);
  }
};

  