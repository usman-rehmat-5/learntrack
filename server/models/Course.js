const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  fieldId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Field',
    required: true
  },
  trackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track',
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  platform: { type: String, required: true },
  totalLectures: { type: Number, default: 0 },
  thumbnail: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isPremium: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);