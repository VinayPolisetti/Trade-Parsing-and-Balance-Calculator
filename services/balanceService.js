const Balance = require('../models/balanceModel');

// Function to update balances based on trades
exports.updateBalances = async (trades) => {
  const userBalances = new Map();

  for (const trade of trades) {
    const { userId, utcTime: timestamp, operation, baseCoin, amount } = trade;
    
    const operationMultiplier = operation === 'Buy' ? 1 : -1;

    // Initialize user map if not present
    if (!userBalances.has(userId)) {
      userBalances.set(userId, new Map());
    }

    // Update the user's asset baalnce wrt trade
    const userBalanceMap = userBalances.get(userId);
    const currentBalance = userBalanceMap.get(baseCoin) || 0;
    userBalanceMap.set(baseCoin, currentBalance + (operationMultiplier * amount));

    // Create a new balance document
    const newBalanceDoc = new Balance({
      userId,
      timestamp,
      balances: new Map(userBalanceMap),
    });

    // Save the new balance document
    await newBalanceDoc.save();
  }
};