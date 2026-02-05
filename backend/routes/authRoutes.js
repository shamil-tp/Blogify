const express = require("express");
const router = express.Router();

const { googleLogin, logout, me, refresh } = require("../controllers/auth-controller");
const { protect } = require("../middlewares/authMiddleware");

router.post("/google", googleLogin);
router.post("/logout", protect, logout);
router.post("/refresh", refresh);
router.get("/me", protect, me);

module.exports = router;
