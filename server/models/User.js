const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
  avatar: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date, default: null },
  activeCourse: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },
  activeField: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', default: null },
  activeTrack: { type: mongoose.Schema.Types.ObjectId, ref: 'Track', default: null },
  courseCompleted: { type: Boolean, default: false },

  // Email verification
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String, default: null },
  emailVerificationExpires: { type: Date, default: null },

  // Password reset
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },

  // 2FA
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String, default: null },

  // Session management
  tokenVersion: { type: Number, default: 0 },

  // Gamification
  points: { type: Number, default: 0 },
  totalPointsEarned: { type: Number, default: 0 },

  // Premium / Subscription
  subscriptionTier: { type: String, enum: ['free', 'premium'], default: 'free' },
  subscriptionStartDate: { type: Date, default: null },
  subscriptionEndDate: { type: Date, default: null },
  premiumFeatures: [{ type: String }] // e.g. ['concurrent_courses', 'premium_badges', 'advanced_analytics', 'downloads', 'priority_support']
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
