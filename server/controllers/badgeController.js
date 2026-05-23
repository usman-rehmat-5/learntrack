const Badge = require('../models/Badge');
const Streak = require('../models/Streak');
const UserProgress = require('../models/UserProgress');
const QuizResult = require('../models/QuizResult');
const { awardPoints, POINTS } = require('./pointsController');

const BADGE_DEFINITIONS = [
  { type: 'course_complete', name: 'Course Completed', icon: '🎓', desc: 'Completed a full course with quiz' },
  { type: 'first_course', name: 'First Steps', icon: '🌟', desc: 'Completed your very first course' },
  { type: 'streak_7', name: 'Week Warrior', icon: '🔥', desc: 'Maintained a 7-day learning streak' },
  { type: 'streak_30', name: 'Monthly Master', icon: '💪', desc: 'Maintained a 30-day learning streak' },
  { type: 'quiz_perfect', name: 'Quiz Genius', icon: '🧠', desc: 'Got a perfect score on a quiz' },
  { type: 'lecture_master', name: 'Lecture Master', icon: '📖', desc: 'Completed 100 lectures total' },
  { type: 'points_100', name: 'Century Club', icon: '💯', desc: 'Earned 100 points' },
  { type: 'points_500', name: 'Points Collector', icon: '💰', desc: 'Earned 500 points' },
  { type: 'points_1000', name: 'Points Millionaire', icon: '👑', desc: 'Earned 1000 points' },
  { type: 'daily_challenge_streak_7', name: 'Challenge Addict', icon: '🎯', desc: 'Completed daily challenges 7 days in a row' },
  { type: 'watcher', name: 'Marathon Watcher', icon: '🎬', desc: 'Watched 500 minutes of content' },
  // Premium badges
  { type: 'premium_member', name: 'Premium Member', icon: '👑', desc: 'Subscribed to premium' },
  { type: 'premium_learner', name: 'Premium Scholar', icon: '💎', desc: 'Completed 3 premium courses' },
  { type: 'early_adopter', name: 'Early Adopter', icon: '🚀', desc: 'One of the first premium subscribers' },
];

exports.getBadgeDefinitions = async (req, res) => {
  res.json(BADGE_DEFINITIONS);
};

