const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: String,
  name: String,
  email: String,
  role: {
    type: String,
    enum: ["admin", "staff"],
    default: "staff"
  }
});

module.exports = mongoose.model("User", UserSchema);