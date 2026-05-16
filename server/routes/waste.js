const express = require('express');
const WasteCollection = require('../models/WasteCollection');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Request waste pickup
router.post('/request-pickup', authMiddleware, async (req, res) => {
  try {
    const { weight, wasteType, location } = req.body;

    if (!weight || !wasteType || !location) {
      return res.status(400).json({
        success: false,
        message: 'Weight, waste type, and location are required'
      });
    }

    // Calculate points (1 kg = 10 points)
    const pointsEarned = weight * 10;

    const waste = new WasteCollection({
      userId: req.userId,
      weight,
      wasteType,
      location,
      pointsEarned,
      status: 'scheduled'
    });

    await waste.save();

    // Update user waste collected and points
    await User.findByIdAndUpdate(
      req.userId,
      {
        $inc: {
          wasteCollected: weight,
          points: pointsEarned
        }
      }
    );

    res.status(201).json({
      success: true,
      message: 'Pickup request created successfully',
      data: waste,
      pointsEarned
    });
  } catch (error) {
    console.error('Request pickup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to request pickup'
    });
  }
});

// Get user waste collections
router.get('/my-collections', authMiddleware, async (req, res) => {
  try {
    const collections = await WasteCollection.find({ userId: req.userId });

    const totalWaste = collections.reduce((sum, c) => sum + c.weight, 0);
    const totalPoints = collections.reduce((sum, c) => sum + c.pointsEarned, 0);

    res.json({
      success: true,
      totalWaste,
      totalPoints,
      count: collections.length,
      data: collections
    });
  } catch (error) {
    console.error('Get collections error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch collections'
    });
  }
});

// Get all waste collections (admin)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }

    const collections = await WasteCollection.find(query).populate('userId', 'name email phone');

    res.json({
      success: true,
      count: collections.length,
      data: collections
    });
  } catch (error) {
    console.error('Get all collections error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch collections'
    });
  }
});

// Update waste collection status (admin)
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const waste = await WasteCollection.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!waste) {
      return res.status(404).json({
        success: false,
        message: 'Waste collection record not found'
      });
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: waste
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status'
    });
  }
});

module.exports = router;
