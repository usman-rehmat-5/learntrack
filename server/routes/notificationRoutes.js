const express = require('express');
const router = express.Router();
const {
  subscribe, unsubscribe, sendNotification, getMySubscriptions
} = require('../controllers/notificationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/vapid-public-key', (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY || '' });
});
router.post('/subscribe', protect, subscribe);
router.post('/unsubscribe', protect, unsubscribe);
router.get('/subscriptions', protect, getMySubscriptions);

// Admin: send notification to all or specific user
router.post('/send', protect, adminOnly, sendNotification);

module.exports = router;
