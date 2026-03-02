const {
  signUp,
  login,
  logout,
  updateProfile,
  checkAuth,
} = require("../controllers/authController");
const isAuthenticated = require("../middleware/isAuthenticated");
const catchAsync = require("../services/catchAsync");

const router = require("express").Router();
router.route("/signup").post(catchAsync(signUp));
router.route("/login").post(catchAsync(login));
router.route("/logout").post(catchAsync(logout));
router
  .route("/update-profile")
  .patch(isAuthenticated, catchAsync(updateProfile));
router.route("/check").get(isAuthenticated, catchAsync(checkAuth));

module.exports = router;
