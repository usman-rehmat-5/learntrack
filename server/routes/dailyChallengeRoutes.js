const express = require('express');
const router = express.Router();
const {
  getTodayChallenges, updateChallengeProgress,
  claimChallengeReward, getChallengeHistory
} = require('../controllers/dailyChallengeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/today', protect, getTodayChallenges);
router.put('/progress', protect, updateChallengeProgress);
router.post('/claim', protect, claimChallengeReward);
router.get('/history', protect, getChallengeHistory);

module.exports = router;
