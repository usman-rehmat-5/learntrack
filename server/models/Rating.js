const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Ek user ek course ko sirf ek baar rate kare
ratingSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);