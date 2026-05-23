const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['course_complete', 'streak_7', 'streak_30', 'quiz_perfect', 'first_course', 'lecture_master', 'points_100', 'points_500', 'points_1000', 'daily_challenge_streak_7', 'watcher', 'premium_member', 'premium_learner', 'early_adopter'], required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '🏆' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

badgeSchema.index({ userId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Badge', badgeSchema);
