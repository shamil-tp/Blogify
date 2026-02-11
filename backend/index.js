require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); 

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const http = require("http")
// const app = require("./app");
const initSocket = require("./socket");

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
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175",process.env.FRONTEND_URL,process.env.LIBRARY_URL],
    credentials:true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(hpp())
connectDB()

app.use("/api/auth", authRoutes);
app.use("/api", blogRoutes);

if (require.main === module) {

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => console.log(`Server running on ${PORT}`));
}
module.exports = app;