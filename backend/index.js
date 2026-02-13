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

app.use(helmet({
	crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
	crossOriginResourcePolicy: { policy: "cross-origin" }
}))

app.use(
	cors({
		origin: (origin, callback) => {
			const allowedOrigins = [
				"http://localhost:5173",
				"http://localhost:5174",
				"http://localhost:5175",
				process.env.FRONTEND_URL,
				"https://og-doc.vercel.app",
				"https://ogdoc-1.onrender.com",
			];

			// Check if the origin matches any allowed origin (ignoring trailing slashes) or the Render regex
			const isAllowed = !origin ||
				allowedOrigins.some(ao => ao && ao.replace(/\/$/, '') === origin.replace(/\/$/, '')) ||
				/^https:\/\/.*\.onrender\.com$/.test(origin);

			if (isAllowed) {
				callback(null, true);
			} else {
				console.log("CORS blocked origin:", origin);
				callback(new Error('Not allowed by CORS'));
			}
		},
		credentials: true
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(hpp())
connectDB()

// Health check endpoint
app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
	res.status(200).json({
		message: 'ogDoc API Server',
		version: '1.0.0',
		endpoints: {
			auth: '/api/auth',
			blog: '/api/blog'
		}
	});
});

app.use("/api/auth", authRoutes);
app.use("/api", blogRoutes);

if (require.main === module) {

	const server = http.createServer(app);
	initSocket(server);

	console.log(`Attempting to listen on port ${PORT}`);
	server.listen(PORT, () => console.log(`Server running on ${PORT}`));
}
module.exports = app;