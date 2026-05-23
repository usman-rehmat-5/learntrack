const Rating = require('../models/Rating');
const Course = require('../models/Course');

// Get course ratings
exports.getCourseRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ courseId: req.params.courseId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });

    const totalRatings = ratings.length;
    const avgRating = totalRatings > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1)
      : 0;

    res.json({ ratings, avgRating, totalRatings });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add or update rating
exports.addRating = async (req, res) => {
  try {
    const { rating, review } = req.body;

    const existing = await Rating.findOne({
      userId: req.user.id,
      courseId: req.params.courseId
    });

    if (existing) {
      existing.rating = rating;
      existing.review = review;
      await existing.save();
      return res.json(existing);
    }

    const newRating = await Rating.create({
      userId: req.user.id,
      courseId: req.params.courseId,
      rating,
      review
    });

    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get my rating for a course
exports.getMyRating = async (req, res) => {
  try {
    const rating = await Rating.findOne({
      userId: req.user.id,
      courseId: req.params.courseId
    });
    res.json(rating);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete rating
exports.deleteRating = async (req, res) => {
  try {
    await Rating.findOneAndDelete({
      userId: req.user.id,
      courseId: req.params.courseId
    });
    res.json({ message: 'Rating deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};