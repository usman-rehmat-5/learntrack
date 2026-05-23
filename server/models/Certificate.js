const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track',
    required: true
  },
  fieldId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Field',
    required: true
  },
  trackName: { type: String, required: true },
  fieldName: { type: String, required: true },
  userName: { type: String, required: true },
  issuedAt: { type: Date, default: Date.now },
  certificateId: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);