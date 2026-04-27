const express = require('express');
const router = express.Router();
const {
  getAllZones,
  getZoneById,
  createZone,
  updateZone,
  deleteZone
} = require('../controllers/zoneController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// GET /api/zones - Fetch all containment zones (Protected)
router.get('/', authMiddleware, getAllZones);

// GET /api/zones/:id - Fetch single zone by ID (Protected)
router.get('/:id', authMiddleware, getZoneById);

// POST /api/zones - Create a new zone (Admin only)
router.post('/', authMiddleware, roleMiddleware('Admin'), createZone);

// PUT /api/zones/:id - Update a zone (Admin only)
router.put('/:id', authMiddleware, roleMiddleware('Admin'), updateZone);

// DELETE /api/zones/:id - Delete a zone (Admin only)
router.delete('/:id', authMiddleware, roleMiddleware('Admin'), deleteZone);

module.exports = router;
