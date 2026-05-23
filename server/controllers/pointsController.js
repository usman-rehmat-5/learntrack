const User = require('../models/User');
const PointsTransaction = require('../models/PointsTransaction');
const Badge = require('../models/Badge');

const POINTS = {
  LECTURE_COMPLETE: 10,
  COURSE_COMPLETE: 50,
  DAILY_CHALLENGE: 25,
  FIRST_COURSE_BONUS: 100,
  STREAK_7_BONUS: 50,
  STREAK_30_BONUS: 200,
  QUIZ_PERFECT: 75
};

async function checkPointsBadges(userId, totalPoints) {
  const thresholds = [
    { type: 'points_100', threshold: 100, name: 'Century Club', icon: '💯', desc: 'Earned 100 points' },
    { type: 'points_500', threshold: 500, name: 'Points Collector', icon: '💰', desc: 'Earned 500 points' },
    { type: 'points_1000', threshold: 1000, name: 'Points Millionaire', icon: '👑', desc: 'Earned 1000 points' },
  ];
  for (const t of thresholds) {
    if (totalPoints >= t.threshold) {
      const existing = await Badge.findOne({ userId, type: t.type });
      if (!existing) {
        await Badge.create({ userId, type: t.type, name: t.name, icon: t.icon, description: t.desc });
      }
    }
  }
}

async function awardPoints(userId, amount, reason, reference = '', metadata = {}) {
  const user = await User.findByIdAndUpdate(userId, {
    $inc: { points: amount, totalPointsEarned: amount }
  }, { new: true });

  await PointsTransaction.create({
    userId, amount, type: 'earned', reason, reference, metadata
  });

  await checkPointsBadges(userId, user.totalPointsEarned);

  return user.points;
}

exports.awardPoints = awardPoints;
exports.POINTS = POINTS;

exports.getPoints = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('points totalPointsEarned');
    res.json({ points: user.points, totalPointsEarned: user.totalPointsEarned });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const transactions = await PointsTransaction.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await PointsTransaction.countDocuments({ userId: req.user.id });
    res.json({ transactions, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ role: 'user', isActive: true })
      .select('name avatar points totalPointsEarned')
      .sort({ points: -1 })
      .limit(50);
    res.json(users.map((u, i) => ({ rank: i + 1, ...u.toObject() })));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
