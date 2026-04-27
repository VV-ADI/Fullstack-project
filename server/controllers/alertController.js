const Alert = require('../models/Alert');

// Get all alerts (admin gets all, user gets own)
exports.getAllAlerts = async (req, res) => {
  try {
    let alerts;
    if (req.user.role === 'Admin') {
      alerts = await Alert.find()
        .populate('userId', 'name email')
        .populate('zoneId', 'zoneName severityLevel')
        .sort({ alertTime: -1 });
    } else {
      alerts = await Alert.find({ userId: req.user.id })
        .populate('zoneId', 'zoneName severityLevel')
        .sort({ alertTime: -1 });
    }
    res.json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create alert when user enters zone
exports.createAlert = async (req, res) => {
  try {
    const { zoneId } = req.body;

    // Check if there's already an active alert for this user and zone
    const existingAlert = await Alert.findOne({
      userId: req.user.id,
      zoneId,
      status: 'Active'
    });

    if (existingAlert) {
      return res.status(400).json({ message: 'Alert already exists for this zone' });
    }

    const alert = new Alert({
      userId: req.user.id,
      zoneId
    });

    await alert.save();
    
    const populatedAlert = await Alert.findById(alert._id)
      .populate('zoneId', 'zoneName severityLevel');
    
    res.status(201).json({ message: 'Alert created successfully', alert: populatedAlert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update alert status (dismiss)
exports.updateAlert = async (req, res) => {
  try {
    const { status } = req.body;

    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    // Users can only update their own alerts (unless admin)
    if (req.user.role !== 'Admin' && alert.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    alert.status = status || alert.status;
    await alert.save();

    res.json({ message: 'Alert updated successfully', alert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
