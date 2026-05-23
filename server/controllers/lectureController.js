const Lecture = require('../models/Lecture');
const Course = require('../models/Course');
const UserProgress = require('../models/UserProgress');
const Certificate = require('../models/Certificate');
const Track = require('../models/Track');
const Field = require('../models/Field');
const User = require('../models/User');
const QuizResult = require('../models/QuizResult');
const LectureNote = require('../models/LectureNote');
const Bookmark = require('../models/Bookmark');
const { sendCertificateEmail } = require('../utils/emailService');
const crypto = require('crypto');
const Streak = require('../models/Streak');
const Badge = require('../models/Badge');
const { awardPoints, POINTS } = require('./pointsController');
const { checkStreakBadges, checkLectureMasterBadge, checkWatcherBadge, checkFirstCourseBadge, awardCourseBadge } = require('./badgeController');
const { progressLectureComplete, progressStreakChallenge, progressCourseComplete, progressWatchMinutes } = require('./dailyChallengeController');

// Get all lectures of a course ✅ Added locked/unlocked status
exports.getLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find({ courseId: req.params.courseId }).sort({ order: 1 });

    const lecturesWithStatus = await Promise.all(lectures.map(async (lecture, index) => {
      const progress = await UserProgress.findOne({
        userId: req.user._id,
        lectureId: lecture._id
      });

      const isCompleted = progress?.isCompleted || false;

      // First lecture is always unlocked
      // Other lectures unlocked only if previous is completed
      let isUnlocked = false;
      if (index === 0) {
        isUnlocked = true;
      } else {
        const prevLecture = lectures[index - 1];
        const prevProgress = await UserProgress.findOne({
          userId: req.user._id,
          lectureId: prevLecture._id,
          isCompleted: true
        });
        isUnlocked = !!prevProgress;
      }

      return {
        ...lecture.toObject(),
        isCompleted,
        isUnlocked
      };
    }));

    res.json(lecturesWithStatus);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add lecture ✅ Original same
