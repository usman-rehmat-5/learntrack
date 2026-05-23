const express = require('express');
const router = express.Router();
const { getRecommendations, getPublicPreview, getPublicCourses } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, getRecommendations);
router.get('/preview/:courseId', getPublicPreview);
router.get('/courses', getPublicCourses);

module.exports = router;
