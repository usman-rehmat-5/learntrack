const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const UserProgress = require('../models/UserProgress');
const Streak = require('../models/Streak');
const Certificate = require('../models/Certificate');
const User = require('../models/User');

router.get('/', protect, async (req, res) => {
  try {
    // Har user ka completed lectures count
    const progressData = await UserProgress.aggregate([
      { $match: { isCompleted: true } },
      { $group: { _id: '$userId', completedLectures: { $sum: 1 } } }
    ]);

    // Har user ka certificates count
    const certData = await Certificate.aggregate([
      { $group: { _id: '$userId', certificates: { $sum: 1 } } }
    ]);

    // Har user ka streak
    const streakData = await Streak.find();

    // Sab users
    const users = await User.find({ isActive: true }).select('name email avatar role');

    // Combine data
    const leaderboard = users.map(user => {
      const progress = progressData.find(p => p._id.toString() === user._id.toString());
      const cert = certData.find(c => c._id.toString() === user._id.toString());
      const streak = streakData.find(s => s.userId.toString() === user._id.toString());

      const completedLectures = progress?.completedLectures || 0;
      const certificates = cert?.certificates || 0;
      const currentStreak = streak?.currentStreak || 0;

      // Score calculate
      const score = (completedLectures * 10) + (certificates * 50) + (currentStreak * 5);

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        completedLectures,
        certificates,
        currentStreak,
        score
      };
    });

    // Score se sort karo
    leaderboard.sort((a, b) => b.score - a.score);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;