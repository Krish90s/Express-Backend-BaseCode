const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config({ path: "./config.env" });
const ErrorResponse = require("../utils/errorResponse");

exports.sendotp = async (req, res, next) => {
  const { PhoneNumber } = req.body;

  try {
    const user = await User.findOne({ PhoneNumber });

    if (user) {
      var OTP = Math.floor(1000 + Math.random() * 9000);
      const result = await User.findOneAndUpdate(
        { PhoneNumber },
        { OTP },
        { new: true }
      );
      res.status(201).json({ success: true, data: result.OTP });
    } else {
      var OTP = Math.floor(1000 + Math.random() * 9000);
      const result = await User.create({
        PhoneNumber,
        OTP,
      });
      res.status(201).json({ success: true, data: result.OTP });
    }
  } catch (error) {
    next(error);
  }
};

exports.verifyotp = async (req, res, next) => {
  const { PhoneNumber, OTP } = req.body;

  if (!PhoneNumber || !OTP) {
    return next(
      new ErrorResponse("Please provide a valid phone number and otp", 400)
    );
  }

  try {
    const user = await User.findOne({ PhoneNumber });

    if (!user) {
      return next(new ErrorResponse("Invalid Credentials", 404));
    }

    if (user.OTP !== OTP) {
      return next(new ErrorResponse("Invalid Credentials", 404));
    }

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res
    .status(statusCode)
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .json({ success: true });
};
