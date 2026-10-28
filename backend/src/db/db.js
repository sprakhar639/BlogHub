const mongoose = require("mongoose");

async function connectDB() {
  console.log("MONGO_URI exists:", Boolean(process.env.MONGO_URI));
  console.log(
    "MONGO_URI starts with mongodb:",
    process.env.MONGO_URI?.startsWith("mongodb")
  );

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in this deployment");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected successfully");
    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error.name, error.message);
    throw error;
  }
}

module.exports = connectDB;