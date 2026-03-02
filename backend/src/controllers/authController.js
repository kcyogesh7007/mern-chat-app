const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../services/cloudinary");

exports.signUp = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({
      message: "Please provide fullName,email and password",
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
    });
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(400).json({
      message: "User already exist",
    });
  }
  await User.create({
    fullName,
    email,
    password: await bcrypt.hash(password, 10),
  });
  res.status(201).json({
    message: "User signedUp successfully",
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide email and password",
    });
  }
  const userExist = await User.findOne({
    email,
  });
  if (!userExist) {
    return res.status(404).json({
      message: "Email not registered",
    });
  }
  const isPasswordMatch = await bcrypt.compare(password, userExist.password);
  if (!isPasswordMatch) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }
  const token = jwt.sign({ id: userExist._id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "User loggedIn successfully",
  });
};

exports.logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({
    mesage: "Logged out successfully",
  });
};

exports.updateProfile = async (req, res) => {
  const { profilePic } = req.body;
  const userId = req.user._id;
  if (!profilePic) {
    return res.status(400).json({
      message: "Profile pic is required:",
    });
  }
  const uploadResponse = await cloudinary.uploader.upload(profilePic);
  const updateduser = await User.findByIdAndUpdate(
    userId,
    {
      profilePic: uploadResponse.secure_url,
    },
    {
      new: true,
    },
  );
  res.status(200).json(updateduser);
};

exports.checkAuth = async (req, res) => {
  res.status(200).json(req.user);
};
