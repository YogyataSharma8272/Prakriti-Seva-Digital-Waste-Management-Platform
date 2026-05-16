const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authmiddleware");
const { getLeaderboard } = require("../controllers/leaderboardcontroller");
const { cacheMiddleware } = require("../middleware/cachemiddleware");

router.get("/", cacheMiddleware(() => "leaderboard:page1"), getLeaderboard);

router.get("/", protect, getLeaderboard);

module.exports = router;