require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// 1. CORS - MUST BE FIRST to catch all requests and provide headers
app.use(
	cors({
		origin: (origin, callback) => {
			// Allow requests with no origin (like mobile apps or curl)
			if (!origin) return callback(null, true);

			const allowedOrigins = [
				"http://localhost:5173",
				"http://localhost:5174",
				"http://localhost:5175",
				process.env.FRONTEND_URL,
				"https://og-doc.vercel.app",
				"https://ogdoc-1.onrender.com",
				"https://ogdoc-backend.onrender.com"
			];

			// Check if origin is in allowed list or matches patterns
			const isAllowed = allowedOrigins.some(ao => {
				if (!ao) return false;
				return ao.replace(/\/$/, '').toLowerCase() === origin.replace(/\/$/, '').toLowerCase();
			}) ||
				/\.onrender\.com$/.test(origin) ||
				/\.ngrok-free\.(app|dev)$/.test(origin) ||
				/\.vercel\.app$/.test(origin);

			if (isAllowed) {
				callback(null, true);
			} else {
				console.error("❌ CORS Blocked:", origin);
				callback(new Error('CORS not allowed for this origin'));
			}
		},
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
		allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
		exposedHeaders: ['Set-Cookie']
	})
);

// 2. Security Headers (configured to allow cross-origin communication)
app.use(helmet({
	crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
	crossOriginResourcePolicy: { policy: "cross-origin" },
	contentSecurityPolicy: false, // Disable CSP for dev/testing if it causes issues
}));

// 3. Rate Limiting (moved below CORS so preflight OPTIONS requests aren't blocked silently)
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 500, // Increased limit for testing
	standardHeaders: 'draft-8',
	legacyHeaders: false,
})
app.use(limiter)

const hpp = require('hpp')
const http = require("http")
const initSocket = require("./socket");

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