const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Field = require('../models/Field');
const Certificate = require('../models/Certificate');
const Track = require('../models/Track');

router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalCourses = await Course.countDocuments();
    const totalFields = await Field.countDocuments();
    const totalCertificates = await Certificate.countDocuments();
    const totalTracks = await Track.countDocuments();

    res.json({
      totalUsers,
      totalCourses,
      totalFields,
      totalCertificates,
      totalTracks
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all fields for landing page
router.get('/fields', async (req, res) => {
  try {
    const fields = await Field.find().limit(6);
    res.json(fields);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;