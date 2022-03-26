const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
require("dotenv").config({ path: "./config.env" });

exports.protect = async (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token)
    return next(new ErrorResponse("Access Denied. No Token provided", 401));

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse("Invalid User", 404));
    }
    req.user = user;

    next();
  } catch (error) {
    return next(new ErrorResponse("Invalid Token", 401));
  }
};
