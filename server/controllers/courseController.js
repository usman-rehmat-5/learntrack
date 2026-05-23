const Course = require('../models/Course');
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');
const Lecture = require('../models/Lecture');

// Get courses by track (for users)
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      fieldId: req.params.fieldId,
      trackId: req.params.trackId
    }).sort({ order: 1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all courses (for My Courses page)
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    const user = await User.findById(req.user.id);

    const hasActiveCourse = !!user.activeCourse;

    const coursesWithProgress = await Promise.all(courses.map(async (course) => {
      const allLectures = await Lecture.find({ courseId: course._id });
      const completedLectures = await UserProgress.find({
        userId: req.user.id,
        courseId: course._id,
        isCompleted: true
      });

      const status = completedLectures.length === 0 ? 'not-started'
        : completedLectures.length >= allLectures.length ? 'completed'
        : 'in-progress';

      // Check if this course is locked (user has another active course)
      const isLocked = hasActiveCourse && user.activeCourse.toString() !== course._id.toString() && status !== 'completed';
      const isPremiumLocked = course.isPremium && user.subscriptionTier !== 'premium';
      // Also locked if completed and no active course and already completed
      const isActive = user.activeCourse?.toString() === course._id.toString();

      return {
        ...course.toObject(),
        totalLectures: allLectures.length,
        completedLectures: completedLectures.length,
        status,
        isLocked: isLocked || isPremiumLocked,
        isPremiumLocked,
        isActive
      };
    }));

    res.json({
      courses: coursesWithProgress,
      hasActiveCourse,
      activeCourseId: user.activeCourse,
      message: hasActiveCourse ? 'Pehle apna current course complete karein.' : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin - Add course
exports.addCourse = async (req, res) => {
  try {
    const { title, description, platform, order } = req.body;
    const thumbnail = req.file ? `/uploads/${req.file.filename}` : '';

    const course = await Course.create({
      fieldId: req.params.fieldId,
      trackId: req.params.trackId,
      title,
      description,
      platform,
      thumbnail,
      order: order || 0
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin - Update course
exports.updateCourse = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.thumbnail = `/uploads/${req.file.filename}`;
    }
    const course = await Course.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin - Delete course
exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get course with user progress
exports.getCourseProgress = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const user = await User.findById(req.user.id);
    const allLectures = await Lecture.find({ courseId: course._id });
    const completedLectures = await UserProgress.find({
      userId: req.user.id,
      courseId: course._id,
      isCompleted: true
    });

    const status = completedLectures.length === 0 ? 'not-started'
      : completedLectures.length >= allLectures.length ? 'completed'
      : 'in-progress';

    const isLocked = user.activeCourse && user.activeCourse.toString() !== course._id.toString() && status !== 'completed';
    const isPremiumLocked = course.isPremium && user.subscriptionTier !== 'premium';

    res.json({
      ...course.toObject(),
      totalLectures: allLectures.length,
      completedLectures: completedLectures.length,
      status,
      isLocked: isLocked || isPremiumLocked,
      isPremiumLocked,
      hasActiveCourse: !!user.activeCourse,
      activeCourseId: user.activeCourse,
      subscriptionTier: user.subscriptionTier
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};