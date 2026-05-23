const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  author: { type: String },
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
}, { timestamps: true });

const discussionSchema = new mongoose.Schema({
  trackId: { type: mongoose.Schema.Types.ObjectId, ref: 'Track', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  author: { type: String },
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  replies: [replySchema]
}, { timestamps: true });

module.exports = mongoose.model('Discussion', discussionSchema);