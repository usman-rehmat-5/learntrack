const express = require('express');
const router = express.Router();
const {
  getBadgeDefinitions, getUserBadges, awardBadge
} = require('../controllers/badgeController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/definitions', protect, getBadgeDefinitions);
router.get('/mine', protect, getUserBadges);

// Admin
router.post('/award', protect, adminOnly, awardBadge);

module.exports = router;
