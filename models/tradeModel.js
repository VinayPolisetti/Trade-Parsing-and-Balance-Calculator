const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: [true, 'User ID is required'],
    min: [1, 'User ID must be a positive number'],
  },
  utcTime: {
    type: Date,
    required: [true, 'UTC Time is required'],
    validate: {
      validator: function (v) {
        return !isNaN(v.getTime());
      },
      message: 'Invalid timestamp',
    },
  },
  operation: {
    type: String,
    enum: ['Buy', 'Sell'],
    required: [true, 'Operation type is required'],
  },
  market: {
    type: String,
    required: [true, 'Market is required'],
    validate: {
      validator: function (market) {
        const parts = market.split('/');
        return parts.length === 2 && parts[0].trim() !== '' && parts[1].trim() !== '';
      },
      message: 'Market must be in the format BASE/QUOTE, where BASE and QUOTE are non-empty strings',
    },
  },
  baseCoin: {
    type: String,
    required: [true, 'Base Coin is required'],
  },
  quoteCoin: {
    type: String,
    required: [true, 'Quote Coin is required'],
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be a positive number'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be a positive number'],
  },
});

module.exports = mongoose.model('Trade', tradeSchema);
