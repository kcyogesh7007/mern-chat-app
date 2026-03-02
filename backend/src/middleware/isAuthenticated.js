const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        message: "Please login",
      });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = isAuthenticated;
