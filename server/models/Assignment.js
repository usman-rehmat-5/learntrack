const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },
  trackId: { type: mongoose.Schema.Types.ObjectId, ref: 'Track', required: true },
  dueDate: { type: Date, default: null },
  totalPoints: { type: Number, default: 100 },
  fileRequired: { type: Boolean, default: true },
  instructions: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
