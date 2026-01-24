
const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { addBlog, getBlog } = require("../controllers/blogController");

const router = express.Router();

router.get("/viewblog/:slug", getBlog);

// 🔒 Protected route
router.post("/blog/postblog", protect, addBlog);

module.exports = router;
