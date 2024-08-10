const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("Connected to Database Successfully!");
  } catch (err) {
    console.error("Error Connecting to Database:", err.message);
  }
};

module.exports = connectDB;
