import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaBookOpen } from 'react-icons/fa';

function MyCourses() {
  const { fieldId, trackId } = useParams();
  const navigate = useNavigate();
  const { token, api } = useAuth();
  const { isDark } = useTheme();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => { fetchCourses(); }, [fieldId, trackId]);

  const fetchCourses = async () => {
    try {
      const coursesRes = await api.get(`/courses/${fieldId}/${trackId}`);
      const courses = coursesRes.data;
      const coursesWithProgress = await Promise.all(courses.map(async (course) => {
        try {
          const progressRes = await api.get(`/courses/detail/${course._id}`);
          return progressRes.data;
        } catch {
          return { ...course, completedLectures: 0, status: 'not-started' };
        }
      }));
      setCourses(coursesWithProgress);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const filtered = courses.filter(c => filterStatus === 'all' || c.status === filterStatus);

  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDark ? 'bg-gray-800' : 'bg-white';

  const statusColor = (status) => {
    if (status === 'completed') return isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-600';
    if (status === 'in-progress') return isDark ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-600';
    return isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600';
  };

  return (
    <div className={`min-h-screen ${bgPrimary} transition-colors duration-300`}>
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Back */}
        <button
          onClick={() => navigate(`/field/${fieldId}/track/${trackId}`)}
          className={`mb-6 flex items-center gap-2 transition ${textSecondary} hover:${textPrimary}`}
        >
          ← Back to Roadmap
        </button>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className={`text-3xl font-bold ${textPrimary}`}>Courses</h2>
            <p className={`mt-1 ${textSecondary}`}>Select a course to start learning</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-4 mb-6">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`px-4 py-2 rounded-lg ${inputBg} ${textPrimary} border ${borderColor} focus:outline-none`}
          >
            <option value="all">All Status</option>
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
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
          <div className={`text-center py-20 ${cardBg} rounded-2xl border ${borderColor}`}>
            <FaBookOpen className={`text-6xl mx-auto mb-4 opacity-30 ${textSecondary}`} />
            <p className={`text-xl ${textSecondary}`}>No courses available yet</p>
            <p className={`text-sm mt-2 ${textSecondary}`}>Admin will add courses soon</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((course) => {
              const percent = course.totalLectures > 0 ? Math.round((course.completedLectures / course.totalLectures) * 100) : 0;
              return (
                <div
                  key={course._id}
                  onClick={() => navigate(`/field/${fieldId}/track/${trackId}/course/${course._id}`)}
                  className={`${cardBg} p-6 rounded-2xl border ${borderColor} cursor-pointer hover:border-blue-500 transition`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className={`text-lg font-bold ${textPrimary}`}>{course.title}</h4>
                      <p className={`text-sm mt-1 ${textSecondary}`}>{course.description}</p>
                      <p className={`text-xs mt-1 ${textSecondary}`}>{course.platform}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ml-4 shrink-0 ${statusColor(course.status)}`}>
                      {course.status?.replace(/-/g, ' ')}
                    </span>
                  </div>
                  <div className={`flex justify-between text-sm mb-1 ${textSecondary}`}>
                    <span>{course.completedLectures} / {course.totalLectures} lectures</span>
                    <span>{percent}%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCourses;