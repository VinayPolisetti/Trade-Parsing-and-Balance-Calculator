const balanceService = require('../services/balanceService');

// Handler for retrieving asset balances at a specific timestamp
exports.getAssetBalanceAtTimestamp = async (req, res) => {
  try {
    const { timestamp } = req.body;

    // Check if the timestamp is provided
    if (!timestamp) {
      return res.status(400).json({ message: 'Timestamp is required' });
    }

    // Call the service function to get the balance at the specified timestamp
    const balanceDoc = await balanceService.getBalanceAtTimestamp(timestamp);

    // If a balance document is found, convert the balances to an object and send as response
    if (balanceDoc) {
      const balances = Object.fromEntries(balanceDoc.balances);
      res.json(balances);
    } else {
      res.status(404).json({ message: 'No balance data found for the given timestamp' });
    }
  } catch (error) {
    console.error('Error fetching asset balance:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
