const express = require('express');
const router = express.Router();
const {
  enrollCourse,
  getActiveEnrollment,
  completeCourse,
  checkEnrollment
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/enroll', protect, enrollCourse);
router.get('/active', protect, getActiveEnrollment);
router.post('/complete', protect, completeCourse);
router.get('/check', protect, checkEnrollment);

module.exports = router;
