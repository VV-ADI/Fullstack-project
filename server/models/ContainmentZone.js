const mongoose = require('mongoose');

const ContainmentZoneSchema = new mongoose.Schema({
  zoneName: {
    type: String,
    required: true,
    trim: true
  },
  locationCoordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  radius: {
    type: Number,   // in meters
    required: true
  },
  boundary: {
    type: [[Number]],  // array of [lat, lng] pairs for polygon zones
    default: []
  },
  severityLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ContainmentZone', ContainmentZoneSchema);
