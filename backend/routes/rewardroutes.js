const express = require("express");
const {
  redeemReward,
  getRewards,
  myRedemptions,
  createReward,
  updateReward,
  deleteReward,
  allRedemptions,
  updateRedemptionStatus
} = require("../controllers/rewardcontroller");

const { protect } = require("../middleware/authmiddleware");
const { adminOnly } = require("../middleware/rolemiddleware"); // ✅ adjust if your file name differs

const router = express.Router();

// Public/User
router.get("/", getRewards);
router.post("/redeem/:id", protect, redeemReward);
router.get("/me/redemptions", protect, myRedemptions);

// Admin - product management
router.post("/", protect, adminOnly, createReward);
router.put("/:id", protect, adminOnly, updateReward);
router.delete("/:id", protect, adminOnly, deleteReward);

// Admin - redemptions management
router.get("/admin/redemptions", protect, adminOnly, allRedemptions);
router.put("/admin/redemptions/:id", protect, adminOnly, updateRedemptionStatus);

module.exports = router;