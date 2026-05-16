const express = require("express");
const {
  registerUser,
  loginUser,
  googleSignIn,
  getCurrentUser,
  sendLoginOtp,
  verifyLoginOtp,
  sendResetOtp,
  resetPasswordWithOtp,
} = require("../controllers/authcontroller");
const { body } = require("express-validator");
const { validate } = require("../middleware/validationmiddleware");
const { protect } = require("../middleware/authmiddleware");

const router = express.Router();

/* ================= REGISTER ================= */
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
  ],
  validate,
  registerUser   // ✅ FIXED (was register ❌)
);

/* ================= LOGIN ================= */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required")
  ],
  validate,
  loginUser   // ✅ FIXED (was login ❌)
);

router.post("/google", googleSignIn);
router.get("/me", protect, getCurrentUser);
router.post(
  "/send-login-otp",
  [body("email").isEmail().withMessage("Valid email required")],
  validate,
  sendLoginOtp
);
router.post(
  "/verify-login-otp",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("otp").isLength({ min: 6, max: 6 }).withMessage("Valid OTP required")
  ],
  validate,
  verifyLoginOtp
);
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Valid email required")],
  validate,
  sendResetOtp
);
router.post(
  "/reset-password",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("otp").isLength({ min: 6, max: 6 }).withMessage("Valid OTP required"),
    body("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  ],
  validate,
  resetPasswordWithOtp
);

module.exports = router;
