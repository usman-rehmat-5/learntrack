const express = require('express');
const router = express.Router();
const {
  getAnnouncements, getAllAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement
} = require('../controllers/announcementController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getAnnouncements);
router.get('/all', protect, adminOnly, getAllAnnouncements);
router.post('/', protect, adminOnly, createAnnouncement);
router.put('/:id', protect, adminOnly, updateAnnouncement);
router.delete('/:id', protect, adminOnly, deleteAnnouncement);

module.exports = router;
