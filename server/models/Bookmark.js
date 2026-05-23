const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lectureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture',
    required: true
  }
}, { timestamps: true });

bookmarkSchema.index({ userId: 1, lectureId: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);