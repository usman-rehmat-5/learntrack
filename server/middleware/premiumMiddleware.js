const Course = require('../models/Course');
const Lecture = require('../models/Lecture');

exports.premiumOnly = (req, res, next) => {
  if (req.user.subscriptionTier !== 'premium') {
    return res.status(403).json({
      message: 'Premium subscription required. Upgrade to access this feature.',
      requiresPremium: true
    });
  }

  if (req.user.subscriptionEndDate && new Date(req.user.subscriptionEndDate) < new Date()) {
    return res.status(403).json({
      message: 'Your premium subscription has expired. Renew to continue.',
      requiresPremium: true,
      expired: true
    });
  }

  next();
};

exports.hasPremiumFeature = (feature) => {
  return (req, res, next) => {
    if (req.user.subscriptionTier !== 'premium') {
      return res.status(403).json({
        message: 'Premium subscription required.',
        requiresPremium: true
      });
    }

    if (!req.user.premiumFeatures.includes(feature)) {
      return res.status(403).json({
        message: `This feature (${feature}) is not included in your plan.`,
        requiresPremium: true
      });
    }

    if (req.user.subscriptionEndDate && new Date(req.user.subscriptionEndDate) < new Date()) {
      return res.status(403).json({
        message: 'Your premium subscription has expired.',
        requiresPremium: true,
        expired: true
      });
    }

    next();
  };
};

exports.premiumCourseAccess = async (req, res, next) => {
  try {
    const courseId = req.params.courseId || req.params.id;
    if (!courseId) return next();

    const course = await Course.findById(courseId);
    if (!course) return next();

    if (course.isPremium && req.user.subscriptionTier !== 'premium') {
      return res.status(403).json({
        message: 'Premium subscription required to access this course.',
        requiresPremium: true
      });
    }
    if (course.isPremium && req.user.subscriptionEndDate && new Date(req.user.subscriptionEndDate) < new Date()) {
      return res.status(403).json({
        message: 'Your premium subscription has expired. Renew to continue.',
        requiresPremium: true,
        expired: true
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.premiumLectureAccess = async (req, res, next) => {
  try {
    const lectureId = req.params.id;
    if (!lectureId) return next();

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) return next();

    const course = await Course.findById(lecture.courseId);
    if (!course) return next();

    if (course.isPremium && req.user.subscriptionTier !== 'premium') {
      return res.status(403).json({
        message: 'Premium subscription required to access this lecture.',
        requiresPremium: true
      });
    }
    if (course.isPremium && req.user.subscriptionEndDate && new Date(req.user.subscriptionEndDate) < new Date()) {
      return res.status(403).json({
        message: 'Your premium subscription has expired. Renew to continue.',
        requiresPremium: true,
        expired: true
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
