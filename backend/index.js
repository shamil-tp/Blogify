require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // Ensure this file exports a function

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

const cookieParser = require("cookie-parser");

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// --- FIX START: Connect to DB before every request ---
// This ensures the DB is connected even when app.listen is skipped by Vercel
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({ message: "Database connection failed" });
  }
});
// --- FIX END ---

app.use("/api/auth", authRoutes);
app.use("/api", blogRoutes);

// Keep this for local development (Vercel ignores it)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;