const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/tokenUtil");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { sub, name, email, picture } = payload;

    let user = await User.findOne({ googleId: sub });
    if (!user) {
      user = await User.create({
        googleId: sub,
        name,
        email,
        picture
      });
    }

    const accessToken = generateAccessToken(user._id);

    const refreshToken = generateRefreshToken(user._id);

    user.Rtoken = {
      token: refreshToken,
      duration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
    await user.save();

    return res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user
    });

  } catch (error) {
    console.error("Authentication Error Details:", error.message);
    return res.status(401).json({
      success: false,
      message: "Google authentication failed"
    });
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(403).json({ message: "Refresh Token is required" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user || !user.Rtoken || user.Rtoken.token !== refreshToken) {
      return res.status(403).json({ message: "Invalid Refresh Token" });
    }

    const newAccessToken = generateAccessToken(user._id);

    return res.status(200).json({
      accessToken: newAccessToken,
    });

  } catch (error) {
    console.error("Refresh Error:", error.message);
    return res.status(403).json({ message: "Invalid or expired Refresh Token" });
  }
};

const logout = async (req, res) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { $unset: { Rtoken: 1 } });
  }

  return res.status(200).json({ success: true, message: "Logged out successfully" });
};

const me = (req, res) => {
  return res.status(200).json({ user: req.user });
};

module.exports = { googleLogin, logout, me, refresh };
