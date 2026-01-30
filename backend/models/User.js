const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true
    },
    name: String,
    email: {
      type: String,
      unique: true
    },
    picture: String,
    Rtoken:{
      token: String,
      duration: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
