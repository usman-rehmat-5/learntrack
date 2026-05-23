const mongoose = require('mongoose');

const lectureNoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lectureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  content: {
    type: String,
    default: ''
  }
}, { timestamps: true });

lectureNoteSchema.index({ userId: 1, lectureId: 1 }, { unique: true });

module.exports = mongoose.model('LectureNote', lectureNoteSchema);