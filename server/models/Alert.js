const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  zoneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ContainmentZone',
    required: true
  },
  alertTime: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Dismissed', 'Resolved'],
    default: 'Active'
  }
});

module.exports = mongoose.model('Alert', AlertSchema);
