import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { notify } from '../components/Notifications';
import { MdCheckCircle, MdRadioButtonUnchecked, MdBookmarkBorder, MdBookmark, MdNotes, MdSlowMotionVideo, MdLock } from 'react-icons/md';
import { FaYoutube, FaVideo, FaLock, FaCrown } from 'react-icons/fa';
import CourseRating from '../components/CourseRating';
import ConfettiEffect from '../components/ConfettiEffect';

const SPEEDS = [0.5, 1, 1.5, 2];

function formatDuration(minutes) {
  if (!minutes || minutes === 0) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function CourseDetail() {
  const { courseId, fieldId, trackId } = useParams();
  const navigate = useNavigate();
  const { user, token, fetchActiveEnrollment, api } = useAuth();
  const { isDark } = useTheme();
  const videoRef = useRef(null);

  const [lectures, setLectures] = useState([]);
  const [course, setCourse] = useState(null);
  const [activeLecture, setActiveLecture] = useState(null);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [ytPlaybackSpeed, setYtPlaybackSpeed] = useState(1);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isPremiumLocked, setIsPremiumLocked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [showPointsPopup, setShowPointsPopup] = useState(false);
  const ytPlayerRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchData();
  }, [courseId]);

  useEffect(() => {
    if (activeLecture) {
      loadNotes();
      trackWatched();
    }
  }, [activeLecture?._id]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const fetchData = async () => {
    try {
      const [lecturesRes, courseRes, progressRes, durationRes, bookmarksRes] = await Promise.all([
        api.get(`/lectures/${courseId}`).catch(() => null),
        api.get(`/courses/detail/${courseId}`).catch(() => null),
        api.get(`/lectures/progress/${courseId}`).catch(() => null),
        api.get(`/lectures/duration/${courseId}`).catch(() => null),
        api.get(`/lectures/bookmarks/${courseId}`).catch(() => null)
      ]);

      const fetchedLectures = lecturesRes?.data || [];
      setLectures(fetchedLectures);
      if (courseRes?.data) {
        setCourse(courseRes.data);
        setIsLocked(courseRes.data.isLocked || false);
        setIsPremiumLocked(courseRes.data.isPremiumLocked || false);
      }
      if (progressRes?.data) setUserProgress(progressRes.data);
      if (durationRes?.data) setTotalDuration(durationRes.data.totalMinutes);
      if (bookmarksRes?.data) setBookmarkedIds(bookmarksRes.data);

      if (fetchedLectures.length > 0) {
        const lastWatched = progressRes?.data
          ?.filter(p => p.lastAccessedAt)
          ?.sort((a, b) => new Date(b.lastAccessedAt) - new Date(a.lastAccessedAt))[0];

        if (lastWatched) {
          const match = fetchedLectures.find(l => l._id === lastWatched.lectureId);
          if (match) setActiveLecture(match);
          else {
            const firstUnlocked = fetchedLectures.find(l => l.isUnlocked);
            setActiveLecture(firstUnlocked || fetchedLectures[0]);
          }
        } else {
          const firstUnlocked = fetchedLectures.find(l => l.isUnlocked);
          setActiveLecture(firstUnlocked || fetchedLectures[0]);
        }
      }
    } catch (err) {
      console.log('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const trackWatched = async () => {
    try {
      await api.put(`/lectures/${activeLecture._id}/watched`);
    } catch (err) {
      console.log(err);
    }
  };

  const loadNotes = async () => {
    try {
      const res = await api.get(`/lectures/${activeLecture._id}/notes`);
      setNotes(res.data.content || '');
      setNotesSaved(true);
    } catch (err) {
      console.log(err);
    }
  };

  const saveNotes = async () => {
    try {
      await api.put(`/lectures/${activeLecture._id}/notes`, { content: notes });
      setNotesSaved(true);
      notify('Notes saved!', 'success');
    } catch (err) {
      console.log(err);
    }
  };

  const isCompleted = (lectureId) => {
    return userProgress.some(p => p.lectureId === lectureId && p.isCompleted);
  };

  const isUnlocked = (lecture) => {
    return lecture.isUnlocked !== undefined ? lecture.isUnlocked : true;
  };

  const handleToggle = async (lectureId) => {
    try {
      const res = await api.put(`/lectures/${lectureId}/toggle`);
      setUserProgress(prev => {
        const existing = prev.find(p => p.lectureId === lectureId);
        if (existing) {
          return prev.map(p => p.lectureId === lectureId ? { ...p, isCompleted: res.data.progress.isCompleted } : p);
        }
        return [...prev, { lectureId, isCompleted: res.data.progress.isCompleted }];
      });
      setCourse(prev => ({
        ...prev,
        completedLectures: res.data.completedCount,
        status: res.data.status
      }));

      if (res.data.progress.isCompleted) {
        notify('Lecture completed!', 'success');
        // Refresh lectures to update unlock status
        const lecturesRes = await api.get(`/lectures/${courseId}`);
        setLectures(lecturesRes.data);
        await fetchActiveEnrollment();
      }

      if (res.data.status === 'completed') {
        notify('All lectures completed! Take the quiz to get your certificate!', 'success');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }

      // Show points earned notification
      api.get('/points/me').then(r => {
        if (r.data.points > 0) {
          setPointsEarned(r.data.points);
          setShowPointsPopup(true);
          setTimeout(() => setShowPointsPopup(false), 3000);
        }
      }).catch(() => {});
    } catch (err) {
      const msg = err.response?.data?.message || 'Cannot toggle lecture';
      notify(msg, 'error');
    }
  };

  const handleLectureClick = (lecture) => {
    if (!lecture.isUnlocked) {
      notify('Pehle previous lecture complete karein.', 'error');
      return;
    }
    if (lecture.isPremium && user?.subscriptionTier !== 'premium') {
      notify('This is a premium lecture. Upgrade to Premium to access.', 'error');
      return;
    }
    if (notes && !notesSaved) {
      saveNotes();
    }
    setActiveLecture(lecture);
  };

  const handleBookmark = async (lectureId) => {
    try {
      const res = await api.put(`/lectures/${lectureId}/bookmark`);
      if (res.data.bookmarked) {
        setBookmarkedIds(prev => [...prev, lectureId]);
      } else {
        setBookmarkedIds(prev => prev.filter(id => id !== lectureId));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const isBookmarked = (lectureId) => bookmarkedIds.includes(lectureId);

  const getYouTubeEmbed = (url) => {
    if (!url) return '';
    let videoId = '';
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) videoId = shortMatch[1];
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch) videoId = watchMatch[1];
    const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) videoId = embedMatch[1];
    const vMatch = url.match(/youtube\.com\/v\/([a-zA-Z0-9_-]{11})/);
    if (vMatch) videoId = vMatch[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  const percent = course
    ? Math.round((course.completedLectures / course.totalLectures) * 100) || 0
    : 0;

  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const progressBg = isDark ? 'bg-gray-700' : 'bg-gray-200';
  const statusBadge = (status) => {
    if (status === 'completed') return isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600';
    if (status === 'in-progress') return isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600';
    return isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600';
  };

  if (isLocked) {
    return (
      <div className={`min-h-screen ${bgPrimary} ${textPrimary} flex flex-col transition-colors duration-300`}>
        <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-6 py-6 gap-4">
          <button
            onClick={() => navigate(`/field/${fieldId}/track/${trackId}`)}
            className={`mb-3 ${textSecondary} hover:${textPrimary} flex items-center gap-2 transition`}
          >
            ← Back
          </button>
          <div className={`flex-1 flex items-center justify-center ${cardBg} rounded-2xl border ${borderColor}`}>
            <div className="text-center">
              {isPremiumLocked ? (
                <>
                  <FaCrown className="text-6xl mx-auto mb-4 text-yellow-500" />
                  <h2 className="text-2xl font-bold mb-2">Premium Course</h2>
                  <p className={textSecondary}>This course requires a premium subscription.</p>
                  <button
                    onClick={() => navigate('/subscription')}
                    className="mt-4 px-6 py-3 rounded-xl font-semibold transition text-white"
                    style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}
                  >
                    Upgrade to Premium
                  </button>
                </>
              ) : (
                <>
                  <FaLock className="text-6xl mx-auto mb-4 text-gray-500" />
                  <h2 className="text-2xl font-bold mb-2">Course Locked</h2>
                  <p className={textSecondary}>Pehle apna current course complete karein.</p>
                  <button
                    onClick={() => navigate('/mycourses')}
                    className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition"
                  >
                    Go to My Courses
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgPrimary} ${textPrimary} flex flex-col transition-colors duration-300`}>
      <ConfettiEffect active={showConfetti} duration={4000} />

      {/* Points earned popup */}
      {showPointsPopup && (
        <div className="fixed top-24 right-6 z-50 bg-yellow-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="text-2xl">⭐</span>
          <div>
            <p className="font-bold">+10 Points!</p>
            <p className="text-xs text-yellow-200">Total: {pointsEarned}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-6 py-6 gap-4">
        <div>
          <button
            onClick={() => navigate(`/field/${fieldId}/track/${trackId}/courses`)}
            className={`mb-3 ${textSecondary} hover:${textPrimary} flex items-center gap-2 transition`}
          >
            ← Back to Courses
          </button>

          {course && (
            <div className={`${cardBg} p-4 rounded-2xl border ${borderColor}`}>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className={`text-2xl font-bold ${textPrimary}`}>{course.title}</h2>
                  <p className={`${textSecondary} text-sm`}>{course.platform}</p>
                </div>
                <div className="flex items-center gap-3">
                  {totalDuration > 0 && (
                    <span className={`text-sm ${textSecondary}`}>
                      {formatDuration(totalDuration)}
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-sm ${statusBadge(course.status)}`}>
                    {course.status?.replace(/-/g, ' ')}
                  </span>
                </div>
              </div>
              <div className={`flex justify-between text-sm ${textSecondary} mb-1`}>
                <span>{course.completedLectures} / {course.totalLectures} lectures completed</span>
                <span>{percent}%</span>
              </div>
              <div className={`w-full ${progressBg} rounded-full h-2`}>
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className={`flex-1 flex items-center justify-center ${textSecondary}`}>Loading...</div>
        ) : (
          <>
          <div className="flex gap-6 flex-1">
            <div className="flex-1">
              {activeLecture ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-lg font-bold ${textPrimary}`}>{activeLecture.title}</h3>
                    {activeLecture.duration > 0 && (
                      <span className={`text-xs ${textSecondary}`}>{formatDuration(activeLecture.duration)}</span>
                    )}
                  </div>
                  {activeLecture.type === 'youtube' ? (
                    (() => {
                      const embedUrl = getYouTubeEmbed(activeLecture.youtubeUrl);
                      return embedUrl ? (
                        <YouTubePlayer
                          embedUrl={embedUrl}
                          title={activeLecture.title}
                          ytPlaybackSpeed={ytPlaybackSpeed}
                          onReady={(player) => { ytPlayerRef.current = player; }}
                        />
                      ) : (
                        <div className={`aspect-video rounded-2xl ${cardBg} border ${borderColor} flex items-center justify-center`}>
                          <div className={`text-center ${textSecondary}`}>
                            <FaYoutube className="text-5xl mx-auto mb-3 opacity-30" />
                            <p>No YouTube video available</p>
                            <p className={`text-xs mt-2 ${textSecondary}`}>Please add a YouTube URL in admin panel</p>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                      <video
                        ref={videoRef}
                        src={`${API_BASE}${activeLecture.videoPath}`}
                        controls
                        className="w-full h-full"
                        playbackRate={playbackSpeed}
                        onEnded={() => {
                          if (!isCompleted(activeLecture._id)) {
                            handleToggle(activeLecture._id);
                          }
                        }}
                      />
                    </div>
                  )}

                  {/* Speed Controls */}
                  <div className="flex items-center gap-2 mt-3">
                    <MdSlowMotionVideo className={textSecondary} />
                    <span className={`text-xs ${textSecondary} mr-1`}>Speed:</span>
                    {SPEEDS.map(speed => (
                      <button
                        key={speed}
                        onClick={() => {
                          if (activeLecture.type === 'video') {
                            setPlaybackSpeed(speed);
                          } else {
                            setYtPlaybackSpeed(speed);
                            if (ytPlayerRef.current) {
                              ytPlayerRef.current.setPlaybackRate(speed);
                            }
                          }
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          (activeLecture.type === 'video' ? playbackSpeed : ytPlaybackSpeed) === speed
                            ? 'bg-blue-600 text-white'
                            : `${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => handleToggle(activeLecture._id)}
                      className={`flex items-center gap-2 px-6 py-2 rounded-xl font-semibold transition text-white ${
                        isCompleted(activeLecture._id)
                          ? 'bg-gray-500 hover:bg-gray-600'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isCompleted(activeLecture._id) ? (
                        <><MdCheckCircle /> Completed</>
                      ) : (
                        <><MdRadioButtonUnchecked /> Mark as Complete</>
                      )}
                    </button>
                  </div>

                  {/* Notes Section */}
                  <div className={`mt-6 ${cardBg} border ${borderColor} rounded-2xl p-4`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <MdNotes className="text-blue-400" />
                        Your Notes
                      </h4>
                      <button
                        onClick={saveNotes}
                        disabled={notesSaved}
                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
                          notesSaved
                            ? 'bg-gray-500 text-gray-300 cursor-default'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {notesSaved ? 'Saved' : 'Save'}
                      </button>
                    </div>
                    <textarea
                      value={notes}
                      onChange={(e) => { setNotes(e.target.value); setNotesSaved(false); }}
                      placeholder="Write your notes for this lecture..."
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl text-sm ${
                        isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                      } placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                    />
                  </div>
                </div>
              ) : (
                <div className={`aspect-video rounded-2xl ${cardBg} border ${borderColor} flex items-center justify-center`}>
                  <div className={`text-center ${textSecondary}`}>
                    <FaVideo className="text-5xl mx-auto mb-3 opacity-30" />
                    <p>Select a lecture to start watching</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right - Lectures List */}
            <div className="w-80 flex flex-col gap-3">
              <h3 className={`text-lg font-bold ${textPrimary}`}>Lectures ({lectures.length})</h3>

              <div className="flex flex-col gap-2 overflow-y-auto max-h-screen">
                {lectures.length === 0 ? (
                  <div className={`text-center py-10 ${textSecondary}`}>
                    <p className="text-sm">No lectures available yet</p>
                  </div>
                ) : (
                  lectures.map((lecture, index) => {
                    const completed = isCompleted(lecture._id);
                    const unlocked = lecture.isUnlocked;
                    const isPremiumLecture = lecture.isPremium && user?.subscriptionTier !== 'premium';
                    return (
                      <div
                        key={lecture._id}
                        onClick={() => handleLectureClick(lecture)}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition border ${
                          !unlocked && !completed || isPremiumLecture
                            ? 'opacity-50'
                            : ''
                        } ${
                          activeLecture?._id === lecture._id
                            ? `${cardBg} border-blue-500`
                            : `${cardBg} ${borderColor} hover:border-blue-500`
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                          completed
                            ? 'bg-green-500 border-green-500'
                            : unlocked
                            ? 'border-blue-500'
                            : 'border-gray-500'
                        }`}>
                          {completed ? (
                            <MdCheckCircle className="text-white text-xs" />
                          ) : !unlocked ? (
                            <MdLock className="text-gray-500 text-xs" />
                          ) : null}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate flex items-center gap-1 ${
                            completed ? 'line-through text-gray-500' : unlocked ? textPrimary : 'text-gray-500'
                          }`}>
                            {index + 1}. {lecture.title}
                            {lecture.isPremium && <FaCrown className="text-yellow-500 text-xs shrink-0" />}
                            {!unlocked && !completed && <MdLock className="text-gray-500 text-xs shrink-0" />}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            {lecture.type === 'youtube' ? <FaYoutube className="text-blue-400" /> : <FaVideo className="text-blue-400" />}
                            {lecture.type === 'youtube' ? 'YouTube' : 'Video'}
                            {lecture.duration > 0 && <span className="ml-1">· {formatDuration(lecture.duration)}</span>}
                          </p>
                        </div>

                        <button
                          onClick={(e) => { e.stopPropagation(); handleBookmark(lecture._id); }}
                          className={`shrink-0 transition ${isBookmarked(lecture._id) ? 'text-blue-400' : `${textSecondary} hover:text-blue-400`}`}
                        >
                          {isBookmarked(lecture._id) ? <MdBookmark /> : <MdBookmarkBorder />}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {course?.status === 'completed' && (
                <button
                  onClick={() => navigate(`/field/${fieldId}/track/${trackId}/quiz`)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition mt-2 text-white"
                >
                  Take Quiz
                </button>
              )}
            </div>
          </div>

          <div className="max-w-3xl mt-6">
            <CourseRating courseId={courseId} />
          </div>
          </>
        )}
      </div>
    </div>
  );
}

// YouTube IFrame Player component with speed control support
function YouTubePlayer({ embedUrl, title, ytPlaybackSpeed, onReady }) {
  const playerDivRef = useRef(null);
  const playerInstanceRef = useRef(null);

  useEffect(() => {
    if (!embedUrl || !playerDivRef.current) return;

    const videoId = embedUrl.split('/').pop();

    const loadPlayer = () => {
      if (playerInstanceRef.current) return;
      try {
        playerInstanceRef.current = new window.YT.Player(playerDivRef.current, {
          videoId,
          playerVars: {
            enablejsapi: 1,
            rel: 0,
            modestbranding: 1
          },
          events: {
            onReady: () => {
              if (playerInstanceRef.current) {
                playerInstanceRef.current.setPlaybackRate(ytPlaybackSpeed);
                onReady(playerInstanceRef.current);
              }
            }
          }
        });
      } catch (e) {
        console.log('YT Player error:', e);
      }
    };

    if (window.YT && window.YT.Player) {
      loadPlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode.insertBefore(tag, firstScript);
      window.onYouTubeIframeAPIReady = loadPlayer;
    }

    return () => {
      if (playerInstanceRef.current) {
        try { playerInstanceRef.current.destroy(); } catch (e) {}
        playerInstanceRef.current = null;
      }
    };
  }, [embedUrl]);

  useEffect(() => {
    if (playerInstanceRef.current && playerInstanceRef.current.setPlaybackRate) {
      try {
        playerInstanceRef.current.setPlaybackRate(ytPlaybackSpeed);
      } catch (e) {}
    }
  }, [ytPlaybackSpeed]);

  return (
    <div className="aspect-video rounded-2xl overflow-hidden bg-black">
      <div ref={playerDivRef} className="w-full h-full" />
    </div>
  );
}

export default CourseDetail;
