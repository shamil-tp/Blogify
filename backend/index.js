require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // Ensure this file exports a function
const mongoSanitize = require('express-mongo-sanitize')

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

const cookieParser = require("cookie-parser");
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')


const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	limit: 100, 
	standardHeaders: 'draft-8', 
	legacyHeaders: false, 
	ipv6Subnet: 56, 
})

app.use(limiter)

app.use(helmet())

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(hpp())
app.use(mongoSanitize())
connectDB()

app.use("/api/auth", authRoutes);
app.use("/api", blogRoutes);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;