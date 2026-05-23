import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MdLock, MdCheckCircle, MdPlayCircle, MdTimeline } from 'react-icons/md';
import { FaGraduationCap, FaLock } from 'react-icons/fa';
import RoadmapTree, { SubFieldCard, CareerPathCard } from '../components/RoadmapTree';
import FieldIcon from '../components/FieldIcon';

function FieldDashboard() {
  const { fieldId } = useParams();
  const navigate = useNavigate();
  const { token, activeEnrollment, fetchActiveEnrollment, api } = useAuth();
  const { isDark } = useTheme();
  const [field, setField] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => { if (token) fetchData(); }, [fieldId, token]);

  const fetchData = async () => {
    try {
      const [fieldsRes, tracksRes, roadmapRes] = await Promise.all([
        api.get('/admin/fields'),
        api.get(`/admin/fields/${fieldId}/tracks`),
        api.get(`/roadmap/field/${fieldId}`).catch(() => null)
      ]);
      const found = roadmapRes?.data?.field || fieldsRes.data.find(f => f._id === fieldId);
      setField(found);
      setTracks(tracksRes.data || []);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const isCurrentActiveField = activeEnrollment?.enrolled && activeEnrollment.field?._id === fieldId;

  const handleEnroll = async (track) => {
    if (activeEnrollment?.enrolled) return;
    setEnrolling(true);
    try {
      const coursesRes = await api.get(`/courses/${fieldId}/${track._id}`);
      const courses = coursesRes.data || [];
      if (courses.length > 0) {
        await api.post('/enrollment/enroll', {
          courseId: courses[0]._id,
          fieldId: fieldId,
          trackId: track._id
        });
        await fetchActiveEnrollment();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setEnrolling(false);
    }
  };

  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'subfields', label: 'Sub-Fields' },
    { id: 'careers', label: 'Careers' },
  ];

  if (loading) return (
    <div className={`min-h-screen ${bgPrimary} flex items-center justify-center`}>
      <p className={textSecondary}>Loading...</p>
    </div>
  );

  if (!field) return (
    <div className={`min-h-screen ${bgPrimary} flex items-center justify-center`}>
      <h2 className={`text-2xl ${textPrimary}`}>Field not found!</h2>
    </div>
  );

  return (
    <div className={`min-h-screen ${bgPrimary} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-6 py-8">

        <button onClick={() => navigate('/dashboard')} className={`mb-6 flex items-center gap-2 transition ${textSecondary} hover:${textPrimary}`}>
          ← Back to Dashboard
        </button>

        {/* Field Header */}
        <div className={`rounded-2xl p-8 mb-6 relative overflow-hidden`} style={{ background: field.bannerColor || 'linear-gradient(135deg, var(--accent-600), var(--accent-800))' }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <FieldIcon name={field.icon} className="text-5xl" />
                <div>
                  <h2 className="text-3xl font-bold text-white">{field.name}</h2>
                  <p className="text-white/80 text-sm mt-1">{field.description}</p>
                </div>
              </div>
              {isCurrentActiveField && (
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white text-sm font-semibold flex items-center gap-2">
                  <MdPlayCircle /> Active
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {field.totalDuration && (
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">{field.totalDuration}</span>
              )}
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">{tracks.length} Tracks</span>
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">{field.subFields?.length || 0} Sub-Fields</span>
              {field.difficulty && (
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium capitalize">{field.difficulty}</span>
              )}
            </div>
          </div>
        </div>

        {/* Locked Warning */}
        {activeEnrollment?.enrolled && !isCurrentActiveField && (
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

        {/* Tabs */}
        <div className={`flex gap-1 mb-6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} p-1 rounded-xl`}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {field.longDescription && (
              <div className={`${cardBg} p-6 rounded-2xl border ${borderColor}`}>
                <h3 className={`text-lg font-bold mb-2 ${textPrimary}`}>About {field.name}</h3>
                <p className={`text-sm ${textSecondary}`}>{field.longDescription}</p>
              </div>
            )}

            {field.prerequisites?.length > 0 && (
              <div className={`${cardBg} p-6 rounded-2xl border ${borderColor}`}>
                <h3 className={`text-lg font-bold mb-2 ${textPrimary}`}>Prerequisites</h3>
                <div className="flex flex-wrap gap-2">
                  {field.prerequisites.map((p, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: isDark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.08)', color: 'var(--accent-500)' }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tracks / Learning Paths */}
            <div>
              <h3 className={`text-lg font-bold mb-4 ${textPrimary}`}>Learning Tracks</h3>
              {tracks.length === 0 ? (
                <div className={`text-center py-10 ${cardBg} rounded-2xl border ${borderColor}`}>
                  <p className={textSecondary}>No tracks available yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tracks.map((track) => {
                    const isActiveTrack = isCurrentActiveField && activeEnrollment.track?._id === track._id;
                    const isTrackLocked = activeEnrollment?.enrolled && !isActiveTrack;

                    return (
                      <div
                        key={track._id}
                        className={`${cardBg} p-5 rounded-2xl border transition ${
                          isActiveTrack ? 'ring-2 ring-blue-500 border-blue-500' : borderColor + ' hover:border-blue-500'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                              style={{ background: 'linear-gradient(135deg, var(--accent-400), var(--accent-600))' }}>
                              <span className="text-white text-sm font-bold">{track.name?.slice(0, 2).toUpperCase()}</span>
                            </div>
                            <div>
                              <h4 className={`font-bold text-sm ${textPrimary}`}>{track.name}</h4>
                              <p className={`text-xs ${textSecondary}`}>{track.description}</p>
                            </div>
                          </div>
                          {isActiveTrack && <MdCheckCircle className="text-blue-500 text-xl shrink-0" />}
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {track.roadmap?.slice(0, 3).map((step, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500">
                              {step.title}
                            </span>
                          ))}
                          {(track.roadmap?.length || 0) > 3 && (
                            <span className="text-[10px] text-blue-500">+{track.roadmap.length - 3} more</span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {activeEnrollment?.enrolled ? (
                            isActiveTrack ? (
                              <button
                                onClick={() => {
                                  if (activeEnrollment.course) {
                                    navigate(`/field/${fieldId}/track/${track._id}/course/${activeEnrollment.course._id}`);
                                  }
                                }}
                                className="flex-1 py-2 rounded-xl text-white text-xs font-semibold transition"
                                style={{ backgroundColor: 'var(--accent-500)' }}
                                onMouseEnter={e => e.target.style.backgroundColor = 'var(--accent-600)'}
                                onMouseLeave={e => e.target.style.backgroundColor = 'var(--accent-500)'}
                              >
                                Continue Learning
                              </button>
                            ) : (
                              <button disabled className="flex-1 py-2 bg-gray-500 rounded-xl text-gray-300 text-xs font-semibold cursor-not-allowed flex items-center justify-center gap-1">
                                <FaLock className="text-[10px]" /> Locked
                              </button>
                            )
                          ) : (
                            <button
                              onClick={() => handleEnroll(track)}
                              disabled={enrolling}
                              className="flex-1 py-2 rounded-xl text-white text-xs font-semibold transition"
                              style={{ backgroundColor: 'var(--accent-500)' }}
                              onMouseEnter={e => { if (!enrolling) e.target.style.backgroundColor = 'var(--accent-600)'; }}
                              onMouseLeave={e => { if (!enrolling) e.target.style.backgroundColor = 'var(--accent-500)'; }}
                            >
                              {enrolling ? 'Enrolling...' : 'Enroll Now'}
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/field/${fieldId}/track/${track._id}`)}
                            className={`px-4 py-2 rounded-xl border ${borderColor} ${textSecondary} hover:${textPrimary} transition text-xs font-medium`}
                          >
                            View Roadmap
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className={`${cardBg} rounded-2xl border ${borderColor} p-6`}>
            <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${textPrimary}`}>
              <MdTimeline style={{ color: 'var(--accent-500)' }} /> Complete Learning Roadmap
            </h3>
            {field.roadmap?.length > 0 ? (
              <RoadmapTree
                steps={field.roadmap}
                progress={[]}
                isLocked={activeEnrollment?.enrolled && !isCurrentActiveField}
              />
            ) : (
              <p className={`text-sm ${textSecondary} py-8 text-center`}>Roadmap details coming soon</p>
            )}
          </div>
        )}

        {activeTab === 'subfields' && (
          <div>
            <h3 className={`text-lg font-bold mb-4 ${textPrimary}`}>Sub-Fields</h3>
            {field.subFields?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {field.subFields.map((sf, i) => (
                  <SubFieldCard
                    key={i}
                    subField={sf}
                    isLocked={activeEnrollment?.enrolled && !isCurrentActiveField}
                    onClick={() => {}}
                  />
                ))}
              </div>
            ) : (
              <div className={`text-center py-10 ${cardBg} rounded-2xl border ${borderColor}`}>
                <p className={textSecondary}>No sub-fields defined</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'careers' && (
          <div>
            <h3 className={`text-lg font-bold mb-4 ${textPrimary}`}>Career Opportunities</h3>
            {field.careerPaths?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {field.careerPaths.map((cp, i) => (
                  <CareerPathCard key={i} path={cp} />
                ))}
              </div>
            ) : (
              <div className={`text-center py-10 ${cardBg} rounded-2xl border ${borderColor}`}>
                <p className={textSecondary}>No career paths available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FieldDashboard;
