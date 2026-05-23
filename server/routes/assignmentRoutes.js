const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getTrackAssignments, createAssignment, updateAssignment, deleteAssignment,
  submitAssignment, getSubmissions, gradeSubmission, getMySubmissions
} = require('../controllers/assignmentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `sub-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

router.get('/my', protect, getMySubmissions);
router.get('/track/:trackId', protect, getTrackAssignments);
router.post('/', protect, adminOnly, createAssignment);
router.put('/:id', protect, adminOnly, updateAssignment);
router.delete('/:id', protect, adminOnly, deleteAssignment);

router.post('/:id/submit', protect, upload.single('file'), submitAssignment);
router.get('/:id/submissions', protect, getSubmissions);
router.put('/:id/grade', protect, adminOnly, gradeSubmission);

module.exports = router;
