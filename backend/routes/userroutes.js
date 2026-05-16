const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authmiddleware");

// Controllers
const {
  register,
  login,
  getUserProfile,
  updateUserProfile,
  getDashboard,
  updateContribution,
  updateFcmToken
} = require("../controllers/usercontroller");

// ==================== PUBLIC ROUTES ====================
// Register a new user
router.post("/register", register);

// Login user
router.post("/login", login);

// ==================== PROTECTED ROUTES ====================
// Get user profile
router.get("/profile", protect, getUserProfile);

// Update user profile
router.put("/profile", protect, updateUserProfile);

// Get dashboard info
router.get("/dashboard", protect, getDashboard);

// Update user contribution
router.put("/contribution", protect, updateContribution);

router.post("/fcm-token", protect, updateFcmToken);

module.exports = router;


