const User = require('../models/User');
const Course = require('../models/Course');
const Lecture = require('../models/Lecture');
const UserProgress = require('../models/UserProgress');
const Certificate = require('../models/Certificate');

exports.enrollCourse = async (req, res) => {
  try {
    const { courseId, fieldId, trackId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (user.activeCourse && user.subscriptionTier !== 'premium') {
      return res.status(400).json({
        message: 'Pehle apna current course complete karein.',
        activeCourse: user.activeCourse
      });
    }

    if (user.activeCourse && user.subscriptionTier === 'premium') {
      const alreadyEnrolled = await Course.findById(user.activeCourse);
      if (alreadyEnrolled && alreadyEnrolled._id.toString() === courseId) {
        return res.status(400).json({ message: 'Already enrolled in this course.' });
      }
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.isPremium && user.subscriptionTier !== 'premium') {
      return res.status(403).json({
        message: 'Premium subscription required to enroll in this course.',
        requiresPremium: true
      });
    }

    user.activeCourse = courseId;
    user.activeField = fieldId || course.fieldId;
    user.activeTrack = trackId || course.trackId;
    user.courseCompleted = false;
    await user.save();

    res.json({
      message: 'Enrolled successfully!',
      activeCourse: user.activeCourse,
      activeField: user.activeField,
      activeTrack: user.activeTrack
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getActiveEnrollment = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('activeCourse')
      .populate('activeField')
      .populate('activeTrack');

    if (!user.activeCourse) {
      return res.json({ enrolled: false, courseCompleted: user.courseCompleted || false });
    }

    const allLectures = await Lecture.find({ courseId: user.activeCourse._id });
    const completedLectures = await UserProgress.find({
      userId: req.user.id,
      courseId: user.activeCourse._id,
      isCompleted: true
    });

    const totalLectures = allLectures.length;
    const completedCount = completedLectures.length;
    const percent = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;
    const isCompleted = completedCount >= totalLectures && totalLectures > 0;

    const lecturesWithStatus = await Promise.all(allLectures.sort((a, b) => a.order - b.order).map(async (lecture, index) => {
      const isCompletedLecture = completedLectures.some(p => p.lectureId.toString() === lecture._id.toString());
      const isUnlocked = index === 0 || completedLectures.some(p => {
        const prevLecture = allLectures[index - 1];
        return prevLecture && p.lectureId.toString() === prevLecture._id.toString() && p.isCompleted;
      });

      return {
        _id: lecture._id,
        title: lecture.title,
        order: lecture.order,
        isCompleted: isCompletedLecture,
        isUnlocked: isUnlocked || isCompletedLecture
      };
    }));

    const certificate = await Certificate.findOne({
      userId: req.user.id,
      trackId: user.activeTrack?._id
    });

    res.json({
      enrolled: true,
      course: user.activeCourse,
      field: user.activeField,
      track: user.activeTrack,
      totalLectures,
      completedLectures: completedCount,
      percent,
      isCompleted,
      lectures: lecturesWithStatus,
      certificate: certificate || null
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.completeCourse = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.activeCourse) {
      return res.status(400).json({ message: 'No active course found' });
    }

    const allLectures = await Lecture.find({ courseId: user.activeCourse });
    const completedLectures = await UserProgress.find({
      userId: req.user.id,
      courseId: user.activeCourse,
      isCompleted: true
    });

    if (completedLectures.length < allLectures.length) {
      return res.status(400).json({ message: 'Complete all lectures first' });
    }

    user.activeCourse = null;
    user.activeField = null;
    user.activeTrack = null;
    user.courseCompleted = true;
    await user.save();

    res.json({ message: 'Course completed! You can now enroll in a new course.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.checkEnrollment = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      hasActiveCourse: !!user.activeCourse,
      activeCourse: user.activeCourse,
      courseCompleted: user.courseCompleted
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
