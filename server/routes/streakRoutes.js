const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const streakController = require('../controllers/streakController');

// Get user streak
router.get('/', protect, streakController.getStreak);

// Update streak when user completes a lecture
router.put('/update', protect, streakController.updateStreak);

module.exports = router;