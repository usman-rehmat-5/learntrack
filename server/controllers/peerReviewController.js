const PeerReview = require('../models/PeerReview');
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');

exports.getPendingReviews = async (req, res) => {
  try {
    const submissions = await Submission.find({
      _id: { $nin: await PeerReview.find({ reviewerId: req.user.id }).distinct('submissionId') },
      userId: { $ne: req.user.id }
    }).populate('userId', 'name email avatar').populate('assignmentId', 'title').sort({ createdAt: -1 }).limit(20);

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitReview = async (req, res) => {
  try {
    const { submissionId, clarity, completeness, creativity, comments } = req.body;

    const existing = await PeerReview.findOne({ submissionId, reviewerId: req.user.id });
    if (existing) return res.status(400).json({ message: 'Already reviewed' });

    const review = await PeerReview.create({
      submissionId, reviewerId: req.user.id,
      clarity, completeness, creativity, comments, isPublished: true
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReviewsForSubmission = async (req, res) => {
  try {
    const reviews = await PeerReview.find({ submissionId: req.params.submissionId })
      .populate('reviewerId', 'name avatar');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await PeerReview.find({ reviewerId: req.user.id })
      .populate({ path: 'submissionId', populate: { path: 'userId', select: 'name' } })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReviewsForMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user.id }).distinct('_id');
    const reviews = await PeerReview.find({ submissionId: { $in: submissions } })
      .populate('reviewerId', 'name avatar')
      .populate({ path: 'submissionId', populate: { path: 'assignmentId', select: 'title' } });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
