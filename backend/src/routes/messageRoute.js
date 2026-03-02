const {
  getUsers,
  getMessages,
  sendMessage,
} = require("../controllers/messageController");
const isAuthenticated = require("../middleware/isAuthenticated");

const router = require("express").Router();

router.route("/users").get(isAuthenticated, getUsers);
router.route("/send/:id").post(isAuthenticated, sendMessage);
router.route("/:id").get(isAuthenticated, getMessages);

module.exports = router;
