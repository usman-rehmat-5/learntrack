const express = require('express');
const router = express.Router();
const {
  getCourseRatings, addRating,
  getMyRating, deleteRating
} = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:courseId', protect, getCourseRatings);
router.get('/:courseId/my', protect, getMyRating);
router.post('/:courseId', protect, addRating);
router.delete('/:courseId', protect, deleteRating);

module.exports = router;