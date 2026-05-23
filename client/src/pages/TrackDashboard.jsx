import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MdLock, MdCheckCircle, MdPlayCircle, MdTimeline, MdSchool, MdTrendingUp, MdCode, MdStar, MdSearch } from 'react-icons/md';
import { FaGraduationCap, FaLock } from 'react-icons/fa';
import RoadmapTree from '../components/RoadmapTree';
import FieldIcon from '../components/FieldIcon';

function TrackDashboard() {
  const { fieldId, trackId } = useParams();
  const navigate = useNavigate();
  const { token, activeEnrollment, api } = useAuth();
  const { isDark } = useTheme();
  const [track, setTrack] = useState(null);
  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('roadmap');
  const [courseSearch, setCourseSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => { if (token) fetchTrack(); }, [trackId, token]);

  const fetchTrack = async () => {
    try {
      const [trackRes, fieldsRes] = await Promise.all([
        api.get(`/roadmap/track/${trackId}`).catch(() => null),
        api.get('/admin/fields')
      ]);

      if (trackRes?.data) {
        setTrack(trackRes.data.track);
      } else {
        const tracksRes = await api.get(`/admin/fields/${fieldId}/tracks`);
        const found = tracksRes.data.find(t => t._id === trackId);
        setTrack(found);
      }
      const foundField = fieldsRes.data.find(f => f._id === fieldId);
      setField(foundField);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const progressBg = isDark ? 'bg-gray-700' : 'bg-gray-200';

  const isLocked = activeEnrollment?.enrolled && activeEnrollment.track?._id !== trackId;

  const handleCourseSearch = async (query) => {
    setCourseSearch(query);
    if (!query.trim()) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await api.get(`/lectures/search/${trackId}?q=${encodeURIComponent(query)}`);
      setSearchResults(res.data);
    } catch (err) { console.log(err); }
    finally { setSearching(false); }
  };

  if (loading) return (
    <div className={`min-h-screen ${bgPrimary} flex items-center justify-center`}>
      <p className={textSecondary}>Loading...</p>
    </div>
  );

  if (!track) return (
    <div className={`min-h-screen ${bgPrimary} flex items-center justify-center`}>
      <h2 className={`text-2xl ${textPrimary}`}>Track not found!</h2>
    </div>
  );

  const totalSteps = track.roadmap?.length || 0;
  const completedSteps = 0;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className={`min-h-screen ${bgPrimary} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-6 py-8">

        <button onClick={() => navigate(`/field/${fieldId}`)} className={`mb-6 flex items-center gap-2 transition ${textSecondary} hover:${textPrimary}`}>
          ← Back to {field?.name || 'Field'}
        </button>

        {/* Track Header */}
        <div className={`rounded-2xl p-8 mb-6 relative overflow-hidden`} style={{ background: 'linear-gradient(135deg, var(--accent-600), var(--accent-800))' }}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <FieldIcon name={track.icon} className="text-5xl" />
                <div>
                  <h2 className="text-3xl font-bold text-white">{track.name}</h2>
                  <p className="text-white/80 text-sm mt-1">{track.description}</p>
                </div>
              </div>
              {activeEnrollment?.enrolled && activeEnrollment.track?._id === trackId && (
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white text-sm font-semibold flex items-center gap-2">
                  <MdPlayCircle /> Active
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {track.difficulty && (
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium capitalize">{track.difficulty}</span>
              )}
              {track.duration && (
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">{track.duration}</span>
              )}
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">{totalSteps} Steps</span>
              {(track.careerRoles?.length || 0) > 0 && (
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">{track.careerRoles[0]}</span>
              )}
            </div>
          </div>
        </div>

        {/* Lock Warning */}
        {isLocked && (
          <div className={`mb-6 p-4 ${cardBg} rounded-2xl border border-yellow-500 flex items-center gap-3`}>
            <MdLock className="text-yellow-500 text-xl" />
            <p className={`text-sm ${textPrimary}`}>
              Pehle apna current course complete karein.
            </p>
            <button
              onClick={() => {
                if (activeEnrollment.course) {
                  navigate(`/field/${activeEnrollment.course.fieldId}/track/${activeEnrollment.course.trackId}/course/${activeEnrollment.course._id}`);
                }
              }}
              className="ml-auto px-4 py-2 rounded-xl text-white text-sm font-semibold transition"
              style={{ backgroundColor: 'var(--accent-500)' }}
              onMouseEnter={e => e.target.style.backgroundColor = 'var(--accent-600)'}
              onMouseLeave={e => e.target.style.backgroundColor = 'var(--accent-500)'}
            >
              Go to Active Course
            </button>
          </div>
        )}

        {/* Progress Bar */}
        {!isLocked && (
          <div className={`${cardBg} p-4 rounded-2xl border ${borderColor} mb-6`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-semibold ${textPrimary}`}>Overall Progress</span>
              <span className="text-sm font-bold" style={{ color: 'var(--accent-500)' }}>{progressPercent}%</span>
            </div>
            <div className={`w-full ${progressBg} rounded-full h-2.5`}>
              <div className="h-2.5 rounded-full transition-all" style={{ width: `${progressPercent}%`, backgroundColor: 'var(--accent-500)' }}></div>
            </div>
            <p className={`text-xs ${textSecondary} mt-1`}>{completedSteps} of {totalSteps} steps completed</p>
          </div>
        )}

        {/* Sections */}
        <div className={`flex gap-1 mb-6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} p-1 rounded-xl`}>
          {[
            { id: 'roadmap', label: 'Roadmap' },
            { id: 'details', label: 'Details' },
            { id: 'actions', label: 'Actions' }
          ].map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
                activeSection === s.id
                  ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Roadmap Section */}
        {activeSection === 'roadmap' && (
          <div className={`${cardBg} rounded-2xl border ${borderColor} p-6`}>
            <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${textPrimary}`}>
              <MdTimeline style={{ color: 'var(--accent-500)' }} /> Learning Steps
            </h3>
            {track.roadmap?.length > 0 ? (
              <RoadmapTree
                steps={track.roadmap}
                progress={[]}
                isLocked={isLocked}
              />
            ) : (
              <p className={`text-sm ${textSecondary} py-8 text-center`}>Roadmap details coming soon</p>
            )}
          </div>
        )}

        {/* Details Section */}
        {activeSection === 'details' && (
          <div className="space-y-4">
            {track.overview && (
              <div className={`${cardBg} p-6 rounded-2xl border ${borderColor}`}>
                <h3 className={`font-bold mb-2 ${textPrimary}`}>Overview</h3>
                <p className={`text-sm ${textSecondary}`}>{track.overview}</p>
              </div>
            )}

            {track.technologies?.length > 0 && (
              <div className={`${cardBg} p-6 rounded-2xl border ${borderColor}`}>
                <h3 className={`font-bold mb-3 flex items-center gap-2 ${textPrimary}`}>
                  <MdCode style={{ color: 'var(--accent-500)' }} /> Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {track.technologies.map((tech, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: isDark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.08)', color: 'var(--accent-500)' }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {track.careerRoles?.length > 0 && (
              <div className={`${cardBg} p-6 rounded-2xl border ${borderColor}`}>
                <h3 className={`font-bold mb-3 flex items-center gap-2 ${textPrimary}`}>
                  <MdStar style={{ color: 'var(--accent-500)' }} /> Career Roles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {track.careerRoles.map((role, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: isDark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.08)', color: 'var(--accent-500)' }}>
                      {role}
                    </span>
                  ))}
                </div>
                {track.averageSalary && (
                  <p className={`mt-3 text-sm ${textSecondary}`}>Avg. Salary: <span className="font-semibold" style={{ color: 'var(--accent-500)' }}>{track.averageSalary}</span></p>
                )}
              </div>
            )}

            {track.prerequisites?.length > 0 && (
              <div className={`${cardBg} p-6 rounded-2xl border ${borderColor}`}>
                <h3 className={`font-bold mb-2 ${textPrimary}`}>Prerequisites</h3>
                <ul className="list-disc list-inside space-y-1">
                  {track.prerequisites.map((p, i) => (
                    <li key={i} className={`text-sm ${textSecondary}`}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Actions Section */}
        {activeSection === 'actions' && (
          <div className="space-y-3">
            <button
              onClick={() => navigate(`/field/${fieldId}/track/${trackId}/courses`)}
              disabled={isLocked}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition ${
                isLocked
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'text-white'
              }`}
              style={!isLocked ? { backgroundColor: 'var(--accent-500)' } : {}}
              onMouseEnter={e => { if (!isLocked) e.target.style.backgroundColor = 'var(--accent-600)'; }}
              onMouseLeave={e => { if (!isLocked) e.target.style.backgroundColor = 'var(--accent-500)'; }}
            >
              {isLocked ? <span className="flex items-center justify-center gap-2"><FaLock /> Locked</span> : 'View My Courses'}
            </button>
            <button
              onClick={() => navigate(`/field/${fieldId}/track/${trackId}/quiz`)}
              disabled={isLocked}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition ${
                isLocked
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'text-white'
              }`}
              style={!isLocked ? { backgroundColor: 'var(--accent-500)' } : {}}
              onMouseEnter={e => { if (!isLocked) e.target.style.backgroundColor = 'var(--accent-600)'; }}
              onMouseLeave={e => { if (!isLocked) e.target.style.backgroundColor = 'var(--accent-500)'; }}
            >
              Take Quiz
            </button>
            <button
              onClick={() => navigate(`/field/${fieldId}/track/${trackId}/discussion`)}
              className="w-full py-4 rounded-xl font-semibold text-lg transition text-white"
              style={{ backgroundColor: 'var(--accent-500)' }}
              onMouseEnter={e => e.target.style.backgroundColor = 'var(--accent-600)'}
              onMouseLeave={e => e.target.style.backgroundColor = 'var(--accent-500)'}
            >
              Discussion Forum
            </button>

            {/* Course Search within Track */}
            <div className={`${cardBg} p-4 rounded-2xl border ${borderColor}`}>
              <h4 className={`font-semibold mb-3 flex items-center gap-2 text-sm ${textPrimary}`}>
                <MdSearch style={{ color: 'var(--accent-500)' }} /> Search Courses in this Track
              </h4>
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={courseSearch}
                  onChange={(e) => handleCourseSearch(e.target.value)}
                  placeholder="Search courses..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} placeholder-gray-500 focus:outline-none`}
                />
              </div>
              {searching && <p className={`text-xs ${textSecondary} mt-2`}>Searching...</p>}
              {searchResults.length > 0 && (
                <div className="mt-3 space-y-2">
                  {searchResults.map(c => (
                    <div
                      key={c._id}
                      onClick={() => navigate(`/field/${fieldId}/track/${trackId}/course/${c._id}`)}
                      className={`p-3 rounded-xl cursor-pointer transition ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      <p className={`text-sm font-semibold ${textPrimary}`}>{c.title}</p>
                      <p className={`text-xs ${textSecondary}`}>{c.platform}</p>
                    </div>
                  ))}
                </div>
              )}
              {courseSearch && !searching && searchResults.length === 0 && (
                <p className={`text-xs ${textSecondary} mt-2`}>No courses found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackDashboard;
