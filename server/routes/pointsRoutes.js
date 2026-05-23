const express = require('express');
const router = express.Router();
const { getPoints, getTransactions, getLeaderboard } = require('../controllers/pointsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, getPoints);
router.get('/transactions', protect, getTransactions);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
