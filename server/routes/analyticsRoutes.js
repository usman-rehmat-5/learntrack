const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Course = require('../models/Course');
const Lecture = require('../models/Lecture');
const UserProgress = require('../models/UserProgress');
const Certificate = require('../models/Certificate');
const QuizResult = require('../models/QuizResult');
const Discussion = require('../models/Discussion');
const Streak = require('../models/Streak');
const ActivityLog = require('../models/ActivityLog');

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    // Basic counts
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalCourses = await Course.countDocuments();
    const totalLectures = await Lecture.countDocuments();
    const totalCertificates = await Certificate.countDocuments();
    const totalDiscussions = await Discussion.countDocuments();

    // Active users (logged in last 7 days)
    const activeStreaks = await Streak.countDocuments({
      lastActivityDate: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    });

    // Total completed lectures
    const totalCompletedLectures = await UserProgress.countDocuments({ isCompleted: true });

    // Quiz stats
    const totalQuizAttempts = await QuizResult.countDocuments();
    const passedQuizzes = await QuizResult.countDocuments({ passed: true });

    // Most active users
    const topUsers = await UserProgress.aggregate([
      { $match: { isCompleted: true } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.name',
          email: '$user.email',
          completedLectures: '$count'
        }
      }
    ]);

    // Most popular courses
    const popularCourses = await UserProgress.aggregate([
      { $group: { _id: '$courseId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course'
        }
      },
      { $unwind: '$course' },
      {
        $project: {
          title: '$course.title',
          platform: '$course.platform',
          totalProgress: '$count'
        }
      }
    ]);

    // New users per day (last 7 days)
    const newUsersPerDay = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      overview: {
        totalUsers,
        totalAdmins,
        totalCourses,
        totalLectures,
        totalCertificates,
        totalDiscussions,
        activeUsers: activeStreaks,
        totalCompletedLectures,
        totalQuizAttempts,
        passedQuizzes,
        quizPassRate: totalQuizAttempts > 0
          ? Math.round((passedQuizzes / totalQuizAttempts) * 100)
          : 0
      },
      topUsers,
      popularCourses,
      newUsersPerDay
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Activity logs
router.get('/activity', protect, adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      ActivityLog.find()
        .populate('userId', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ActivityLog.countDocuments()
    ]);

    const recentLogins = await ActivityLog.find({ action: 'login' })
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const actionCounts = await ActivityLog.aggregate([
      { $group: { _id: '$action', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const activityByDay = await ActivityLog.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      logs,
      recentLogins,
      actionCounts,
      activityByDay,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;