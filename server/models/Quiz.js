const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  trackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track',
    required: true
  },
  title: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      options: [{ type: String }],
      correctAnswer: { type: Number, required: true }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);