const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getCourses, getAllCourses, addCourse,
  updateCourse, deleteCourse, getCourseProgress
} = require('../controllers/courseController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Multer for thumbnails
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `thumb-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

// User routes (order matters - more specific routes first)
router.get('/all', protect, getAllCourses);
router.get('/detail/:id', protect, getCourseProgress);
router.get('/:fieldId/:trackId', protect, getCourses);

// Admin routes
router.post('/:fieldId/:trackId', protect, adminOnly, upload.single('thumbnail'), addCourse);
router.put('/:id', protect, adminOnly, upload.single('thumbnail'), updateCourse);
router.delete('/:id', protect, adminOnly, deleteCourse);

module.exports = router;