exports.addLecture = async (req, res) => {
  try {
    const { title, type, youtubeUrl, order, duration } = req.body;
    const videoPath = req.file ? `/uploads/${req.file.filename}` : '';
    const lecturesCount = await Lecture.countDocuments({ courseId: req.params.courseId });

    const lecture = await Lecture.create({
      courseId: req.params.courseId,
      title,
      type,
      youtubeUrl: youtubeUrl || '',
      videoPath,
      order: order || lecturesCount + 1,
      duration: duration || 0
    });

    // Update total lectures count in course
    await Course.findByIdAndUpdate(req.params.courseId, {
      $inc: { totalLectures: 1 }
    });

    res.status(201).json(lecture);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark lecture complete/incomplete ✅ Upgraded with UserProgress + Certificate + Streak
exports.toggleComplete = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

    const allLectures = await Lecture.find({ courseId: lecture.courseId }).sort({ order: 1 });
    const currentIndex = allLectures.findIndex(l => l._id.toString() === lecture._id.toString());

    // Sequential unlock: check if previous lecture is completed
    if (currentIndex > 0) {
      const prevLecture = allLectures[currentIndex - 1];
      const prevProgress = await UserProgress.findOne({
        userId: req.user._id,
        lectureId: prevLecture._id,
        isCompleted: true
      });
      if (!prevProgress) {
        return res.status(400).json({
          message: 'Pehle previous lecture complete karein.',
          locked: true
        });
      }
    }

    // If trying to un-complete, only allow for the last completed lecture
    let progress = await UserProgress.findOne({
      userId: req.user._id,
      lectureId: lecture._id
    });

    if (progress) {
      if (progress.isCompleted) {
        // Check that no next lecture is already completed
        if (currentIndex < allLectures.length - 1) {
          const nextLecture = allLectures[currentIndex + 1];
          const nextProgress = await UserProgress.findOne({
            userId: req.user._id,
            lectureId: nextLecture._id,
            isCompleted: true
          });
          if (nextProgress) {
            return res.status(400).json({
              message: 'Pehle agle lecture ko incomplete karein.',
              locked: true
            });
          }
        }
      }
      progress.isCompleted = !progress.isCompleted;
      await progress.save();
    } else {
      progress = await UserProgress.create({
        userId: req.user._id,
        courseId: lecture.courseId,
        lectureId: lecture._id,
        isCompleted: true
      });
    }

    // ✅ Streak update — sirf tab jab lecture complete ho raha ho (incomplete nahi)
    if (progress.isCompleted) {
      let streak = await Streak.findOne({ userId: req.user._id });
      if (!streak) streak = await Streak.create({ userId: req.user._id });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const lastActivity = streak.lastActivityDate ? new Date(streak.lastActivityDate) : null;

      if (lastActivity) {
        lastActivity.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          streak.currentStreak += 1;
        } else if (diffDays > 1) {
          streak.currentStreak = 1;
        }
      } else {
        streak.currentStreak = 1;
      }

      streak.lastActivityDate = today;
      streak.totalDaysActive += 1;

      if (streak.currentStreak > streak.longestStreak) {
        streak.longestStreak = streak.currentStreak;
      }

      await streak.save();

      // Gamification: award points and progress daily challenges
      await awardPoints(req.user._id, POINTS.LECTURE_COMPLETE, 'lecture_complete', `lecture-${lecture._id}`);
      await progressLectureComplete(req.user._id);
      await progressStreakChallenge(req.user._id);
      await checkStreakBadges(req.user._id);
      await checkLectureMasterBadge(req.user._id);
      await checkWatcherBadge(req.user._id);
      await checkFirstCourseBadge(req.user._id);
    }

    // Course ka sab lectures
    const completedProgresses = await UserProgress.find({
      userId: req.user._id,
      courseId: lecture.courseId,
      isCompleted: true
    });

    const completedCount = completedProgresses.length;
    const status = completedCount === 0 ? 'not-started'
      : completedCount >= allLectures.length ? 'completed'
      : 'in-progress';

    // Course progress update
    await Course.findByIdAndUpdate(lecture.courseId, {
      completedLectures: completedCount,
      status
    });

    // ✅ Certificate check — sab lectures complete hone par
    if (completedCount >= allLectures.length) {
      const course = await Course.findById(lecture.courseId);

      // Quiz passed check
      const quizResult = await QuizResult.findOne({
        userId: req.user._id,
        passed: true
      }).populate('quizId');

      const quizPassed = quizResult &&
        quizResult.quizId?.trackId?.toString() === course.trackId?.toString();

      await progressCourseComplete(req.user._id);

      if (quizPassed) {
        await generateCertificate(req.user, course);
        await awardCourseBadge(req.user._id, course);
        await awardPoints(req.user._id, POINTS.COURSE_COMPLETE, 'course_complete', `course-${course._id}`);
        await checkFirstCourseBadge(req.user._id);
        // Clear active course enrollment
        await User.findByIdAndUpdate(req.user._id, {
          activeCourse: null,
          activeField: null,
          activeTrack: null,
          courseCompleted: true
        });
      }
    }

    // ✅ Response mein progress + completedCount dono
    res.json({ progress, completedCount, status });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete lecture ✅ Original same
exports.deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

    await Lecture.findByIdAndDelete(req.params.id);

    // Update total lectures count
    await Course.findByIdAndUpdate(lecture.courseId, {
      $inc: { totalLectures: -1 }
    });

    res.json({ message: 'Lecture deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Track recently watched lecture
exports.updateLastWatched = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

    let progress = await UserProgress.findOne({
      userId: req.user._id,
      lectureId: lecture._id
    });

    if (progress) {
      progress.lastAccessedAt = new Date();
      await progress.save();
    } else {
      progress = await UserProgress.create({
        userId: req.user._id,
        courseId: lecture.courseId,
        lectureId: lecture._id,
        isCompleted: false,
        lastAccessedAt: new Date()
      });
    }

    // Track watch minutes for daily challenges
    if (lecture.duration) {
      await progressWatchMinutes(req.user._id, lecture.duration);
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get recently watched lecture for a course
exports.getLastWatched = async (req, res) => {
  try {
    const progress = await UserProgress.findOne({
      userId: req.user._id,
      courseId: req.params.courseId
    }).sort({ lastAccessedAt: -1 });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get notes for a lecture
exports.getNotes = async (req, res) => {
  try {
    let note = await LectureNote.findOne({
      userId: req.user._id,
      lectureId: req.params.id
    });
    res.json(note || { content: '' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Save notes for a lecture
exports.saveNotes = async (req, res) => {
  try {
    const { content } = req.body;
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

    let note = await LectureNote.findOne({
      userId: req.user._id,
      lectureId: req.params.id
    });

    if (note) {
      note.content = content;
      await note.save();
    } else {
      note = await LectureNote.create({
        userId: req.user._id,
        lectureId: req.params.id,
        courseId: lecture.courseId,
        content
      });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle bookmark for a lecture
exports.toggleBookmark = async (req, res) => {
  try {
    const existing = await Bookmark.findOne({
      userId: req.user._id,
      lectureId: req.params.id
    });

    if (existing) {
      await existing.deleteOne();
      return res.json({ bookmarked: false });
    }

    await Bookmark.create({
      userId: req.user._id,
      lectureId: req.params.id
    });

    res.json({ bookmarked: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get bookmarked lecture IDs for a course
exports.getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id })
      .populate('lectureId');
    const lectureIds = bookmarks
      .filter(b => b.lectureId && b.lectureId.courseId?.toString() === req.params.courseId)
      .map(b => b.lectureId._id.toString());
    res.json(lectureIds);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Bulk add lectures
exports.bulkAddLectures = async (req, res) => {
  try {
    const { lectures } = req.body;
    if (!Array.isArray(lectures) || lectures.length === 0) {
      return res.status(400).json({ message: 'Provide a non-empty array of lectures' });
    }

    const courseId = req.params.courseId;
    const existingCount = await Lecture.countDocuments({ courseId });

    const missingTitle = lectures.findIndex(l => !l.title);
    if (missingTitle !== -1) {
      return res.status(400).json({ message: `Lecture at index ${missingTitle} is missing required field: title` });
    }

    const toInsert = lectures.map((l, i) => ({
      courseId,
      title: l.title,
      type: l.type || 'youtube',
      youtubeUrl: l.youtubeUrl || '',
      videoPath: l.videoPath || '',
      order: l.order || existingCount + i + 1,
      duration: l.duration || 0,
      description: l.description || ''
    }));

    const inserted = await Lecture.insertMany(toInsert);

    await Course.findByIdAndUpdate(courseId, {
      $inc: { totalLectures: inserted.length }
    });

    res.status(201).json({ message: `${inserted.length} lectures added`, lectures: inserted });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get total course duration
exports.getCourseDuration = async (req, res) => {
  try {
    const lectures = await Lecture.find({ courseId: req.params.courseId });
    const totalMinutes = lectures.reduce((sum, l) => sum + (l.duration || 0), 0);
    res.json({ totalMinutes });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ New: Generate Certificate (non-blocking)
async function generateCertificate(user, course) {
  try {
    // Duplicate check
    const existing = await Certificate.findOne({
      userId: user._id,
      trackId: course.trackId
    });
    if (existing) return;

    const track = await Track.findById(course.trackId);
    const field = await Field.findById(course.fieldId);
    const fullUser = await User.findById(user._id);

    const certificate = await Certificate.create({
      userId: user._id,
      trackId: course.trackId,
      fieldId: course.fieldId,
      trackName: track?.name || 'Unknown Track',
      fieldName: field?.name || 'Unknown Field',
      userName: fullUser.name,
      certificateId: crypto.randomBytes(8).toString('hex').toUpperCase()
    });

    // Certificate email
    await sendCertificateEmail(
      fullUser.email,
      fullUser.name,
      track?.name,
      field?.name
    );

    console.log('Certificate generated:', certificate.certificateId);
  } catch (error) {
    // Non-blocking — certificate fail hone se main flow affect nahi hoga
    console.log('Certificate error:', error.message);
  }
}

// Continue watching - get all courses with progress
exports.getContinueWatching = async (req, res) => {
  try {
    const progresses = await UserProgress.find({ userId: req.user._id })
      .populate({ path: 'lectureId', select: 'title courseId order' })
      .populate({ path: 'courseId', select: 'title fieldId trackId thumbnail totalLectures isPremium' })
      .sort({ lastAccessedAt: -1 });

    const seen = new Set();
    const courses = [];
    for (const p of progresses) {
      if (!p.courseId || seen.has(p.courseId._id.toString())) continue;
      if (p.courseId.isPremium && req.user.subscriptionTier !== 'premium') continue;
      seen.add(p.courseId._id.toString());
      const completedLectures = await UserProgress.countDocuments({
        userId: req.user._id,
        courseId: p.courseId._id,
        isCompleted: true
      });
      courses.push({
        course: p.courseId,
        lastLecture: p.lectureId,
        lastAccessedAt: p.lastAccessedAt,
        completedLectures,
        totalLectures: p.courseId.totalLectures || 0
      });
    }

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user badges
exports.getUserBadges = async (req, res) => {
  try {
    const badges = await Badge.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(badges);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Course search within track
exports.searchCoursesInTrack = async (req, res) => {
  try {
    const { trackId } = req.params;
    const { q } = req.query;
    if (!q) return res.json([]);

    const courses = await Course.find({
      trackId,
      title: { $regex: q, $options: 'i' }
    }).sort({ order: 1 });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};