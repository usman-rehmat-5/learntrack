const express = require('express');
const router = express.Router();
const {
  getPendingReviews, submitReview, getReviewsForSubmission,
  getMyReviews, getReviewsForMySubmissions
} = require('../controllers/peerReviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/pending', protect, getPendingReviews);
router.post('/', protect, submitReview);
router.get('/my-reviews', protect, getMyReviews);
router.get('/my-submission-reviews', protect, getReviewsForMySubmissions);
router.get('/submission/:submissionId', protect, getReviewsForSubmission);

module.exports = router;
