const ContainmentZone = require('../models/ContainmentZone');

// Get all containment zones
exports.getAllZones = async (req, res) => {
  try {
    const zones = await ContainmentZone.find().populate('createdBy', 'name email');
    res.json(zones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single zone by ID
exports.getZoneById = async (req, res) => {
  try {
    const zone = await ContainmentZone.findById(req.params.id).populate('createdBy', 'name email');
    if (!zone) {
      return res.status(404).json({ message: 'Zone not found' });
    }
    res.json(zone);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new zone (Admin only)
exports.createZone = async (req, res) => {
  try {
    const { zoneName, locationCoordinates, radius, boundary, severityLevel } = req.body;

    const zone = new ContainmentZone({
      zoneName,
      locationCoordinates,
      radius,
      boundary: boundary || [],
      severityLevel,
      createdBy: req.user.id
    });

    await zone.save();
    res.status(201).json({ message: 'Zone created successfully', zone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a zone (Admin only)
exports.updateZone = async (req, res) => {
  try {
    const { zoneName, locationCoordinates, radius, boundary, severityLevel } = req.body;

    const zone = await ContainmentZone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({ message: 'Zone not found' });
    }

    zone.zoneName = zoneName || zone.zoneName;
    zone.locationCoordinates = locationCoordinates || zone.locationCoordinates;
    zone.radius = radius || zone.radius;
    zone.boundary = boundary || zone.boundary;
    zone.severityLevel = severityLevel || zone.severityLevel;
    zone.updatedAt = Date.now();

    await zone.save();
    res.json({ message: 'Zone updated successfully', zone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a zone (Admin only)
exports.deleteZone = async (req, res) => {
  try {
    const zone = await ContainmentZone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({ message: 'Zone not found' });
    }

    await ContainmentZone.findByIdAndDelete(req.params.id);
    res.json({ message: 'Zone deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
