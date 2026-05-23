const express = require('express');
const router = express.Router();
const {
  getQuiz, submitQuiz, getMyResults,
  addQuiz, deleteQuiz
} = require('../controllers/quizController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/results/me', protect, getMyResults);
// Admin routes must come BEFORE user routes
router.post('/admin/:trackId', protect, adminOnly, addQuiz);
router.delete('/admin/:trackId', protect, adminOnly, deleteQuiz);
// User routes
router.get('/:trackId', protect, getQuiz);
router.post('/submit', protect, submitQuiz);

module.exports = router;