import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaBookOpen, FaLock } from 'react-icons/fa';
import { MdSearch, MdLock } from 'react-icons/md';

function AllMyCourses() {
  const navigate = useNavigate();
  const { token, api } = useAuth();
  const { isDark } = useTheme();

  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDark ? 'bg-gray-800' : 'bg-white';
  const progressBg = isDark ? 'bg-gray-700' : 'bg-gray-200';
  const statusBadge = (status) => {
    if (status === 'completed') return isDark ? 'text-green-300 bg-green-900/30' : 'text-green-600 bg-green-50';
    if (status === 'in-progress') return isDark ? 'text-blue-300 bg-blue-900/30' : 'text-blue-600 bg-blue-50';
    return isDark ? 'text-gray-300 bg-gray-700' : 'text-gray-600 bg-gray-100';
  };

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [search, setSearch] = useState('');
  const [hasActiveCourse, setHasActiveCourse] = useState(false);
  const [blockMessage, setBlockMessage] = useState(null);

  useEffect(() => {
    if (token) fetchAllCourses();
  }, [token]);

  const fetchAllCourses = async () => {
    try {
      const res = await api.get('/courses/all');
      setCourses(res.data.courses || res.data);
      if (res.data.hasActiveCourse !== undefined) {
        setHasActiveCourse(res.data.hasActiveCourse);
        setBlockMessage(res.data.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const allCourses = Array.isArray(courses) ? courses : [];
  const filtered = allCourses.filter(c => {
    const statusMatch = filterStatus === 'all' || c.status === filterStatus;
    const platformMatch = filterPlatform === 'all' || c.platform === filterPlatform;
    const searchMatch = search === '' || c.title.toLowerCase().includes(search.toLowerCase());
    return statusMatch && platformMatch && searchMatch;
  });

  const totalCourses = allCourses.length;
  const completed = allCourses.filter(c => c.status === 'completed').length;
  const inProgress = allCourses.filter(c => c.status === 'in-progress').length;

  return (
    <div className={`max-w-5xl mx-auto px-6 py-10 ${bgPrimary} ${textPrimary} transition-colors duration-300`}>

      <div className="mb-8">
        <h2 className={`text-3xl font-bold mb-2 ${textPrimary}`}>My Courses</h2>
        <p className={textSecondary}>Track your progress across all courses</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className={`${cardBg} p-4 rounded-2xl border ${borderColor} text-center`}>
          <p className={`text-2xl font-bold ${textPrimary}`}>{totalCourses}</p>
          <p className={`${textSecondary} text-sm mt-1`}>Total Courses</p>
        </div>
        <div className={`${cardBg} p-4 rounded-2xl border ${borderColor} text-center`}>
          <p className="text-2xl font-bold" style={{ color: 'var(--accent-400)' }}>{completed}</p>
          <p className={`${textSecondary} text-sm mt-1`}>Completed</p>
        </div>
        <div className={`${cardBg} p-4 rounded-2xl border ${borderColor} text-center`}>
          <p className="text-2xl font-bold" style={{ color: 'var(--accent-400)' }}>{inProgress}</p>
          <p className={`${textSecondary} text-sm mt-1`}>In Progress</p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div className={`flex-1 flex items-center gap-2 ${inputBg} px-4 py-2 rounded-xl border ${borderColor} focus-within:border-blue-500 transition`}>
          <MdSearch className={textSecondary} />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`flex-1 bg-transparent ${textPrimary} placeholder-gray-400 focus:outline-none text-sm`}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`px-4 py-2 rounded-xl ${inputBg} ${textPrimary} border ${borderColor} focus:outline-none`}
        >
          <option value="all">All Status</option>
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={filterPlatform}
          onChange={(e) => setFilterPlatform(e.target.value)}
          className={`px-4 py-2 rounded-xl ${inputBg} ${textPrimary} border ${borderColor} focus:outline-none`}
        >
          <option value="all">All Platforms</option>
          <option value="YouTube">YouTube</option>
          <option value="Udemy">Udemy</option>
          <option value="Coursera">Coursera</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Courses */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-24 ${cardBg} rounded-2xl animate-pulse`}></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className={`text-center py-20 ${textSecondary}`}>
          <FaBookOpen className="text-6xl mx-auto mb-4 opacity-30" />
          <p className="text-xl">No courses found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-6 py-3 rounded-xl font-semibold text-white transition"
            style={{ backgroundColor: 'var(--accent-500)' }}
            onMouseEnter={e => e.target.style.backgroundColor = 'var(--accent-600)'}
            onMouseLeave={e => e.target.style.backgroundColor = 'var(--accent-500)'}
          >
            Browse Fields
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {hasActiveCourse && (
            <div className={`p-4 rounded-2xl border border-yellow-500 ${isDark ? 'bg-yellow-900 bg-opacity-20' : 'bg-yellow-50'} flex items-center gap-3`}>
              <MdLock className="text-yellow-500 text-xl" />
              <p className={`text-sm ${textPrimary}`}>
                {blockMessage || 'Pehle apna current course complete karein.'}
              </p>
            </div>
          )}
          {filtered.map((course) => {
            const percent = course.totalLectures > 0
              ? Math.round((course.completedLectures / course.totalLectures) * 100)
              : 0;
            const isLocked = course.isLocked;
            const isActive = course.isActive;
            return (
              <div
                key={course._id}
                className={`${cardBg} p-6 rounded-2xl border ${borderColor} transition ${
                  isActive
                    ? 'ring-2 ring-blue-500 border-blue-500 cursor-pointer hover:border-blue-500'
                    : isLocked
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer hover:border-blue-500'
                }`}
                onClick={() => {
                  if (!isLocked) {
                    navigate(`/field/${course.fieldId}/track/${course.trackId}/course/${course._id}`)
                  }
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {isLocked && <FaLock className="text-gray-500" />}
                      <h4 className={`text-lg font-bold ${isActive ? 'text-blue-400' : textPrimary}`}>{course.title}</h4>
                      {isActive && (
                        <span className="text-xs px-2 py-0.5 bg-blue-600 text-white rounded-full">Active</span>
                      )}
                    </div>
                    <p className={`${textSecondary} text-sm mt-0.5`}>{course.description}</p>
                    <p className={`${textSecondary} text-xs mt-1`}>{course.platform}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ml-4 shrink-0 ${statusBadge(course.status)}`}>
                    {course.status?.replace(/-/g, ' ')}
                  </span>
                </div>
                {!isLocked && (
                  <>
                    <div className={`flex justify-between text-sm ${textSecondary} mb-1`}>
                      <span>{course.completedLectures} / {course.totalLectures} lectures</span>
                      <span>{percent}%</span>
                    </div>
                    <div className={`w-full ${progressBg} rounded-full h-2`}>
                      <div
                        className="h-2 rounded-full bg-blue-500 transition-all"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </>
                )}
                {isLocked && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaLock /> Complete your active course first
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AllMyCourses;
