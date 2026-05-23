const mongoose = require('mongoose');

const pointsTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['earned', 'spent'], required: true },
  reason: { type: String, required: true },
  reference: { type: String, default: '' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

pointsTransactionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('PointsTransaction', pointsTransactionSchema);
