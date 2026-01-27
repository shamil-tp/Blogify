const mongoose = require("mongoose");

let cachedConnection = null

const connectDB = async () => {
  if(cachedConnection){
    return cachedConnection
  }

  try {
    const connection = await mongoose.connect(process.env.DB_URL);
    cachedConnection = connection
    console.log("✅ MongoDB connected");
    return cachedConnection
  } catch (err) {
    console.error("❌ DB connection failed", err);
    process.exit(1);
  }
};

module.exports = connectDB
