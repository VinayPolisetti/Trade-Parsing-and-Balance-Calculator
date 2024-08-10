const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: [true, 'User ID is required'],
    min: [1, 'User ID must be a positive number'],
  },
  timestamp: {
    type: Date,
    required: [true, 'Timestamp is required'],
    validate: {
      validator: function (v) {
        return !isNaN(v.getTime());
      },
      message: 'Invalid timestamp',
    },
  },
  balances: {
    type: Map,
    of: Number,
    required: [true, 'Balances are required'],
    validate: {
      validator: function (value) {
        return (
          value instanceof Map &&
          [...value.entries()].every(([key, balance]) =>
            typeof key === 'string' && typeof balance === 'number'
          )
        );
      },
      message: 'Balances must be a Map with string keys and number values',
    },
  },
});

// Index on timestamp for efficient querying
balanceSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Balance', balanceSchema);
