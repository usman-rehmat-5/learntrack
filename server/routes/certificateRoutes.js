const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const { protect } = require('../middleware/authMiddleware');

// Get my certificates
router.get('/my', protect, async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get certificate by ID
router.get('/:certificateId', protect, async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      certificateId: req.params.certificateId
    });
    if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;