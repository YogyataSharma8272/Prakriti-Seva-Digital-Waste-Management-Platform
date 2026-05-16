const mongoose = require('mongoose');

const wasteCollectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  wasteType: {
    type: String,
    enum: ['plastic', 'paper', 'metal', 'glass', 'organic', 'e-waste', 'mixed'],
    required: true
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  status: {
    type: String,
    enum: ['scheduled', 'picked-up', 'processed', 'recycled'],
    default: 'scheduled'
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  pickupDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WasteCollection', wasteCollectionSchema);
