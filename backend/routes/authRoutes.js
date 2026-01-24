const express = require("express");
const router = express.Router(); // ✅ THIS WAS MISSING

const { googleLogin, logout, me } = require("../controllers/auth-controller");
const { protect } = require("../middlewares/authMiddleware");

router.post("/google", googleLogin);
router.post("/logout", logout);
router.get("/me", protect, me);

module.exports = router;
