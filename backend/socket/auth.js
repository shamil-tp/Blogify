// socket/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (token) {
      // JWT user
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = await User.findById(decoded.userId).select("-password");
    } else {
      // Guest user (anyone with link)
      const ip = socket.handshake.address.replace(/[:.]/g, ""); // sanitize IP
      socket.user = { _id: `guest-${ip}-${socket.id}`, name: `Guest-${ip}` };
    }

    next();
  } catch (err) {
    console.log("Socket Auth Error:", err.message);
    next(new Error("Authentication failed"));
  }
};

module.exports = authSocket;
