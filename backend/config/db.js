const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("MongoDB URI not configured. Starting backend in demo auth mode.");
      return false;
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✅");
    return true;
  } catch (error) {
    console.error("MongoDB Connection Failed ❌", error.message);
    return false;
  }
};

module.exports = connectDB;