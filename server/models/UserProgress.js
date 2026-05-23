const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
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
  lectureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture',
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  lastAccessedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);