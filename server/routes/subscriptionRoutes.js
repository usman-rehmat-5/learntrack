const express = require('express');
const router = express.Router();
const {
  getPlans, getMySubscription, upgradeToPremium,
  cancelSubscription, getPremiumUsers, setUserPremium
} = require('../controllers/subscriptionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/plans', getPlans);
router.get('/my', protect, getMySubscription);
router.post('/upgrade', protect, upgradeToPremium);
router.post('/cancel', protect, cancelSubscription);

// Admin
router.get('/users', protect, adminOnly, getPremiumUsers);
router.put('/users/:userId', protect, adminOnly, setUserPremium);

module.exports = router;
