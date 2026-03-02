const Message = require("../models/messageModel");
const User = require("../models/userModel");
const cloudinary = require("../services/cloudinary");
const { getReceiverSocketId, io } = require("../services/socket");

exports.getUsers = async (req, res) => {
  const userId = req.user._id;
  const users = await User.find({ _id: { $ne: userId } }).select("-password");
  res.status(200).json({
    message: "Users fetched successfully",
    data: users,
  });
};

exports.getMessages = async (req, res) => {
  const { id: userToChatId } = req.params;
  const myId = req.user._id;
  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: myId },
    ],
  });
  res.status(200).json({
    message: "Messages fetched successfully",
    data: messages,
  });
};
exports.sendMessage = async (req, res) => {
  const { text, image } = req.body;
  const { id } = req.params;
  const senderId = req.user._id;
  let imageUrl;
  if (image) {
    const uploadResponse = await cloudinary.uploader.upload(image);
    imageUrl = uploadResponse.secure_url;
  }
  const newMessage = await Message.create({
    senderId,
    receiverId: id,
    text,
    image,
  });
  const receiverSocketId = getReceiverSocketId(id);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  res.status(201).json(newMessage);
};
