const express = require('express');
const router = express.Router();
const {
  getFields, addField, updateField, deleteField,
  getTracks, addTrack, updateTrack, deleteTrack,
  addRoadmapStep, deleteRoadmapStep,
  searchAll, getStats, getUsers, getUserProgress, awardBadge,
  toggleCoursePremium, toggleLecturePremium, getPremiumContent
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Stats
router.get('/stats', protect, adminOnly, getStats);

// Search
router.get('/search', protect, searchAll);

// Fields
router.get('/fields', protect, getFields);
router.post('/fields', protect, adminOnly, addField);
router.put('/fields/:id', protect, adminOnly, updateField);
router.delete('/fields/:id', protect, adminOnly, deleteField);

// Tracks
router.get('/fields/:fieldId/tracks', protect, getTracks);
router.post('/fields/:fieldId/tracks', protect, adminOnly, addTrack);
router.put('/tracks/:id', protect, adminOnly, updateTrack);
router.delete('/tracks/:id', protect, adminOnly, deleteTrack);

// Roadmap
router.post('/tracks/:trackId/roadmap', protect, adminOnly, addRoadmapStep);
router.delete('/tracks/:trackId/roadmap/:stepIndex', protect, adminOnly, deleteRoadmapStep);

// User progress (admin)
router.get('/users', protect, adminOnly, getUsers);
router.get('/users/:userId/progress', protect, adminOnly, getUserProgress);

// Badge management (admin)
router.post('/badges', protect, adminOnly, awardBadge);

// Premium content management
router.get('/premium-content', protect, adminOnly, getPremiumContent);
router.put('/courses/:id/toggle-premium', protect, adminOnly, toggleCoursePremium);
router.put('/lectures/:id/toggle-premium', protect, adminOnly, toggleLecturePremium);

module.exports = router;
