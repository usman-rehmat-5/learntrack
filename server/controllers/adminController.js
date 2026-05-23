const Field = require('../models/Field');
const Track = require('../models/Track');
const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');
const Badge = require('../models/Badge');
const Lecture = require('../models/Lecture');

// ========== STATS ==========

exports.getStats = async (req, res) => {
  try {
    const totalFields = await Field.countDocuments();
    const totalTracks = await Track.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();

    res.json({
      totalFields,
      totalTracks,
      totalCourses,
      totalQuizzes
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ========== FIELDS ==========

exports.getFields = async (req, res) => {
  try {
    const fields = await Field.find();
    res.json(fields);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addField = async (req, res) => {
  try {
    const { name, icon, color, description } = req.body;
    const field = await Field.create({ name, icon, color, description });
    res.status(201).json(field);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateField = async (req, res) => {
  try {
    const field = await Field.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(field);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteField = async (req, res) => {
  try {
    await Field.findByIdAndDelete(req.params.id);
    await Track.deleteMany({ fieldId: req.params.id });
    res.json({ message: 'Field deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ========== TRACKS ==========

exports.getTracks = async (req, res) => {
  try {
    const tracks = await Track.find({ fieldId: req.params.fieldId });
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addTrack = async (req, res) => {
  try {
    const { name, icon, description } = req.body;
    const track = await Track.create({
      fieldId: req.params.fieldId,
      name,
      icon,
      description,
      roadmap: []
    });
    res.status(201).json(track);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTrack = async (req, res) => {
  try {
    const track = await Track.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(track);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTrack = async (req, res) => {
  try {
    await Track.findByIdAndDelete(req.params.id);
    res.json({ message: 'Track deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ========== ROADMAP ==========

exports.addRoadmapStep = async (req, res) => {
  try {
    const { title, desc, status } = req.body;
    const track = await Track.findById(req.params.trackId);
    if (!track) return res.status(404).json({ message: 'Track not found' });

    const step = track.roadmap.length + 1;
    track.roadmap.push({ step, title, desc, status });
    await track.save();
    res.json(track);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteRoadmapStep = async (req, res) => {
  try {
    const track = await Track.findById(req.params.trackId);
    if (!track) return res.status(404).json({ message: 'Track not found' });

    track.roadmap = track.roadmap.filter(
      (_, index) => index !== parseInt(req.params.stepIndex)
    );
    await track.save();
    res.json(track);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// User progress view for admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email role avatar isActive lastLogin createdAt').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const progress = await UserProgress.find({ userId })
      .populate({ path: 'courseId', select: 'title fieldId trackId' })
      .populate({ path: 'lectureId', select: 'title order' })
      .sort({ lastAccessedAt: -1 });

    const badges = await Badge.find({ userId }).sort({ createdAt: -1 });
    const courses = await Course.find({});

    const stats = {
      totalCompleted: progress.filter(p => p.isCompleted).length,
      totalInProgress: [...new Set(progress.filter(p => !p.isCompleted).map(p => p.courseId?.toString()))].length,
      totalBadges: badges.length
    };

    res.json({ progress, badges, stats, courses });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Badge awarding
exports.awardBadge = async (req, res) => {
  try {
    const { userId, type, name, description, icon } = req.body;
    const existing = await Badge.findOne({ userId, type });
    if (existing) return res.status(400).json({ message: 'Badge already awarded' });

    const badge = await Badge.create({ userId, type, name, description, icon });
    res.status(201).json(badge);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.searchAll = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.json({ fields: [], tracks: [] });

    const fields = await Field.find({
      name: { $regex: query, $options: 'i' }
    });

    const tracks = await Track.find({
      name: { $regex: query, $options: 'i' }
    }).populate('fieldId', 'name');

    res.json({ fields, tracks });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ========== PREMIUM CONTENT ==========

exports.toggleCoursePremium = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.isPremium = !course.isPremium;

    if (req.body.isPremium !== undefined) {
      course.isPremium = req.body.isPremium;
    }

    await course.save();
    res.json({ message: `Course ${course.isPremium ? 'marked as premium' : 'marked as free'}`, course });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.toggleLecturePremium = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

    lecture.isPremium = !lecture.isPremium;

    if (req.body.isPremium !== undefined) {
      lecture.isPremium = req.body.isPremium;
    }

    await lecture.save();
    res.json({ message: `Lecture ${lecture.isPremium ? 'marked as premium' : 'marked as free'}`, lecture });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPremiumContent = async (req, res) => {
  try {
    const premiumCourses = await Course.find({ isPremium: true }).populate('trackId', 'name');
    const premiumLectures = await Lecture.find({ isPremium: true }).populate('courseId', 'title');

    res.json({ premiumCourses, premiumLectures });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};