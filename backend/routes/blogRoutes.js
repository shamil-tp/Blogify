
const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
    addBlog,
    getBlog,
    getUserBlogs,
    deleteUserPost,
    getBlogById,
    updateBlog,
    createDraft,
    shareBlog,
    removeCollaborator
} = require("../controllers/blogController");

const router = express.Router();

/**
 * ALL ROUTES HERE ARE PREFIXED WITH /api/blog (via index.js)
 */

// Debugging
router.get("/ping", (req, res) => res.json({ message: "Blog routes active" }));

// MAIN SHARE ROUTE
router.post("/share-post/:postId", protect, shareBlog);
router.post("/remove-collaborator/:postId", protect, removeCollaborator);

// Other Routes
router.post("/create-draft", protect, createDraft);
router.get("/user-blogs", protect, getUserBlogs);
router.get("/deleteblog/:postId", protect, deleteUserPost);
router.get("/:postId", getBlogById);
router.post("/updateblog/:postId", protect, updateBlog);
router.post("/postblog", protect, addBlog);
router.get("/viewblog/:slug", getBlog);

module.exports = router;
