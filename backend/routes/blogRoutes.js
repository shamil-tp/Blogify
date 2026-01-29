
const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { addBlog, getBlog, getUserBlogs, deleteUserPost } = require("../controllers/blogController");

const router = express.Router();

router.get("/viewblog/:slug", getBlog);


// 🔒 Protected route
router.post("/blog/postblog", protect, addBlog);
router.get("/blog/user-blogs",protect,getUserBlogs)
router.get("/blog/deleteblog/:postId",protect,deleteUserPost)

module.exports = router;
