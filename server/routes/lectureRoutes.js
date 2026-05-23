const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getLectures, addLecture, toggleComplete, deleteLecture,
  updateLastWatched, getLastWatched,
  getNotes, saveNotes,
  toggleBookmark, getBookmarks,
  getCourseDuration, bulkAddLectures,
  getContinueWatching, getUserBadges, searchCoursesInTrack
} = require('../controllers/lectureController');
const { protect } = require('../middleware/authMiddleware');
const { premiumOnly, hasPremiumFeature, premiumCourseAccess, premiumLectureAccess } = require('../middleware/premiumMiddleware');
const UserProgress = require('../models/UserProgress');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /mp4|mkv|avi|mov/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    if (ext) cb(null, true);
    else cb(new Error('Only video files allowed'));
  }
});

// Continue watching + badges (must be before :courseId routes)
router.get('/continue-watching', protect, getContinueWatching);
router.get('/badges', protect, getUserBadges);

// Search courses within track
router.get('/search/:trackId', protect, searchCoursesInTrack);

// User Progress GET route
router.get('/progress/:courseId', protect, async (req, res) => {
  try {
    const progress = await UserProgress.find({
      userId: req.user._id,
      courseId: req.params.courseId
    });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Duration
router.get('/duration/:courseId', protect, getCourseDuration);

// Last Watched
router.put('/:id/watched', protect, premiumLectureAccess, updateLastWatched);
router.get('/lastwatched/:courseId', protect, getLastWatched);

// Notes
router.get('/:id/notes', protect, premiumLectureAccess, getNotes);
router.put('/:id/notes', protect, premiumLectureAccess, saveNotes);

// Bookmarks
router.put('/:id/bookmark', protect, premiumLectureAccess, toggleBookmark);
router.get('/bookmarks/:courseId', protect, getBookmarks);

// Bulk Upload
router.post('/bulk/:courseId', protect, bulkAddLectures);

// CRUD
router.get('/:courseId', protect, premiumCourseAccess, getLectures);
router.post('/:courseId', protect, upload.single('video'), addLecture);
router.put('/:id/toggle', protect, premiumLectureAccess, toggleComplete);
router.delete('/:id', protect, deleteLecture);

module.exports = router;
