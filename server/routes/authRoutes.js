const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/auth/register - Register new user (Public)
router.post('/register', register);

// POST /api/auth/login - Login user (Public)
router.post('/login', login);

// GET /api/auth/me - Get current user profile (Protected)
router.get('/me', authMiddleware, getMe);

module.exports = router;
