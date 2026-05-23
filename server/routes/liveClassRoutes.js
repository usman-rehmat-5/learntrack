const express = require('express');
const router = express.Router();
const {
  getUpcoming, getMyClasses, getCourseClasses,
  createClass, updateClass, deleteClass
} = require('../controllers/liveClassController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/upcoming', getUpcoming);
router.get('/my', protect, getMyClasses);
router.get('/course/:courseId', protect, getCourseClasses);
router.post('/', protect, adminOnly, createClass);
router.put('/:id', protect, adminOnly, updateClass);
router.delete('/:id', protect, adminOnly, deleteClass);

module.exports = router;
