const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['daily', 'weekly'], required: true },
  target: { type: Number, required: true },
  progress: { type: Number, default: 0 },
  periodStart: { type: Date, default: () => new Date() },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
