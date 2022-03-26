const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./config.env" });

const UserSchema = new mongoose.Schema(
  {
    PhoneNumber: {
      type: String,
      required: [true, "Please provide a mobile number"],
      unique: true,
      match: [/^\d{10}$/, "Please provide a valid email"],
    },
    OTP: {
      type: String,
    },
    Role: {
      type: String,
    },
    Active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.methods.getSignedToken = function () {
  return jwt.sign(
    {
      id: this._id,
      PhoneNumber: this.PhoneNumber,
      Role: this.Role,
      Active: this.Active,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1),
    },
    process.env.JWT_PRIVATE_KEY
  );
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
