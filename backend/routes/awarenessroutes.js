const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authmiddleware");
const { cacheMiddleware } = require("../middleware/cachemiddleware");

const {
  createAwareness,
  getAwareness,
  deleteAwareness
} = require("../controllers/awarenesscontroller");

router.post("/", protect, createAwareness);
router.get("/", cacheMiddleware(() => "awareness:list"), getAwareness);
router.delete("/:id", protect, deleteAwareness);

module.exports = router;