import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import {
  MdTrendingUp, MdPlayCircle, MdCheckCircle, MdSchool,
  MdArrowForward, MdLock, MdVisibility, MdTimeline,
  MdFlag, MdStore, MdEmojiEvents
} from 'react-icons/md';
import { FaGraduationCap, FaBookOpen, FaCertificate, FaTrophy, FaBullhorn, FaStar, FaCalendarCheck } from 'react-icons/fa';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Dashboard() {
  const { user, token, activeEnrollment, fetchActiveEnrollment, api } = useAuth();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  const [continueWatching, setContinueWatching] = useState([]);
  const [goals, setGoals] = useState([]);
  const [badges, setBadges] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [goalForm, setGoalForm] = useState({ type: 'daily', target: 1 });
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [points, setPoints] = useState(0);
  const [dailyChallenges, setDailyChallenges] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const [fieldsRes, cwRes, goalsRes, badgesRes, annRes, pointsRes, chalRes, recRes] = await Promise.all([
        api.get('/admin/fields'),
        api.get('/lectures/continue-watching'),
        api.get('/goals'),
        api.get('/lectures/badges'),
        api.get('/announcements'),
        api.get('/points/me').catch(() => ({ data: { points: 0 } })),
        api.get('/challenges/today').catch(() => null),
        api.get('/recommendations/me').catch(() => ({ data: [] }))
      ]);
      setFields(fieldsRes.data || []);
      setContinueWatching(cwRes.data || []);
      setGoals(goalsRes.data || []);
      setBadges(badgesRes.data || []);
      setAnnouncements(annRes.data || []);
      setPoints(pointsRes.data?.points || 0);
      setDailyChallenges(chalRes?.data || null);
      setRecommendations(recRes?.data || []);
      await fetchActiveEnrollment();
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const handleCreateGoal = async () => {
    try {
      await api.post('/goals', goalForm);
      setShowGoalForm(false);
      setGoalForm({ type: 'daily', target: 1 });
      const res = await api.get('/goals');
      setGoals(res.data);
    } catch (err) { console.log(err); }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      setGoals(prev => prev.filter(g => g._id !== id));
    } catch (err) { console.log(err); }
  };

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const progressBg = isDark ? 'bg-gray-700' : 'bg-gray-200';

  return (
    <div className={`min-h-screen ${bgColor} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-6 py-8">

        <div className="mb-8">
          <h2 className={`text-3xl font-bold mb-2 ${textPrimary}`}>
            Welcome back, {user?.name?.split(' ')[0]}!
          </h2>
          <p className={textSecondary}>Continue your learning journey</p>
        </div>

        {/* Announcements */}
        {announcements.length > 0 && (
          <div className="mb-6 space-y-2">
            {announcements.slice(0, 2).map(ann => (
              <div key={ann._id} className={`${cardBg} p-4 rounded-2xl border ${ann.priority === 'high' ? 'border-yellow-500' : borderColor} flex items-start gap-3`}>
                <FaBullhorn className={`text-xl mt-1 ${ann.priority === 'high' ? 'text-yellow-400' : 'text-blue-400'}`} />
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${textPrimary}`}>{ann.title}</p>
                  <p className={`text-xs ${textSecondary}`}>{ann.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Points & Gamification Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className={`${cardBg} p-4 rounded-2xl border ${borderColor}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--accent-50)' }}>
                <FaStar className="text-xl" style={{ color: 'var(--accent-500)' }} />
              </div>
              <div>
                <p className={`text-xl font-bold ${textPrimary}`}>{points}</p>
                <p className={`text-xs ${textSecondary}`}>Points</p>
              </div>
            </div>
          </div>
          <div
            onClick={() => navigate('/gamification')}
            className={`${cardBg} p-4 rounded-2xl border ${borderColor} cursor-pointer hover:border-blue-500 transition`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--accent-50)' }}>
                <MdEmojiEvents className="text-xl" style={{ color: 'var(--accent-500)' }} />
              </div>
              <div>
                <p className={`text-xl font-bold ${textPrimary}`}>{badges.length}</p>
                <p className={`text-xs ${textSecondary}`}>Badges</p>
              </div>
            </div>
          </div>
          <div
            onClick={() => navigate('/gamification')}
            className={`${cardBg} p-4 rounded-2xl border ${borderColor} cursor-pointer hover:border-blue-500 transition`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--accent-50)' }}>
                <MdStore className="text-xl" style={{ color: 'var(--accent-500)' }} />
              </div>
              <div>
                <p className={`text-xl font-bold ${textPrimary}`}>Shop</p>
                <p className={`text-xs ${textSecondary}`}>Spend points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Challenges Widget */}
        {dailyChallenges && dailyChallenges.challenges && dailyChallenges.challenges.length > 0 && (
          <div className={`${cardBg} p-5 rounded-2xl border ${borderColor} mb-8`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`font-bold flex items-center gap-2 ${textPrimary}`}>
                <FaCalendarCheck style={{ color: 'var(--accent-500)' }} /> Today's Challenges
              </h3>
              <button
                onClick={() => navigate('/gamification')}
                className="text-sm text-blue-500 hover:text-blue-400 transition font-semibold"
              >
                View All →
              </button>
            </div>
            <div className="space-y-2">
              {dailyChallenges.challenges.slice(0, 3).map(ch => {
                const pct = ch.target > 0 ? Math.round((ch.progress / ch.target) * 100) : 0;
                return (
                  <div key={ch.id} className={`flex items-center gap-3 p-2 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <span className="text-lg">{ch.completed ? '✅' : ch.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span className={textPrimary}>{ch.title}</span>
                        <span className={`text-xs ${textSecondary}`}>{ch.progress}/{ch.target}</span>
                      </div>
                      <div className={`w-full ${isDark ? 'bg-gray-600' : 'bg-gray-200'} rounded-full h-1.5 mt-1`}>
                        <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <span className="text-blue-500 text-xs font-semibold">+{ch.points}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <div className={`${cardBg} p-5 rounded-2xl border ${borderColor} mb-8`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold flex items-center gap-2 ${textPrimary}`}>
                <MdTrendingUp style={{ color: 'var(--accent-500)' }} /> {t('aiRecommendations')}
              </h3>
              <button onClick={() => navigate('/roadmaps')} className="text-sm text-blue-500 hover:text-blue-400 transition font-semibold">{t('viewAll')} →</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {recommendations.slice(0, 3).map(course => (
                <div key={course._id} onClick={() => navigate(`/field/${course.fieldId?._id || course.fieldId}/track/${course.trackId?._id || course.trackId}/course/${course._id}`)}
                  className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'} cursor-pointer hover:bg-blue-500/10 transition`}>
                  {course.thumbnail ? (
                    <img src={`${API}${course.thumbnail}`} alt="" className="w-14 h-10 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-14 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white text-lg shrink-0"><MdSchool /></div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{course.title}</p>
                    <p className={`text-xs ${textSecondary} truncate`}>{course.platform} · {course.totalLectures || 0} lectures</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Course Banner */}
        {!activeEnrollment?.enrolled && activeEnrollment?.courseCompleted && (
          <div className={`${cardBg} p-6 rounded-2xl border ${borderColor} shadow-sm mb-8`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--accent-50)' }}>
                <FaCertificate className="text-2xl" style={{ color: 'var(--accent-500)' }} />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${textPrimary}`}>Course Completed!</h3>
                <p className={`text-sm ${textSecondary}`}>You can now enroll in a new course.</p>
              </div>
              <button
                onClick={() => navigate('/mycertificates')}
                className="ml-auto px-4 py-2 rounded-xl text-white text-sm font-semibold transition"
                style={{ backgroundColor: 'var(--accent-500)' }}
                onMouseEnter={e => e.target.style.backgroundColor = 'var(--accent-600)'}
                onMouseLeave={e => e.target.style.backgroundColor = 'var(--accent-500)'}
              >
                View Certificate
              </button>
            </div>
          </div>
        )}

        {/* Active Course Section */}
        {activeEnrollment?.enrolled ? (
          <div className={`${cardBg} p-6 rounded-2xl border shadow-sm mb-8`}
            style={{ borderColor: 'var(--accent-500)', boxShadow: '0 0 0 2px var(--accent-400)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--accent-50)' }}>
                  <MdPlayCircle className="text-2xl" style={{ color: 'var(--accent-500)' }} />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${textPrimary}`}>Active Course</h3>
                  <p className={`text-sm ${textSecondary}`}>{activeEnrollment.course?.title || 'Current Learning Path'}</p>
                  {activeEnrollment.field && (
                    <p className={`text-xs ${textSecondary}`}>{activeEnrollment.field.name} — {activeEnrollment.track?.name}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  if (activeEnrollment.course) {
                    navigate(`/field/${activeEnrollment.course.fieldId}/track/${activeEnrollment.course.trackId}/course/${activeEnrollment.course._id}`);
                  }
                }}
                className="px-4 py-2 rounded-xl text-white text-sm font-semibold transition"
                style={{ backgroundColor: 'var(--accent-500)' }}
                onMouseEnter={e => e.target.style.backgroundColor = 'var(--accent-600)'}
                onMouseLeave={e => e.target.style.backgroundColor = 'var(--accent-500)'}
              >
                Continue Learning
              </button>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className={textSecondary}>Progress</span>
                <span className="font-bold" style={{ color: 'var(--accent-500)' }}>{activeEnrollment.percent}%</span>
              </div>
              <div className={`w-full ${progressBg} rounded-full h-3 overflow-hidden`}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${activeEnrollment.percent}%`, backgroundColor: 'var(--accent-500)' }}
                ></div>
              </div>
            </div>
            <p className={`text-xs ${textSecondary}`}>
              {activeEnrollment.completedLectures} / {activeEnrollment.totalLectures} lectures completed
            </p>

            {activeEnrollment.lectures && (
              <div className="mt-4 space-y-2">
                {activeEnrollment.lectures.map((lec, i) => (
                  <div key={lec._id} className={`flex items-center gap-3 p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      lec.isCompleted
                        ? 'bg-green-500 border-green-500'
                        : lec.isUnlocked
                        ? 'border-blue-500'
                        : 'border-gray-500'
                    }`}>
                      {lec.isCompleted ? (
                        <MdCheckCircle className="text-white text-sm" />
                      ) : !lec.isUnlocked ? (
                        <MdLock className="text-gray-500 text-xs" />
                      ) : null}
                    </div>
                    <span className={`text-sm flex-1 ${lec.isCompleted ? 'line-through text-gray-500' : lec.isUnlocked ? textPrimary : 'text-gray-500'}`}>
                      Lecture {i + 1}: {lec.title}
                    </span>
                    {!lec.isUnlocked && !lec.isCompleted && (
                      <MdLock className="text-gray-500" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeEnrollment.certificate && (
              <div className={`mt-4 p-3 rounded-xl flex items-center gap-3`} style={{ backgroundColor: isDark ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.1)' }}>
                <FaCertificate className="text-green-600 text-xl" />
                <div>
                  <p className="text-green-700 dark:text-green-300 font-semibold text-sm">Certificate Earned!</p>
                  <p className="text-green-600 dark:text-green-400 text-xs">ID: {activeEnrollment.certificate.certificateId}</p>
                </div>
                <button
                  onClick={() => navigate('/mycertificates')}
                  className="ml-auto px-3 py-1 rounded-lg text-white text-xs font-semibold transition"
                  style={{ backgroundColor: 'var(--accent-500)' }}
                  onMouseEnter={e => e.target.style.backgroundColor = 'var(--accent-600)'}
                  onMouseLeave={e => e.target.style.backgroundColor = 'var(--accent-500)'}
                >
                  View
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={`${cardBg} p-6 rounded-2xl border ${borderColor} shadow-sm mb-8`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--accent-50)' }}>
                <FaGraduationCap className="text-2xl" style={{ color: 'var(--accent-500)' }} />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${textPrimary}`}>No Active Course</h3>
                <p className={`text-sm ${textSecondary}`}>Browse fields below and enroll in a course to start learning</p>
              </div>
            </div>
          </div>
        )}

        {/* Continue Watching */}
        {continueWatching.length > 0 && (
          <div className="mb-8">
            <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${textPrimary}`}>
              <MdVisibility style={{ color: 'var(--accent-500)' }} /> Continue Watching
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {continueWatching.slice(0, 3).map((cw) => {
                const pct = cw.totalLectures > 0 ? Math.round((cw.completedLectures / cw.totalLectures) * 100) : 0;
                return (
                  <div
                    key={cw.course._id}
                    onClick={() => navigate(`/field/${cw.course.fieldId}/track/${cw.course.trackId}/course/${cw.course._id}`)}
                    className={`${cardBg} p-4 rounded-2xl border ${borderColor} cursor-pointer hover:border-blue-500 transition`}
                  >
                    <p className={`font-semibold text-sm ${textPrimary} mb-1`}>{cw.course.title}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`flex-1 ${progressBg} rounded-full h-1.5`}>
                        <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                      </div>
                      <span className={`text-xs ${textSecondary}`}>{pct}%</span>
                    </div>
                    {cw.lastAccessedAt && (
                      <p className={`text-xs ${textSecondary}`}>
                        Last watched: {new Date(cw.lastAccessedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <div className="mb-8">
            <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${textPrimary}`}>
              <FaTrophy style={{ color: 'var(--accent-500)' }} /> Badges ({badges.length})
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {badges.map(b => (
                <div key={b._id} className={`${cardBg} p-4 rounded-2xl border ${borderColor} text-center min-w-[120px]`}>
                  <span className="text-3xl block mb-1">{b.icon}</span>
                  <p className={`text-xs font-semibold ${textPrimary}`}>{b.name}</p>
                  <p className={`text-xs ${textSecondary}`}>{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Goals */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-bold flex items-center gap-2 ${textPrimary}`}>
              <MdFlag style={{ color: 'var(--accent-500)' }} /> Learning Goals
            </h3>
            <button
              onClick={() => setShowGoalForm(!showGoalForm)}
              className="px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition"
              style={{ backgroundColor: 'var(--accent-500)' }}
              onMouseEnter={e => e.target.style.backgroundColor = 'var(--accent-600)'}
              onMouseLeave={e => e.target.style.backgroundColor = 'var(--accent-500)'}
            >
              {showGoalForm ? 'Cancel' : '+ Add Goal'}
            </button>
          </div>

          {showGoalForm && (
            <div className={`${cardBg} p-4 rounded-2xl border ${borderColor} mb-4 flex items-center gap-3`}>
              <select
                value={goalForm.type}
                onChange={(e) => setGoalForm({ ...goalForm, type: e.target.value })}
                className={`px-3 py-2 rounded-lg text-sm ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} focus:outline-none`}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
              <input
                type="number"
                min={1}
                value={goalForm.target}
                onChange={(e) => setGoalForm({ ...goalForm, target: parseInt(e.target.value) || 1 })}
                className={`w-20 px-3 py-2 rounded-lg text-sm ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} focus:outline-none`}
              />
              <span className={`text-sm ${textSecondary}`}>lectures</span>
              <button onClick={handleCreateGoal} className="px-4 py-2 rounded-lg text-white text-xs font-semibold transition"
                style={{ backgroundColor: 'var(--accent-500)' }}
                onMouseEnter={e => e.target.style.backgroundColor = 'var(--accent-600)'}
                onMouseLeave={e => e.target.style.backgroundColor = 'var(--accent-500)'}>
                Set Goal
              </button>
            </div>
          )}

          {goals.length === 0 ? (
            <p className={`text-sm ${textSecondary}`}>No goals set. Add a daily or weekly learning goal!</p>
          ) : (
            <div className="space-y-2">
              {goals.map(g => (
                <div key={g._id} className={`${cardBg} p-3 rounded-xl border ${borderColor} flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isDark ? 'text-gray-300 bg-gray-600' : 'text-gray-700 bg-gray-200'}`}>
                      {g.type}
                    </span>
                    <span className={`text-sm ${textPrimary}`}>{g.progress} / {g.target} lectures</span>
                  </div>
                  <button onClick={() => handleDeleteGoal(g._id)} className="text-xs text-red-400 hover:text-red-300 transition">Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <button onClick={() => navigate('/roadmaps')} className={`${cardBg} p-5 rounded-2xl border ${borderColor} shadow-sm hover:shadow-md transition text-left`}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--accent-50)' }}>
              <MdTimeline className="text-xl" style={{ color: 'var(--accent-500)' }} />
            </div>
            <p className={`font-semibold ${textPrimary}`}>Roadmaps</p>
            <p className={`text-sm ${textSecondary}`}>Career paths</p>
          </button>

          <button onClick={() => navigate('/mycourses')} className={`${cardBg} p-5 rounded-2xl border ${borderColor} shadow-sm hover:shadow-md transition text-left`}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--accent-50)' }}>
              <FaBookOpen className="text-xl" style={{ color: 'var(--accent-500)' }} />
            </div>
            <p className={`font-semibold ${textPrimary}`}>My Courses</p>
            <p className={`text-sm ${textSecondary}`}>View all courses</p>
          </button>

          <button onClick={() => navigate('/mycertificates')} className={`${cardBg} p-5 rounded-2xl border ${borderColor} shadow-sm hover:shadow-md transition text-left`}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--accent-50)' }}>
              <FaCertificate className="text-xl" style={{ color: 'var(--accent-500)' }} />
            </div>
            <p className={`font-semibold ${textPrimary}`}>Certificates</p>
            <p className={`text-sm ${textSecondary}`}>View achievements</p>
          </button>

          <button onClick={() => navigate('/leaderboard')} className={`${cardBg} p-5 rounded-2xl border ${borderColor} shadow-sm hover:shadow-md transition text-left`}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--accent-50)' }}>
              <FaTrophy className="text-xl" style={{ color: 'var(--accent-500)' }} />
            </div>
            <p className={`font-semibold ${textPrimary}`}>Leaderboard</p>
            <p className={`text-sm ${textSecondary}`}>See rankings</p>
          </button>

          <button onClick={() => navigate('/gamification')} className={`${cardBg} p-5 rounded-2xl border ${borderColor} shadow-sm hover:shadow-md transition text-left`}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--accent-50)' }}>
              <FaStar className="text-xl" style={{ color: 'var(--accent-500)' }} />
            </div>
            <p className={`font-semibold ${textPrimary}`}>Rewards</p>
            <p className={`text-sm ${textSecondary}`}>Badges & Shop</p>
          </button>
        </div>

        {/* Fields / Learning Paths */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold ${textPrimary}`}>Learning Fields</h3>
            <span className={`text-sm ${textSecondary}`}>{fields.length} available</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => <div key={i} className={`h-32 ${cardBg} rounded-2xl animate-pulse`}></div>)}
            </div>
          ) : fields.length === 0 ? (
            <div className={`text-center py-16 ${cardBg} rounded-2xl border ${borderColor}`}>
              <FaGraduationCap className={`text-5xl mx-auto mb-4 opacity-30 ${textSecondary}`} />
              <p className={`text-lg ${textSecondary}`}>No fields available yet</p>
              <p className={`text-sm ${textSecondary}`}>Admin will add learning fields soon</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fields.map((field) => {
                const isActiveField = activeEnrollment?.enrolled && activeEnrollment.field?._id === field._id;
                return (
                  <div
                    key={field._id}
                    onClick={() => navigate(`/field/${field._id}`)}
                    className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                      ${isActiveField
                        ? `${cardBg} ring-2 ring-blue-500 border border-blue-500`
                        : activeEnrollment?.enrolled
                        ? `${cardBg} border ${borderColor} opacity-60`
                        : `${cardBg} border ${borderColor}`
                      } p-6`}
                  >
                    {activeEnrollment?.enrolled && !isActiveField && (
                      <div className="absolute inset-0 bg-black bg-opacity-30 z-10 flex items-center justify-center rounded-2xl">
                        <div className="text-center text-white">
                          <MdLock className="text-3xl mx-auto mb-1" />
                          <p className="text-xs font-semibold">Complete current course first</p>
                        </div>
                      </div>
                    )}
                    <div className="relative z-0">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--accent-50)' }}>
                        <FaGraduationCap className="text-xl" style={{ color: 'var(--accent-500)' }} />
                      </div>
                      <h4 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>{field.name}</h4>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{field.description || 'Start learning'}</p>
                      {isActiveField && (
                        <span className="inline-block mt-2 text-xs text-blue-500 font-semibold">Active Learning Path</span>
                      )}
                    </div>
                    <div className={`absolute right-4 bottom-4 w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110
                      ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      {activeEnrollment?.enrolled && !isActiveField ? (
                        <MdLock className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                      ) : (
                        <MdArrowForward className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
