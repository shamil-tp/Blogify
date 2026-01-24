// const express = require("express");
// const router = express.Router();

// // const { googleLogin } = require("../controllers/auth.controller");
// const { getBlog, addBlog } = require("../controllers/blogController");

// // Blog routes
// router.get("/viewblog/:slug", getBlog);
// router.post("/postblog", addBlog);

// // Google auth route
// // router.post("/google", googleLogin);

// module.exports = router;

const express = require("express");
const router = express.Router();

const { getBlog, addBlog } = require("../controllers/blogController");

// Blog routes
router.get("/findblog/:slug", getBlog)
router.post("/postblog", addBlog);

module.exports = router;
