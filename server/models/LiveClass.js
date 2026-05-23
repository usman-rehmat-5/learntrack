const mongoose = require('mongoose');

const liveClassSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  instructor: { type: String, default: '' },
  platform: { type: String, enum: ['zoom', 'google_meet', 'other'], required: true },
  meetingLink: { type: String, required: true },
  meetingId: { type: String, default: '' },
  password: { type: String, default: '' },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },
  trackId: { type: mongoose.Schema.Types.ObjectId, ref: 'Track', default: null },
  fieldId: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', default: null },
  recordedVideo: { type: String, default: '' },
  status: { type: String, enum: ['scheduled', 'live', 'ended'], default: 'scheduled' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('LiveClass', liveClassSchema);
