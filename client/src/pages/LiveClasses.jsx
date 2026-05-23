import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { MdVideocam, MdAccessTime, MdPerson, MdLink, MdRefresh } from 'react-icons/md';
import { FaGoogle, FaVideo, FaCalendarAlt } from 'react-icons/fa';

function LiveClasses() {
  const { api } = useAuth();
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchClasses(); }, []);

  const fetchClasses = async () => {
    try {
      const res = await api.get('/live-classes/my');
      setClasses(res.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'zoom': return <FaVideo className="text-blue-400" />;
      case 'google_meet': return <FaGoogle className="text-green-400" />;
      default: return <MdVideocam />;
    }
  };

  const getStatusBadge = (cls) => {
    const now = new Date();
    const start = new Date(cls.startTime);
    const end = new Date(cls.endTime);
    if (now >= start && now <= end) return { text: t('liveNow'), color: 'bg-red-600' };
    if (now > end) return { text: t('ended'), color: 'bg-gray-600' };
    return { text: t('scheduled'), color: 'bg-blue-600' };
  };

  const isLive = (cls) => {
    const now = new Date();
    return now >= new Date(cls.startTime) && now <= new Date(cls.endTime);
  };

  return (
    <div className={`min-h-screen ${bgPrimary} ${textPrimary} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-1">{t('liveClasses')}</h2>
            <p className={textSecondary}>{t('upcomingClasses')}</p>
          </div>
          <button onClick={() => { setLoading(true); fetchClasses(); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold transition">
            <MdRefresh /> {t('refresh') || 'Refresh'}
          </button>
        </div>

        {loading ? (
          <div className={`text-center py-16 ${textSecondary}`}>{t('loading')}</div>
        ) : classes.length === 0 ? (
          <div className={`text-center py-16 ${cardBg} rounded-2xl border ${borderColor}`}>
            <MdVideocam className="text-5xl mx-auto mb-4 text-gray-500" />
            <p className={`text-lg ${textSecondary}`}>{t('noUpcomingClasses')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {classes.map(cls => {
              const badge = getStatusBadge(cls);
              const live = isLive(cls);
              return (
                <div key={cls._id} className={`${cardBg} p-6 rounded-2xl border ${live ? 'border-red-500 ring-1 ring-red-500' : borderColor} transition hover:shadow-lg`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-0.5 rounded-full text-xs font-semibold text-white ${badge.color}`}>{badge.text}</span>
                        <span className="flex items-center gap-1 text-xs text-gray-500">{getPlatformIcon(cls.platform)} {cls.platform.replace('_', ' ')}</span>
                      </div>
                      <h3 className={`text-xl font-bold ${textPrimary}`}>{cls.title}</h3>
                      {cls.description && <p className={`text-sm ${textSecondary} mt-1`}>{cls.description}</p>}
                      <div className="flex flex-wrap gap-4 mt-3 text-sm">
                        {cls.instructor && (
                          <span className={`flex items-center gap-1 ${textSecondary}`}><MdPerson /> {cls.instructor}</span>
                        )}
                        <span className={`flex items-center gap-1 ${textSecondary}`}>
                          <MdAccessTime /> {new Date(cls.startTime).toLocaleString()} — {new Date(cls.endTime).toLocaleTimeString()}
                        </span>
                      </div>
                      {cls.recordedVideo && (
                        <a href={cls.recordedVideo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-500 text-sm mt-2 hover:underline">
                          <MdVideocam /> Recording available
                        </a>
                      )}
                    </div>
                    <a
                      href={cls.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition whitespace-nowrap ${
                        live ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <MdLink /> {t('joinClass')}
                    </a>
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

export default LiveClasses;
