const fs = require('fs');
const csv = require('csv-parser');

// Function to process trade data from a CSV file into db schema
exports.processCSVTradeData = async (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];

    // Create a readable stream from the CSV file and pipe it through the CSV parser which converts between formats
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Process each row of the CSV file
        const [baseCoin, quoteCoin] = data.Market ? data.Market.split('/') : [];
        results.push({
          userId: data.User_ID,
          utcTime: new Date(data.UTC_Time),
          operation: data.Operation,
          market: data.Market,
          baseCoin,
          quoteCoin,
          amount: parseFloat(data['Buy/Sell Amount']),
          price: parseFloat(data.Price),
        });
      })
      .on('end', () => {
        // Cleanup the file after processing
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          }
        });

        // Resolve the promise with the parsed results
        resolve(results);
      })
      .on('error', (error) => {
        // Cleanup the file if there's an error
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          }
        });

        // Reject the promise with the error
        reject(error);
      });
  });
};
