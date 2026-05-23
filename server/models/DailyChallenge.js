const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  type: { type: String, enum: ['complete_lectures', 'watch_minutes', 'login_streak', 'quiz_score', 'complete_course'], required: true },
  target: { type: Number, required: true },
  progress: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  points: { type: Number, required: true },
  icon: { type: String, default: '⭐' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { _id: false });

const dailyChallengeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  challenges: [challengeSchema],
  totalPointsEarned: { type: Number, default: 0 },
  allCompleted: { type: Boolean, default: false }
}, { timestamps: true });

dailyChallengeSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyChallenge', dailyChallengeSchema);
