const mongoose = require('mongoose');

const peerReviewSchema = new mongoose.Schema({
  submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true },
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clarity: { type: Number, min: 1, max: 5, default: 3 },
  completeness: { type: Number, min: 1, max: 5, default: 3 },
  creativity: { type: Number, min: 1, max: 5, default: 3 },
  comments: { type: String, default: '' },
  isPublished: { type: Boolean, default: false }
}, { timestamps: true });

peerReviewSchema.index({ submissionId: 1, reviewerId: 1 }, { unique: true });

module.exports = mongoose.model('PeerReview', peerReviewSchema);
