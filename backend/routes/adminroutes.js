const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authmiddleware");
const { adminOnly } = require("../middleware/rolemiddleware");
const {
  getAllUsers,
  deleteUser,
  updateUserRole,
  getStats,
} = require("../controllers/admincontroller");

/* ─── Stats ─── */
router.get("/stats", protect, adminOnly, getStats);

/* ─── Users ─── */
router.get("/users", protect, adminOnly, getAllUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.put("/users/:id/role", protect, adminOnly, updateUserRole);

module.exports = router;