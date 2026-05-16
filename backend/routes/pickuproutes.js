const express = require("express");
const router = express.Router();
const {
  createPickup,
  getMyPickups,
  getAllPickups,
  updatePickupStatus,
  deletePickup
} = require("../controllers/pickupcontroller");

const { protect, adminOnly } = require("../middleware/authmiddleware");

router.post("/create", protect, createPickup);
router.get("/my", protect, getMyPickups);
router.get("/all", protect, adminOnly, getAllPickups);
router.put("/status/:id", protect, adminOnly, updatePickupStatus);
router.delete("/:id", protect, deletePickup);

module.exports = router;