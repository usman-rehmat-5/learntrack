const LiveClass = require('../models/LiveClass');

exports.getUpcoming = async (req, res) => {
  try {
    const now = new Date();
    const classes = await LiveClass.find({ startTime: { $gt: now }, status: { $ne: 'ended' } })
      .populate('courseId', 'title thumbnail')
      .sort({ startTime: 1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyClasses = async (req, res) => {
  try {
    const now = new Date();
    const classes = await LiveClass.find({
      $or: [
        { createdBy: req.user.id },
        { courseId: { $in: req.user.activeCourse ? [req.user.activeCourse] : [] } }
      ]
    }).populate('courseId', 'title thumbnail').sort({ startTime: -1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCourseClasses = async (req, res) => {
  try {
    const classes = await LiveClass.find({ courseId: req.params.courseId })
      .sort({ startTime: -1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createClass = async (req, res) => {
  try {
    const data = { ...req.body, createdBy: req.user.id };
    const cls = await LiveClass.create(data);
    res.status(201).json(cls);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const cls = await LiveClass.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(cls);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    await LiveClass.findByIdAndDelete(req.params.id);
    res.json({ message: 'Class deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