exports.getUserBadges = async (req, res) => {
  try {
    const badges = await Badge.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(badges);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Check and award streak badges
exports.checkStreakBadges = async (userId) => {
  try {
    const streak = await Streak.findOne({ userId });
    if (!streak) return;

    const checks = [
      { type: 'streak_7', threshold: 7 },
      { type: 'streak_30', threshold: 30 },
    ];

    for (const check of checks) {
      if (streak.currentStreak >= check.threshold || streak.longestStreak >= check.threshold) {
        const existing = await Badge.findOne({ userId, type: check.type });
        if (!existing) {
          const def = BADGE_DEFINITIONS.find(d => d.type === check.type);
          await Badge.create({ userId, type: check.type, name: def.name, icon: def.icon, description: def.desc });
          if (check.type === 'streak_7') await awardPoints(userId, POINTS.STREAK_7_BONUS, 'streak_7_badge', 'badge-streak-7');
          if (check.type === 'streak_30') await awardPoints(userId, POINTS.STREAK_30_BONUS, 'streak_30_badge', 'badge-streak-30');
        }
      }
    }
  } catch (e) {
    console.log('Streak badge error:', e.message);
  }
};

// Check and award lecture_master badge
exports.checkLectureMasterBadge = async (userId) => {
  try {
    const count = await UserProgress.countDocuments({ userId, isCompleted: true });
    if (count >= 100) {
      const existing = await Badge.findOne({ userId, type: 'lecture_master' });
      if (!existing) {
        const def = BADGE_DEFINITIONS.find(d => d.type === 'lecture_master');
        await Badge.create({ userId, type: 'lecture_master', name: def.name, icon: def.icon, description: def.desc });
      }
    }
  } catch (e) {
    console.log('Lecture master badge error:', e.message);
  }
};

// Check and award watcher badge (500 min watched)
exports.checkWatcherBadge = async (userId) => {
  try {
    const progresses = await UserProgress.find({ userId, isCompleted: true }).populate('lectureId');
    const totalMinutes = progresses.reduce((sum, p) => sum + (p.lectureId?.duration || 0), 0);
    if (totalMinutes >= 500) {
      const existing = await Badge.findOne({ userId, type: 'watcher' });
      if (!existing) {
        const def = BADGE_DEFINITIONS.find(d => d.type === 'watcher');
        await Badge.create({ userId, type: 'watcher', name: def.name, icon: def.icon, description: def.desc });
      }
    }
  } catch (e) {
    console.log('Watcher badge error:', e.message);
  }
};

// Check and award first_course badge
exports.checkFirstCourseBadge = async (userId) => {
  try {
    const existing = await Badge.findOne({ userId, type: 'first_course' });
    if (!existing) {
      const completed = await UserProgress.countDocuments({ userId, isCompleted: true });
      if (completed > 0) {
        const def = BADGE_DEFINITIONS.find(d => d.type === 'first_course');
        await Badge.create({ userId, type: 'first_course', name: def.name, icon: def.icon, description: def.desc });
        await awardPoints(userId, POINTS.FIRST_COURSE_BONUS, 'first_course_badge', 'badge-first-course');
      }
    }
  } catch (e) {
    console.log('First course badge error:', e.message);
  }
};

// Check and award quiz_perfect badge
exports.checkQuizPerfectBadge = async (userId) => {
  try {
    const perfect = await QuizResult.findOne({ userId, passed: true });
    if (perfect && perfect.score === perfect.total) {
      const existing = await Badge.findOne({ userId, type: 'quiz_perfect' });
      if (!existing) {
        const def = BADGE_DEFINITIONS.find(d => d.type === 'quiz_perfect');
        await Badge.create({ userId, type: 'quiz_perfect', name: def.name, icon: def.icon, description: def.desc });
        await awardPoints(userId, POINTS.QUIZ_PERFECT, 'quiz_perfect_badge', 'badge-quiz-perfect');
      }
    }
  } catch (e) {
    console.log('Quiz perfect badge error:', e.message);
  }
};

// Award course badge (shared with lecture & quiz controllers)
exports.awardCourseBadge = async (userId, course) => {
  try {
    const existing = await Badge.findOne({ userId, type: 'course_complete' });
    if (existing) return;

    await Badge.create({
      userId,
      type: 'course_complete',
      name: 'Course Completed',
      description: `Completed: ${course.title}`,
      icon: '🎓',
      metadata: { courseId: course._id, courseTitle: course.title }
    });
  } catch (e) {
    console.log('Badge error:', e.message);
  }
};

// Check and award premium_member badge
exports.checkPremiumMemberBadge = async (userId) => {
  try {
    const existing = await Badge.findOne({ userId, type: 'premium_member' });
    if (!existing) {
      const def = BADGE_DEFINITIONS.find(d => d.type === 'premium_member');
      await Badge.create({ userId, type: 'premium_member', name: def.name, icon: def.icon, description: def.desc });
      await awardPoints(userId, 150, 'premium_member_badge', 'badge-premium-member');
    }
  } catch (e) {
    console.log('Premium member badge error:', e.message);
  }
};

exports.checkEarlyAdopterBadge = async (userId) => {
  try {
    const existing = await Badge.findOne({ userId, type: 'early_adopter' });
    if (!existing) {
      const def = BADGE_DEFINITIONS.find(d => d.type === 'early_adopter');
      await Badge.create({ userId, type: 'early_adopter', name: def.name, icon: def.icon, description: def.desc });
      await awardPoints(userId, 200, 'early_adopter_badge', 'badge-early-adopter');
    }
  } catch (e) {
    console.log('Early adopter badge error:', e.message);
  }
};

// Admin: manually award a badge
exports.awardBadge = async (req, res) => {
  try {
    const { userId, type } = req.body;
    const def = BADGE_DEFINITIONS.find(d => d.type === type);
    if (!def) return res.status(400).json({ message: 'Invalid badge type' });

    const existing = await Badge.findOne({ userId, type });
    if (existing) return res.status(400).json({ message: 'User already has this badge' });

    const badge = await Badge.create({
      userId, type, name: def.name, icon: def.icon, description: def.desc
    });
    res.status(201).json(badge);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
