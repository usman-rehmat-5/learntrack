const UserProgress = require('../models/UserProgress');
const Course = require('../models/Course');
const Field = require('../models/Field');
const Track = require('../models/Track');
const Badge = require('../models/Badge');
const User = require('../models/User');
const Lecture = require('../models/Lecture');

exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const completedProgresses = await UserProgress.find({ userId, isCompleted: true }).populate('courseId');

    const completedCourseIds = new Set();
    const completedTrackIds = new Set();
    const completedFieldIds = new Set();

    for (const p of completedProgresses) {
      if (p.courseId) {
        completedCourseIds.add(p.courseId._id.toString());
        if (p.courseId.trackId) completedTrackIds.add(p.courseId.trackId.toString());
        if (p.courseId.fieldId) completedFieldIds.add(p.courseId.fieldId.toString());
      }
    }

    const user = await User.findById(userId);
    const badges = await Badge.find({ userId });
    const badgeTypes = new Set(badges.map(b => b.type));

    const scores = new Map();

    // 1. Same field, different track
    if (completedFieldIds.size > 0) {
      const relatedCourses = await Course.find({ fieldId: { $in: [...completedFieldIds] } }).populate('trackId');
      for (const c of relatedCourses) {
        if (completedCourseIds.has(c._id.toString())) continue;
        const trackId = c.trackId?._id?.toString() || c.trackId?.toString();
        let score = 5;
        if (!completedTrackIds.has(trackId)) score += 3;
        if (badgeTypes.has('course_complete')) score += 2;
        scores.set(c._id.toString(), (scores.get(c._id.toString()) || 0) + score);
      }
    }

    // 2. Popular courses (most lectures completed by others)
    const popularCourses = await UserProgress.aggregate([
      { $match: { isCompleted: true } },
      { $group: { _id: '$courseId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);

    for (const p of popularCourses) {
      const cid = p._id.toString();
      if (completedCourseIds.has(cid) || scores.has(cid)) continue;
      scores.set(cid, (scores.get(cid) || 0) + p.count);
    }

    // 3. Fresh courses
    const freshCourses = await Course.find().sort({ createdAt: -1 }).limit(4);
    for (const c of freshCourses) {
      const cid = c._id.toString();
      if (completedCourseIds.has(cid) || scores.has(cid)) continue;
      scores.set(cid, (scores.get(cid) || 0) + 1);
    }

    const sorted = [...scores.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([id]) => id);

    const recommended = await Course.find({ _id: { $in: sorted } })
      .populate('fieldId', 'name')
      .populate('trackId', 'name');

    const ordered = sorted.map(id => recommended.find(c => c._id.toString() === id)).filter(Boolean);

    res.json(ordered);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPublicPreview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId)
      .populate('fieldId', 'name')
      .populate('trackId', 'name');
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const lectures = await Lecture.find({ courseId }).sort({ order: 1 }).select('title type order duration');

    res.json({ course, lectures, totalLectures: lectures.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPublicCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('fieldId', 'name')
      .populate('trackId', 'name')
      .select('title description thumbnail platform order fieldId trackId')
      .sort({ order: 1 })
      .limit(20);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
