import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { MdPlayCircle, MdAccessTime, MdSchool, MdLock } from 'react-icons/md';
import { FaGraduationCap } from 'react-icons/fa';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function CoursePreview() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/recommendations/preview/${courseId}`)
      .then(r => r.json())
      .then(d => { setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [courseId]);

  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`min-h-screen ${bgPrimary} ${textPrimary} transition-colors`}>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <button onClick={() => navigate(-1)} className={`${textSecondary} hover:${textPrimary} text-sm mb-4 flex items-center gap-1 transition`}>← Back</button>

        {loading ? (
          <div className={`text-center py-16 ${textSecondary}`}>Loading...</div>
        ) : !data ? (
          <div className={`text-center py-16 ${cardBg} rounded-2xl border ${borderColor}`}>
            <MdSchool className="text-5xl mx-auto mb-4 text-gray-500" />
            <p className={textSecondary}>Course not found</p>
          </div>
        ) : (
          <>
            {/* Hero */}
            <div className={`${cardBg} rounded-2xl border ${borderColor} overflow-hidden mb-6`}>
              {data.course.thumbnail && (
                <div className="h-48 bg-gray-700">
                  <img src={`${API}${data.course.thumbnail}`} alt={data.course.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} ${textSecondary}`}>{data.course.fieldId?.name || 'Field'}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} ${textSecondary}`}>{data.course.trackId?.name || 'Track'}</span>
                  <span className={`text-xs ${textSecondary}`}>{data.course.platform}</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">{data.course.title}</h1>
                <p className={`${textSecondary} mb-4`}>{data.course.description || 'No description available'}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className={`flex items-center gap-1 ${textSecondary}`}><MdPlayCircle className="text-blue-500" /> {data.totalLectures} lectures</span>
                  <Link to="/login" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition text-white text-sm">
                    Login to Enroll
                  </Link>
                </div>
              </div>
            </div>

            {/* Lectures Preview */}
            <div className={`${cardBg} rounded-2xl border ${borderColor} p-6`}>
              <h3 className="font-bold text-lg mb-4">Course Lectures ({data.totalLectures})</h3>
              {data.lectures?.length === 0 ? (
                <p className={textSecondary}>No lectures available</p>
              ) : (
                <div className="space-y-2">
                  {data.lectures.map((lec, i) => (
                    <div key={lec._id} className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-400">{i + 1}</div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{lec.title}</p>
                        <p className={`text-xs ${textSecondary}`}>{lec.type} {lec.duration > 0 ? `· ${lec.duration} min` : ''}</p>
                      </div>
                      <MdLock className="text-gray-500" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-center mt-8">
              <Link to="/login" className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition text-white">
                <FaGraduationCap /> Login to Start Learning
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CoursePreview;
