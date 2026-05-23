const Streak = require('../models/Streak');
const { checkStreakBadges } = require('./badgeController');

// Get user streak
exports.getStreak = async (req, res) => {
  try {
    let streak = await Streak.findOne({ userId: req.user.id });
    if (!streak) {
      streak = await Streak.create({ userId: req.user.id });
    }
    res.json(streak);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update streak — call this when user completes a lecture
exports.updateStreak = async (req, res) => {
  try {
    let streak = await Streak.findOne({ userId: req.user.id });
    if (!streak) {
      streak = await Streak.create({ userId: req.user.id });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActivity = streak.lastActivityDate
      ? new Date(streak.lastActivityDate)
      : null;

    if (lastActivity) {
      lastActivity.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Same day — no change
        return res.json(streak);
      } else if (diffDays === 1) {
        // Consecutive day — streak continues
        streak.currentStreak += 1;
      } else {
        // Streak broken
        streak.currentStreak = 1;
      }
    } else {
      // First activity
      streak.currentStreak = 1;
    }

    streak.lastActivityDate = today;
    streak.totalDaysActive += 1;

    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }

    await streak.save();
    await checkStreakBadges(req.user.id);
    res.json(streak);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};