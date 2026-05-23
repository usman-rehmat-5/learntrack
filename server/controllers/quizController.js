const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const Course = require('../models/Course');
const Lecture = require('../models/Lecture');
const UserProgress = require('../models/UserProgress');
const Certificate = require('../models/Certificate');
const Track = require('../models/Track');
const Field = require('../models/Field');
const User = require('../models/User');
const { sendCertificateEmail } = require('../utils/emailService');
const crypto = require('crypto');
const { awardPoints, POINTS } = require('./pointsController');
const { checkQuizPerfectBadge, awardCourseBadge } = require('./badgeController');
const { progressQuizScore } = require('./dailyChallengeController');

// ==============================
// Get quiz by track
// ==============================
exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ trackId: req.params.trackId });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ==============================
// Submit Quiz (UPDATED)
// ==============================
exports.submitQuiz = async (req, res) => {
  try {
    const { answers, quizId } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz)
      return res.status(404).json({ message: 'Quiz not found' });

    // Calculate Score
    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (q.correctAnswer === answers[index]) score++;
    });

    const passed = score >= Math.ceil(quiz.questions.length * 0.7);

    // Save Result
    const result = await QuizResult.create({
      userId: req.user.id,
      quizId,
      score,
      total: quiz.questions.length,
      passed
    });

    // Gamification: points & badges
    const scorePct = Math.round((score / quiz.questions.length) * 100);
    await progressQuizScore(req.user.id, scorePct);

    if (passed) {
      await awardPoints(req.user.id, 25, 'quiz_passed', `quiz-${quizId}`);
      if (score === quiz.questions.length) {
        await checkQuizPerfectBadge(req.user.id);
      }
    }

    // ==========================
    // CERTIFICATE LOGIC
    // ==========================
    if (passed) {
      const track = await Track.findById(quiz.trackId);

      if (track) {
        // Get all courses of track
        const courses = await Course.find({
          trackId: quiz.trackId
        });

        for (const course of courses) {

          const allLectures = await Lecture.find({
            courseId: course._id
          });

          if (allLectures.length === 0) continue;

          // Completed lectures
          const completedLectures = await UserProgress.find({
            userId: req.user.id,
            courseId: course._id,
            isCompleted: true
          });

          // If all lectures completed
          if (completedLectures.length >= allLectures.length) {

            await generateCertificate(
              req.user,
              course,
              quiz.trackId
            );

            await awardCourseBadge(req.user._id, course);

            // Clear active course enrollment
            await User.findByIdAndUpdate(req.user.id, {
              activeCourse: null,
              activeField: null,
              activeTrack: null,
              courseCompleted: true
            });

            break;
          }
        }
      }
    }

    res.json({
      score,
      total: quiz.questions.length,
      passed,
      result
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==============================
// Get My Quiz Results
// ==============================
exports.getMyResults = async (req, res) => {
  try {
    const results = await QuizResult.find({
      userId: req.user.id
    }).populate('quizId', 'title');

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ==============================
// Admin - Add Quiz
// ==============================
exports.addQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;

    const existing = await Quiz.findOne({
      trackId: req.params.trackId
    });

    if (existing) {
      existing.title = title;
      existing.questions = questions;
      await existing.save();
      return res.json(existing);
    }

    const quiz = await Quiz.create({
      trackId: req.params.trackId,
      title,
      questions
    });

    res.status(201).json(quiz);

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ==============================
// Admin - Delete Quiz
// ==============================
exports.deleteQuiz = async (req, res) => {
  try {
    await Quiz.findOneAndDelete({
      trackId: req.params.trackId
    });

    res.json({ message: 'Quiz deleted' });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ==============================
// Generate Certificate Function
// ==============================
async function generateCertificate(user, course, trackId) {
  try {

    // Already exists?
    const existing = await Certificate.findOne({
      userId: user._id,
      trackId: trackId
    });

    if (existing) return;

    const track = await Track.findById(trackId);
    const field = await Field.findById(course.fieldId);
    const fullUser = await User.findById(user._id);

    const certificate = await Certificate.create({
      userId: user._id,
      trackId: trackId,
      fieldId: course.fieldId,
      trackName: track?.name || 'Unknown Track',
      fieldName: field?.name || 'Unknown Field',
      userName: fullUser.name,
      certificateId: crypto
        .randomBytes(8)
        .toString('hex')
        .toUpperCase()
    });

    // Send Email
    await sendCertificateEmail(
      fullUser.email,
      fullUser.name,
      track?.name,
      field?.name
    );

    console.log(
      'Certificate generated:',
      certificate.certificateId
    );

  } catch (error) {
    console.log('Certificate error:', error.message);
  }
}