import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaFire } from 'react-icons/fa';
import { MdTrendingUp, MdStar, MdCalendarToday, MdClose } from 'react-icons/md';

function StreakCard() {
  const { token, api } = useAuth();
  const { isDark } = useTheme();
  const [streak, setStreak] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (token) fetchStreak();
  }, [token]);

  const fetchStreak = async () => {
    try {
      const res = await api.get('/streak');
      setStreak(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!streak) return null;

  const getStreakMessage = (days) => {
    if (days === 0) return 'Start your streak today!';
    if (days === 1) return 'Great start! Keep going!';
    if (days < 7) return 'Building momentum!';
    if (days < 14) return 'One week strong!';
    if (days < 30) return 'On fire! Keep it up!';
    return 'Unstoppable! Amazing streak!';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPopup(!showPopup)}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition ${
          isDark ? 'bg-gray-700 bg-opacity-40 hover:bg-opacity-60' : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        <FaFire className="text-xl text-blue-400" />
        <div className="text-left">
          <p className="font-bold text-sm text-blue-400">
            {streak.currentStreak} Day Streak
          </p>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>{getStreakMessage(streak.currentStreak)}</p>
        </div>
      </button>

      {showPopup && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPopup(false)}
          />

          <div className={`absolute left-full ml-2 top-0 z-50 w-64 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl shadow-2xl p-5`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <FaFire className="text-blue-400" />
                Learning Streak
              </h3>
              <button onClick={() => setShowPopup(false)} className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition`}>
                <MdClose />
              </button>
            </div>

            <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl p-4 mb-4 text-center`}>
              <p className="text-5xl font-bold text-blue-400">
                {streak.currentStreak}
              </p>
              <p className={`font-semibold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Day Streak</p>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs mt-1`}>{getStreakMessage(streak.currentStreak)}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} p-2 rounded-xl text-center`}>
                <MdTrendingUp className="text-blue-400 text-lg mx-auto mb-1" />
                <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{streak.longestStreak}</p>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>Best</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} p-2 rounded-xl text-center`}>
                <MdCalendarToday className="text-blue-400 text-lg mx-auto mb-1" />
                <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{streak.totalDaysActive}</p>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>Total Days</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} p-2 rounded-xl text-center`}>
                <MdStar className="text-blue-400 text-lg mx-auto mb-1" />
                <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {streak.currentStreak >= 30 ? 'Legend' :
                   streak.currentStreak >= 14 ? 'Pro' :
                   streak.currentStreak >= 7 ? 'Active' : 'Beginner'}
                </p>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>Status</p>
              </div>
            </div>

            <div>
              <div className={`flex justify-between text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                <span>Weekly Goal</span>
                <span>{Math.min(streak.currentStreak, 7)}/7 days</span>
              </div>
              <div className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min((streak.currentStreak / 7) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default StreakCard;