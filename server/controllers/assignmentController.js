const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const User = require('../models/User');
const PointsTransaction = require('../models/PointsTransaction');

exports.getTrackAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ trackId: req.params.trackId }).sort({ dueDate: -1 });
    const userId = req.user.id;
    const withStatus = await Promise.all(assignments.map(async (a) => {
      const sub = await Submission.findOne({ assignmentId: a._id, userId });
      return { ...a.toObject(), submitted: !!sub, submission: sub || null };
    }));
    res.json(withStatus);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    const data = { ...req.body, createdBy: req.user.id };
    const assignment = await Assignment.create(data);
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    const filePath = req.file ? `/uploads/${req.file.filename}` : '';
    const { textContent } = req.body;

    let submission = await Submission.findOne({ assignmentId, userId: req.user.id });
    if (submission) {
      submission.filePath = filePath || submission.filePath;
      submission.textContent = textContent || submission.textContent;
      submission.status = 'submitted';
      await submission.save();
    } else {
      submission = await Submission.create({ assignmentId, userId: req.user.id, filePath, textContent });
      await User.findByIdAndUpdate(req.user.id, { $inc: { points: 5 } });
      await PointsTransaction.create({ userId: req.user.id, amount: 5, type: 'earned', reason: 'Assignment submitted', reference: assignmentId });
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ assignmentId: req.params.id })
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.gradeSubmission = async (req, res) => {
  try {
    const { grade, feedback } = req.body;
    const submission = await Submission.findByIdAndUpdate(req.params.id,
      { grade, feedback, status: 'reviewed', gradedBy: req.user.id }, { new: true });
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user.id })
      .populate('assignmentId', 'title totalPoints')
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
