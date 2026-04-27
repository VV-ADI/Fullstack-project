const express = require('express');
const router = express.Router();
const {
  getAllAlerts,
  createAlert,
  updateAlert
} = require('../controllers/alertController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/alerts - Get all alerts (admin) or user's alerts (Protected)
router.get('/', authMiddleware, getAllAlerts);

// POST /api/alerts - Create alert when user enters zone (Protected)
router.post('/', authMiddleware, createAlert);

// PATCH /api/alerts/:id - Update alert status (dismiss) (Protected)
router.patch('/:id', authMiddleware, updateAlert);

module.exports = router;
