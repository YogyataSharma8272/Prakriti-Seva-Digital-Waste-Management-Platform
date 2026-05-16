const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
      .select('name wasteCollected points -password')
      .sort({ wasteCollected: -1 })
      .limit(100);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      wasteCollected: user.wasteCollected,
      points: user.points
    }));

    res.json({
      success: true,
      count: leaderboard.length,
      data: leaderboard
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard'
    });
  }
});

// Get user rank
router.get('/rank/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const rank = await User.countDocuments({
      wasteCollected: { $gt: user.wasteCollected }
    });

    res.json({
      success: true,
      data: {
        rank: rank + 1,
        name: user.name,
        wasteCollected: user.wasteCollected,
        points: user.points
      }
    });
  } catch (error) {
    console.error('Get rank error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rank'
    });
  }
});

module.exports = router;
