import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaUsers, FaGraduationCap, FaSignInAlt, FaHistory } from 'react-icons/fa';
import { MdPlayCircle, MdQuiz, MdWorkspacePremium, MdForum, MdTrendingUp, MdPeople } from 'react-icons/md';

function Analytics() {
  const navigate = useNavigate();
  const { user, token, api } = useAuth();
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activityTab, setActivityTab] = useState('recent');

  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  useEffect(() => {
    if (user?.role !== 'admin' && user?.role !== 'superadmin') {
      navigate('/dashboard');
      return;
    }
    fetchAnalytics();
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const actionLabels = {
    login: 'Login',
    register: 'Registration',
    logout: 'Logout',
    enroll_course: 'Enrolled in Course',
    complete_lecture: 'Completed Lecture',
    complete_course: 'Completed Course',
    create_course: 'Created Course',
    create_lecture: 'Created Lecture',
    delete_lecture: 'Deleted Lecture',
    update_profile: 'Updated Profile',
    change_password: 'Changed Password'
  };

  const fetchAnalytics = async () => {
    try {
      const [analyticsRes, activityRes] = await Promise.all([
        api.get('/analytics'),
        api.get('/analytics/activity')
      ]);
      setData(analyticsRes.data);
      setActivityData(activityRes.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className={`flex items-center justify-center py-20 ${textSecondary}`}>
      Loading analytics...
    </div>
  );

  if (!data) return null;

  const overviewCards = [
    { label: 'Total Users', value: data.overview.totalUsers, icon: <FaUsers className="text-2xl" style={{ color: 'var(--accent-400)' }} /> },
    { label: 'Total Courses', value: data.overview.totalCourses, icon: <FaGraduationCap className="text-2xl" style={{ color: 'var(--accent-400)' }} /> },
    { label: 'Total Lectures', value: data.overview.totalLectures, icon: <MdPlayCircle className="text-2xl" style={{ color: 'var(--accent-400)' }} /> },
    { label: 'Certificates Issued', value: data.overview.totalCertificates, icon: <MdWorkspacePremium className="text-2xl" style={{ color: 'var(--accent-400)' }} /> },
    { label: 'Active Users (7d)', value: data.overview.activeUsers, icon: <MdPeople className="text-2xl" style={{ color: 'var(--accent-400)' }} /> },
    { label: 'Lectures Completed', value: data.overview.totalCompletedLectures, icon: <MdTrendingUp className="text-2xl" style={{ color: 'var(--accent-400)' }} /> },
    { label: 'Quiz Attempts', value: data.overview.totalQuizAttempts, icon: <MdQuiz className="text-2xl" style={{ color: 'var(--accent-400)' }} /> },
    { label: 'Quiz Pass Rate', value: `${data.overview.quizPassRate}%`, icon: <MdQuiz className="text-2xl" style={{ color: 'var(--accent-400)' }} /> },
    { label: 'Discussions', value: data.overview.totalDiscussions, icon: <MdForum className="text-2xl" style={{ color: 'var(--accent-400)' }} /> },
  ];

  return (
    <div className={`max-w-6xl mx-auto px-6 py-10 ${bgPrimary} ${textPrimary} transition-colors duration-300`}>

      <div className="mb-8">
        <h2 className={`text-3xl font-bold mb-2 ${textPrimary}`}>Analytics Dashboard</h2>
        <p className={textSecondary}>Platform overview and insights</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {overviewCards.map((card) => (
          <div key={card.label} className={`${cardBg} p-5 rounded-2xl border ${borderColor}`}>
            <div className="mb-3">{card.icon}</div>
            <p className="text-3xl font-bold mb-1" style={{ color: 'var(--accent-400)' }}>{card.value}</p>
            <p className={`text-sm ${textSecondary}`}>{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        {/* Top Users */}
        <div className={`${cardBg} p-6 rounded-2xl border ${borderColor}`}>
          <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${textPrimary}`}>
            <FaUsers style={{ color: 'var(--accent-400)' }} />
            Most Active Users
          </h3>
          {data.topUsers.length === 0 ? (
            <p className={`${textSecondary} text-sm`}>No data yet</p>
          ) : (
            <div className="space-y-3">
              {data.topUsers.map((user, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white"
                    style={{ backgroundColor: 'var(--accent-500)' }}>
                    {user.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm truncate ${textPrimary}`}>{user.name}</p>
                    <p className={`${textSecondary} text-xs truncate`}>{user.email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold" style={{ color: 'var(--accent-400)' }}>{user.completedLectures}</p>
                    <p className={`${textSecondary} text-xs`}>lectures</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular Courses */}
        <div className={`${cardBg} p-6 rounded-2xl border ${borderColor}`}>
          <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${textPrimary}`}>
            <FaGraduationCap style={{ color: 'var(--accent-400)' }} />
            Most Popular Courses
          </h3>
          {data.popularCourses.length === 0 ? (
            <p className={`${textSecondary} text-sm`}>No data yet</p>
          ) : (
            <div className="space-y-3">
              {data.popularCourses.map((course, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white"
                    style={{ backgroundColor: 'var(--accent-500)' }}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm truncate ${textPrimary}`}>{course.title}</p>
                    <p className={`${textSecondary} text-xs`}>{course.platform}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold" style={{ color: 'var(--accent-400)' }}>{course.totalProgress}</p>
                    <p className={`${textSecondary} text-xs`}>progress</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Users Per Day */}
      <div className={`${cardBg} p-6 rounded-2xl border ${borderColor}`}>
        <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${textPrimary}`}>
          <MdTrendingUp style={{ color: 'var(--accent-400)' }} />
          New Users — Last 7 Days
        </h3>
        {data.newUsersPerDay.length === 0 ? (
          <p className={`${textSecondary} text-sm`}>No new users in last 7 days</p>
        ) : (
          <div className="space-y-3">
            {data.newUsersPerDay.map((day) => (
              <div key={day._id} className="flex items-center gap-4">
                <p className={`${textSecondary} text-sm w-24 shrink-0`}>{day._id}</p>
                <div className={`flex-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-4 overflow-hidden`}>
                  <div
                    className="h-4 rounded-full transition-all flex items-center justify-end pr-2"
                    style={{
                      width: `${Math.max((day.count / Math.max(...data.newUsersPerDay.map(d => d.count))) * 100, 10)}%`,
                      backgroundColor: 'var(--accent-500)'
                    }}
                  >
                    <span className="text-white text-xs font-bold">{day.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Activity */}
      <div className={`mt-8 ${cardBg} p-6 rounded-2xl border ${borderColor}`}>
        <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${textPrimary}`}>
          <FaHistory style={{ color: 'var(--accent-400)' }} />
          User Activity
        </h3>
        {!activityData ? (
          <p className={`${textSecondary} text-sm`}>Loading activity...</p>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActivityTab('recent')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activityTab === 'recent'
                    ? 'text-white'
                    : `${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
                }`}
                style={activityTab === 'recent' ? { backgroundColor: 'var(--accent-500)' } : {}}
              >
                Recent Activity
              </button>
              <button
                onClick={() => setActivityTab('logins')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activityTab === 'logins'
                    ? 'text-white'
                    : `${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
                }`}
                style={activityTab === 'logins' ? { backgroundColor: 'var(--accent-500)' } : {}}
              >
                Recent Logins
              </button>
              <button
                onClick={() => setActivityTab('breakdown')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activityTab === 'breakdown'
                    ? 'text-white'
                    : `${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
                }`}
                style={activityTab === 'breakdown' ? { backgroundColor: 'var(--accent-500)' } : {}}
              >
                Action Breakdown
              </button>
            </div>

            {/* Recent Activity */}
            {activityTab === 'recent' && (
              <div className="space-y-3">
                {activityData.logs.length === 0 ? (
                  <p className={`${textSecondary} text-sm`}>No activity yet</p>
                ) : (
                  activityData.logs.slice(0, 20).map((log) => (
                    <div key={log._id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white"
                        style={{ backgroundColor: 'var(--accent-500)' }}>
                        {log.userId?.name?.slice(0, 2).toUpperCase() || '??'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${textPrimary}`}>
                          <span className="font-semibold">{log.userId?.name || 'Unknown'}</span>
                          {' '}{actionLabels[log.action] || log.action}
                        </p>
                      </div>
                      <p className={`${textSecondary} text-xs shrink-0`}>{formatDate(log.createdAt)}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Recent Logins */}
            {activityTab === 'logins' && (
              <div className="space-y-3">
                {activityData.recentLogins.length === 0 ? (
                  <p className={`${textSecondary} text-sm`}>No logins recorded yet</p>
                ) : (
                  activityData.recentLogins.map((log) => (
                    <div key={log._id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white"
                        style={{ backgroundColor: 'var(--accent-500)' }}>
                        <FaSignInAlt className="text-white text-xs" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${textPrimary}`}>
                          <span className="font-semibold">{log.userId?.name || 'Unknown'}</span>
                          {' '}logged in
                        </p>
                      </div>
                      <p className={`${textSecondary} text-xs shrink-0`}>{formatDate(log.createdAt)}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Action Breakdown */}
            {activityTab === 'breakdown' && (
              <div className="space-y-3">
                {activityData.actionCounts.length === 0 ? (
                  <p className={`${textSecondary} text-sm`}>No data yet</p>
                ) : (
                  activityData.actionCounts.map((item) => (
                    <div key={item._id} className="flex items-center gap-4">
                      <p className={`${textSecondary} text-sm w-36 shrink-0`}>{actionLabels[item._id] || item._id}</p>
                      <div className={`flex-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-4 overflow-hidden`}>
                        <div
                          className="h-4 rounded-full transition-all flex items-center justify-end pr-2"
                          style={{
                            width: `${Math.max((item.count / Math.max(...activityData.actionCounts.map(a => a.count))) * 100, 10)}%`,
                            backgroundColor: 'var(--accent-500)'
                          }}
                        >
                          <span className="text-white text-xs font-bold">{item.count}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Activity Per Day Chart */}
            {activityData.activityByDay.length > 0 && (
              <div className="mt-6 pt-6 border-t ${borderColor}">
                <h4 className={`text-sm font-semibold mb-3 ${textPrimary}`}>Activity — Last 7 Days</h4>
                <div className="space-y-2">
                  {activityData.activityByDay.map((day) => (
                    <div key={day._id} className="flex items-center gap-4">
                      <p className={`${textSecondary} text-sm w-24 shrink-0`}>{day._id}</p>
                      <div className={`flex-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-4 overflow-hidden`}>
                        <div
                          className="h-4 rounded-full transition-all flex items-center justify-end pr-2"
                          style={{
                            width: `${Math.max((day.count / Math.max(...activityData.activityByDay.map(d => d.count))) * 100, 10)}%`,
                            backgroundColor: 'var(--accent-500)'
                          }}
                        >
                          <span className="text-white text-xs font-bold">{day.count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Analytics;
