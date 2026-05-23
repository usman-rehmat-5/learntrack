const User = require('../models/User');
const Field = require('../models/Field');
const Track = require('../models/Track');
const Course = require('../models/Course');
const Lecture = require('../models/Lecture');
const ActivityLog = require('../models/ActivityLog');
const Quiz = require('../models/Quiz');
const Certificate = require('../models/Certificate');
const { checkPremiumMemberBadge } = require('./badgeController');

exports.getStats = async (req, res) => {
  try {
    const [
      totalUsers, totalAdmins, totalSuperadmins,
      totalFields, totalTracks, totalCourses,
      totalQuizzes, totalCertificates, activeUsers
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ role: 'superadmin' }),
      Field.countDocuments(),
      Track.countDocuments(),
      Course.countDocuments(),
      Quiz.countDocuments(),
      Certificate.countDocuments(),
      User.countDocuments({ isActive: true })
    ]);

    res.json({
      totalUsers, totalAdmins, totalSuperadmins,
      totalFields, totalTracks, totalCourses,
      totalQuizzes, totalCertificates, activeUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 50, search, role, status } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) query.role = role;
    if (status === 'active') query.isActive = true;
    else if (status === 'disabled') query.isActive = false;

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit)),
      User.countDocuments(query)
    ]);

    res.json({ users, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.changeRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin', 'superadmin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    await ActivityLog.create({ userId: req.user._id, action: 'change_role', targetModel: 'User', targetId: req.params.id, metadata: { newRole: role } });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot toggle yourself' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    await ActivityLog.create({ userId: req.user._id, action: user.isActive ? 'enable_user' : 'disable_user', targetModel: 'User', targetId: req.params.id });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }
    await Promise.all([
      User.findByIdAndDelete(req.params.id),
      ActivityLog.create({ userId: req.user._id, action: 'delete_user', targetModel: 'User', targetId: req.params.id })
    ]);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Edit yourself from profile page' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { name, email }, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.batchToggle = async (req, res) => {
  try {
    const { userIds, action } = req.body;
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'Provide user IDs array' });
    }
    const filter = { _id: { $in: userIds, $ne: req.user._id } };
    if (action === 'enable') {
      await User.updateMany(filter, { isActive: true });
    } else if (action === 'disable') {
      await User.updateMany(filter, { isActive: false });
    } else if (action === 'makeAdmin') {
      await User.updateMany(filter, { role: 'admin' });
    } else if (action === 'makeUser') {
      await User.updateMany(filter, { role: 'user' });
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }
    await ActivityLog.create({ userId: req.user._id, action: 'batch_' + action, metadata: { userIds, count: userIds.length } });
    res.json({ message: `Batch ${action} applied to ${userIds.length} users` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getActivityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action } = req.query;
    const query = {};
    if (action) query.action = action;

    const [logs, total] = await Promise.all([
      ActivityLog.find(query)
        .populate('userId', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit)),
      ActivityLog.countDocuments(query)
    ]);

    res.json({ logs, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserDetail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const [activityLogs, enrollments, certificates] = await Promise.all([
      ActivityLog.find({ userId: req.params.id }).sort({ createdAt: -1 }).limit(20),
      Course.find({ enrolledUsers: req.params.id }).select('title fieldId trackId').limit(10),
      Certificate.find({ userId: req.params.id }).sort({ createdAt: -1 }).limit(10)
    ]);

    res.json({ user, activityLogs, enrollments, certificates });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSystemHealth = async (req, res) => {
  try {
    const now = new Date();
    const last24h = new Date(now - 24 * 60 * 60 * 1000);
    const last7d = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const [
      newUsers24h, newUsers7d, newUsers30d,
      activeUsers24h,
      recentLogins,
      totalLogins,
      completedCourses,
      issuedCertificates
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: last24h } }),
      User.countDocuments({ createdAt: { $gte: last7d } }),
      User.countDocuments({ createdAt: { $gte: last30d } }),
      User.countDocuments({ lastLogin: { $gte: last24h } }),
      ActivityLog.countDocuments({ action: 'login', createdAt: { $gte: last24h } }),
      ActivityLog.countDocuments({ action: 'login' }),
      Course.countDocuments({ status: 'completed' }),
      Certificate.countDocuments({ createdAt: { $gte: last30d } })
    ]);

    res.json({
      newUsers24h, newUsers7d, newUsers30d,
      activeUsers24h, recentLogins, totalLogins,
      completedCourses, issuedCertificates,
      timestamp: now
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ========== Premium Management ==========

exports.getPremiumUsers = async (req, res) => {
  try {
    const { page = 1, limit = 50, search, expired } = req.query;
    const query = { subscriptionTier: 'premium' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (expired === 'true') {
      query.subscriptionEndDate = { $lt: new Date() };
    } else if (expired === 'false') {
      query.subscriptionEndDate = { $gte: new Date() };
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('name email subscriptionTier subscriptionStartDate subscriptionEndDate premiumFeatures points')
        .sort({ subscriptionEndDate: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit)),
      User.countDocuments(query)
    ]);

    res.json({ users, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.setUserPremium = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { tier, durationDays } = req.body;

    if (!['premium', 'free'].includes(tier)) {
      return res.status(400).json({ message: 'Tier must be "premium" or "free"' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const allFeatures = [
      'concurrent_courses', 'premium_badges', 'advanced_analytics',
      'downloads', 'priority_support', 'premium_courses', 'exclusive_shop_items'
    ];

    if (tier === 'premium') {
      const now = new Date();
      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() + (durationDays || 30));

      user.subscriptionTier = 'premium';
      user.subscriptionStartDate = now;
      user.subscriptionEndDate = endDate;
      user.premiumFeatures = allFeatures;

      await user.save();
      await checkPremiumMemberBadge(userId);
    } else {
      user.subscriptionTier = 'free';
      user.subscriptionStartDate = null;
      user.subscriptionEndDate = null;
      user.premiumFeatures = [];
      await user.save();
    }

    await ActivityLog.create({
      userId: req.user._id,
      action: tier === 'premium' ? 'set_premium' : 'remove_premium',
      targetModel: 'User',
      targetId: userId,
      metadata: { durationDays: durationDays || null }
    });

    res.json({
      message: `User ${tier === 'premium' ? 'upgraded to premium' : 'downgraded to free'}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscriptionTier: user.subscriptionTier,
        subscriptionEndDate: user.subscriptionEndDate,
        premiumFeatures: user.premiumFeatures
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPremiumContent = async (req, res) => {
  try {
    const [premiumCourses, premiumLectures] = await Promise.all([
      Course.find({ isPremium: true }).populate('fieldId', 'name').populate('trackId', 'name').sort({ updatedAt: -1 }),
      Lecture.find({ isPremium: true }).populate('courseId', 'title').sort({ updatedAt: -1 })
    ]);

    const premiumStats = {
      totalPremiumUsers: await User.countDocuments({ subscriptionTier: 'premium' }),
      activePremiumUsers: await User.countDocuments({
        subscriptionTier: 'premium',
        subscriptionEndDate: { $gte: new Date() }
      }),
      expiredPremiumUsers: await User.countDocuments({
        subscriptionTier: 'premium',
        subscriptionEndDate: { $lt: new Date() }
      }),
      totalPremiumCourses: premiumCourses.length,
      totalPremiumLectures: premiumLectures.length
    };

    res.json({ premiumStats, premiumCourses, premiumLectures });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.toggleCoursePremium = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.isPremium = !course.isPremium;
    await course.save();

    await ActivityLog.create({
      userId: req.user._id,
      action: course.isPremium ? 'set_course_premium' : 'remove_course_premium',
      targetModel: 'Course',
      targetId: course._id,
      metadata: { title: course.title }
    });

    res.json({ message: `Course ${course.isPremium ? 'marked as premium' : 'removed from premium'}`, course });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.toggleLecturePremium = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

    lecture.isPremium = !lecture.isPremium;
    await lecture.save();

    await ActivityLog.create({
      userId: req.user._id,
      action: lecture.isPremium ? 'set_lecture_premium' : 'remove_lecture_premium',
      targetModel: 'Lecture',
      targetId: lecture._id,
      metadata: { title: lecture.title }
    });

    res.json({ message: `Lecture ${lecture.isPremium ? 'marked as premium' : 'removed from premium'}`, lecture });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
