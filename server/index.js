const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const lectureRoutes = require('./routes/lectureRoutes');
const adminRoutes = require('./routes/adminRoutes');
const quizRoutes = require('./routes/quizRoutes');
const discussionRoutes = require('./routes/discussionRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const streakRoutes = require('./routes/streakRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const publicRoutes = require('./routes/publicRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const goalRoutes = require('./routes/goalRoutes');
const pointsRoutes = require('./routes/pointsRoutes');
const dailyChallengeRoutes = require('./routes/dailyChallengeRoutes');
const shopRoutes = require('./routes/shopRoutes');
const badgeRoutes = require('./routes/badgeRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const liveClassRoutes = require('./routes/liveClassRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const peerReviewRoutes = require('./routes/peerReviewRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const contactRoutes = require('./routes/contactRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config();

const app = express();

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Request logging
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: 'Too many requests, please try again later.' }
});
app.use(globalLimiter);

// Auth route rate limiter (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many login attempts, please try again later.' }
});

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/discussion', discussionRoutes);
app.use('/api/streak', streakRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/enrollment', enrollmentRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/points', pointsRoutes);
app.use('/api/challenges', dailyChallengeRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/live-classes', liveClassRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/peer-reviews', peerReviewRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/payment', paymentRoutes);

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'LearnTrack Server Running!' });
});

// Serve frontend for client-side routing (after API routes)
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  if (req.path.startsWith('/uploads/')) return next();
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Global error handler
app.use(errorHandler);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected ✅');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000} ✅`);
    });
  })
  .catch((err) => console.log('MongoDB Error:', err));

// Unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }
  process.exit(1);
});

  
