const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['youtube', 'video'],
    required: true
  },
  youtubeUrl: {
    type: String,
    default: ''
  },
  videoPath: {
    type: String,
    default: ''
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    default: 0
  },
  isPremium: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Lecture', lectureSchema);