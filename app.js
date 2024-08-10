const express = require("express");
const connectDB = require("./config/database");

const tradeRoutes = require("./routes/tradeRoutes");
const balanceRoutes = require("./routes/balanceRoutes");

require("dotenv").config();

const app = express();
app.use(express.json());

// Connect to the database
connectDB();

// Route handlers
app.use("/api/trades", tradeRoutes); // Routes for trade-related operations
app.use("/api/balances", balanceRoutes); // Routes for balance-related operations

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error details
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
