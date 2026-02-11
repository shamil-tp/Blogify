
const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { addBlog, getBlog, getUserBlogs, deleteUserPost, getBlogById, updateBlog ,createDraft} = require("../controllers/blogController");

const router = express.Router();

router.get("/viewblog/:slug", getBlog);

router.post("/blog/postblog", protect, addBlog);
router.get("/blog/user-blogs",protect,getUserBlogs)
router.get("/blog/deleteblog/:postId",protect,deleteUserPost)
router.get("/blog/:postId",getBlogById)
router.post("/blog/updateblog/:postId", protect, updateBlog);

router.post("/blog/create-draft", protect, createDraft) 


module.exports = router;
