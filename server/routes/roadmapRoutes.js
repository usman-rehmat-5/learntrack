const express = require('express');
const router = express.Router();
const {
  getAllFieldsWithRoadmaps,
  getFieldRoadmap,
  getCareerPaths,
  getSubFieldRoadmap,
  getTrackRoadmap
} = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');

router.get('/all', protect, getAllFieldsWithRoadmaps);
router.get('/careers', protect, getCareerPaths);
router.get('/field/:fieldId', protect, getFieldRoadmap);
router.get('/field/:fieldId/sub/:subFieldName', protect, getSubFieldRoadmap);
router.get('/track/:trackId', protect, getTrackRoadmap);

module.exports = router;
