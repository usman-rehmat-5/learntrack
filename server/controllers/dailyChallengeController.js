const DailyChallenge = require('../models/DailyChallenge');
const Streak = require('../models/Streak');
const { awardPoints, POINTS } = require('./pointsController');

const CHALLENGE_TEMPLATES = [
  { title: 'Lecture Learner I', desc: 'Complete {target} lectures today', type: 'complete_lectures', target: 3, points: 25, icon: '📚' },
  { title: 'Lecture Learner II', desc: 'Complete {target} lectures today', type: 'complete_lectures', target: 5, points: 40, icon: '📚' },
  { title: 'Time Watcher I', desc: 'Watch {target} minutes of content', type: 'watch_minutes', target: 30, points: 25, icon: '⏱️' },
  { title: 'Time Watcher II', desc: 'Watch {target} minutes of content', type: 'watch_minutes', target: 60, points: 45, icon: '⏱️' },
  { title: 'Streak Keeper', desc: 'Maintain a {target}-day streak', type: 'login_streak', target: 3, points: 30, icon: '🔥' },
  { title: 'Quiz Champion', desc: 'Score {target}% on any quiz', type: 'quiz_score', target: 80, points: 35, icon: '🧠' },
  { title: 'Course Finisher', desc: 'Complete a full course today', type: 'complete_course', target: 1, points: 75, icon: '🎯' },
];

function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function pickRandom(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

async function generateChallenges(userId) {
  const date = getTodayStr();
  const existing = await DailyChallenge.findOne({ userId, date });
  if (existing) return existing;

  const picked = pickRandom(CHALLENGE_TEMPLATES, 3);
  const challenges = picked.map((t, i) => ({
    id: `ch-${i}`,
    title: t.title,
    description: t.desc.replace('{target}', t.target),
    type: t.type,
    target: t.target,
    progress: 0,
    completed: false,
    points: t.points,
    icon: t.icon
  }));

  return DailyChallenge.create({ userId, date, challenges });
}

exports.getTodayChallenges = async (req, res) => {
  try {
    const data = await generateChallenges(req.user.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateChallengeProgress = async (req, res) => {
  try {
    const { type, value } = req.body;
    const date = getTodayStr();
    const data = await DailyChallenge.findOne({ userId: req.user.id, date });
    if (!data) return res.status(404).json({ message: 'No challenges for today' });

    for (const ch of data.challenges) {
      if (ch.completed || ch.type !== type) continue;
      ch.progress = Math.min(ch.target, ch.progress + (value || 1));
      if (ch.progress >= ch.target) {
        ch.completed = true;
      }
    }

    data.allCompleted = data.challenges.every(c => c.completed);
    await data.save();

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.claimChallengeReward = async (req, res) => {
  try {
    const { challengeId } = req.body;
    const date = getTodayStr();
    const data = await DailyChallenge.findOne({ userId: req.user.id, date });
    if (!data) return res.status(404).json({ message: 'No challenges for today' });

    const challenge = data.challenges.find(c => c.id === challengeId);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
    if (!challenge.completed) return res.status(400).json({ message: 'Challenge not completed yet' });

    if (challenge.metadata?.claimed) return res.status(400).json({ message: 'Already claimed' });

    const points = await awardPoints(req.user.id, challenge.points, 'daily_challenge', `challenge-${date}-${challengeId}`);

    challenge.metadata = { ...challenge.metadata, claimed: true };
    data.totalPointsEarned += challenge.points;
    await data.save();

    res.json({ challenge, points });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getChallengeHistory = async (req, res) => {
  try {
    const data = await DailyChallenge.find({ userId: req.user.id })
      .sort({ date: -1 })
      .limit(30);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Called internally when a lecture is completed
exports.progressLectureComplete = async (userId) => {
  try {
    await generateChallenges(userId);
    const date = getTodayStr();
    const data = await DailyChallenge.findOne({ userId, date });
    if (!data) return;

    for (const ch of data.challenges) {
      if (ch.completed || ch.type !== 'complete_lectures') continue;
      ch.progress = Math.min(ch.target, ch.progress + 1);
      if (ch.progress >= ch.target) ch.completed = true;
    }

    data.allCompleted = data.challenges.every(c => c.completed);
    await data.save();
  } catch (e) {
    console.log('Daily challenge progress error:', e.message);
  }
};

// Called when a quiz is submitted
exports.progressQuizScore = async (userId, scorePct) => {
  try {
    const date = getTodayStr();
    const data = await DailyChallenge.findOne({ userId, date });
    if (!data) return;

    for (const ch of data.challenges) {
      if (ch.completed || ch.type !== 'quiz_score') continue;
      ch.progress = Math.min(ch.target, scorePct);
      if (ch.progress >= ch.target) ch.completed = true;
    }

    data.allCompleted = data.challenges.every(c => c.completed);
    await data.save();
  } catch (e) {
    console.log('Quiz challenge progress error:', e.message);
  }
};

// Called when a course is fully completed
exports.progressCourseComplete = async (userId) => {
  try {
    const date = getTodayStr();
    const data = await DailyChallenge.findOne({ userId, date });
    if (!data) return;

    for (const ch of data.challenges) {
      if (ch.completed || ch.type !== 'complete_course') continue;
      ch.progress = Math.min(ch.target, ch.progress + 1);
      if (ch.progress >= ch.target) ch.completed = true;
    }

    data.allCompleted = data.challenges.every(c => c.completed);
    await data.save();
  } catch (e) {
    console.log('Course challenge progress error:', e.message);
  }
};

// Called when a user watches content
exports.progressWatchMinutes = async (userId, minutes) => {
  try {
    const date = getTodayStr();
    const data = await DailyChallenge.findOne({ userId, date });
    if (!data) return;

    for (const ch of data.challenges) {
      if (ch.completed || ch.type !== 'watch_minutes') continue;
      ch.progress = Math.min(ch.target, ch.progress + minutes);
      if (ch.progress >= ch.target) ch.completed = true;
    }

    data.allCompleted = data.challenges.every(c => c.completed);
    await data.save();
  } catch (e) {
    console.log('Watch minutes challenge progress error:', e.message);
  }
};

// Called when a streak is updated
exports.progressStreakChallenge = async (userId) => {
  try {
    const streak = await Streak.findOne({ userId });
    if (!streak) return;
    const date = getTodayStr();
    const data = await DailyChallenge.findOne({ userId, date });
    if (!data) return;

    for (const ch of data.challenges) {
      if (ch.completed || ch.type !== 'login_streak') continue;
      if (streak.currentStreak >= ch.target) ch.completed = true;
    }

    data.allCompleted = data.challenges.every(c => c.completed);
    await data.save();
  } catch (e) {
    console.log('Streak challenge progress error:', e.message);
  }
};
