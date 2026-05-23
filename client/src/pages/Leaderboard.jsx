import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaTrophy, FaMedal, FaFire } from 'react-icons/fa';
import { MdPlayCircle, MdWorkspacePremium } from 'react-icons/md';

function Leaderboard() {
  const { user, token, api } = useAuth();
  const { isDark } = useTheme();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  useEffect(() => {
    if (token) fetchLeaderboard();
  }, [token]);

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get('/leaderboard');
      setLeaderboard(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index) => {
    if (index === 0) return <FaTrophy className="text-blue-400 text-2xl" />;
    if (index === 1) return <FaMedal className="text-gray-400 text-2xl" />;
    if (index === 2) return <FaMedal className="text-blue-300 text-2xl" />;
    return <span className="text-gray-400 font-bold text-lg">#{index + 1}</span>;
  };

  const myRank = leaderboard.findIndex(u => u._id === user?._id);

  return (
    <div className={`max-w-4xl mx-auto px-6 py-10 ${bgPrimary} ${textPrimary} transition-colors duration-300`}>
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <FaTrophy className="text-blue-400 text-5xl" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Leaderboard</h2>
        <p className={textSecondary}>Top learners ranked by score</p>
      </div>

      <div className={`${cardBg} p-4 rounded-2xl border ${borderColor} mb-6`}>
        <h3 className={`font-bold mb-3 text-sm ${textSecondary} uppercase tracking-wide`}>How Score is Calculated</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-blue-400 font-bold text-lg">10 pts</p>
            <p className={`${textSecondary} text-xs`}>Per Lecture</p>
          </div>
          <div>
            <p className="text-blue-400 font-bold text-lg">50 pts</p>
            <p className={`${textSecondary} text-xs`}>Per Certificate</p>
          </div>
          <div>
            <p className="text-blue-400 font-bold text-lg">5 pts</p>
            <p className={`${textSecondary} text-xs`}>Per Streak Day</p>
          </div>
        </div>
      </div>

      {myRank !== -1 && (
        <div className={`${cardBg} border border-blue-500 p-4 rounded-2xl mb-6`}>
          <p className="text-blue-400 text-sm font-semibold mb-1">Your Rank</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-blue-400">#{myRank + 1}</span>
              <div>
                <p className="font-bold">{user?.name}</p>
                <p className={`${textSecondary} text-xs`}>{leaderboard[myRank]?.score} points</p>
              </div>
            </div>
            <div className={`flex items-center gap-4 text-sm ${textSecondary}`}>
              <div className="flex items-center gap-1">
                <MdPlayCircle className="text-blue-400" />
                <span>{leaderboard[myRank]?.completedLectures}</span>
              </div>
              <div className="flex items-center gap-1">
                <MdWorkspacePremium className="text-blue-400" />
                <span>{leaderboard[myRank]?.certificates}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaFire className="text-blue-400" />
                <span>{leaderboard[myRank]?.currentStreak}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && leaderboard.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className={`${cardBg} p-5 rounded-2xl border ${borderColor} text-center mt-6`}>
            <FaMedal className={`${textSecondary} text-3xl mx-auto mb-2`} />
            <div className={`w-12 h-12 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-300'} flex items-center justify-center font-bold mx-auto mb-2`}>
              {leaderboard[1]?.name?.slice(0, 2).toUpperCase()}
            </div>
            <p className={`font-bold text-sm truncate ${textPrimary}`}>{leaderboard[1]?.name}</p>
            <p className={`${textSecondary} text-xs`}>{leaderboard[1]?.score} pts</p>
          </div>

          <div className={`${isDark ? 'bg-blue-900 bg-opacity-30 border-blue-500' : 'bg-blue-50 border-blue-300'} p-5 rounded-2xl border text-center`}>
            <FaTrophy className="text-blue-400 text-4xl mx-auto mb-2" />
            <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center font-bold text-lg mx-auto mb-2 text-white">
              {leaderboard[0]?.name?.slice(0, 2).toUpperCase()}
            </div>
            <p className="font-bold truncate">{leaderboard[0]?.name}</p>
            <p className="text-blue-400 text-sm font-bold">{leaderboard[0]?.score} pts</p>
          </div>

          <div className={`${cardBg} p-5 rounded-2xl border ${borderColor} text-center mt-6`}>
            <FaMedal className={`${textSecondary} text-3xl mx-auto mb-2`} />
            <div className={`w-12 h-12 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-300'} flex items-center justify-center font-bold mx-auto mb-2`}>
              {leaderboard[2]?.name?.slice(0, 2).toUpperCase()}
            </div>
            <p className={`font-bold text-sm truncate ${textPrimary}`}>{leaderboard[2]?.name}</p>
            <p className={`${textSecondary} text-xs`}>{leaderboard[2]?.score} pts</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`h-16 ${cardBg} rounded-xl animate-pulse`}></div>
          ))}
        </div>
      ) : leaderboard.length === 0 ? (
        <div className={`text-center py-20 ${textSecondary}`}>
          <FaTrophy className="text-6xl mx-auto mb-4 opacity-30" />
          <p className="text-xl">No learners yet</p>
          <p className="text-sm mt-2">Complete lectures to appear on leaderboard</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((learner, index) => (
            <div
              key={learner._id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition ${cardBg} ${borderColor} ${learner._id === user?._id ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="w-10 flex justify-center shrink-0">
                {getRankIcon(index)}
              </div>

              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm shrink-0 text-white">
                {learner.avatar ? (
                  <img src={`${API_BASE}${learner.avatar}`} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  learner.name?.slice(0, 2).toUpperCase()
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`font-semibold truncate ${textPrimary}`}>
                  {learner.name}
                  {learner._id === user?._id && <span className="text-blue-400 text-xs ml-2">(You)</span>}
                </p>
                <p className={`${textSecondary} text-xs truncate`}>{learner.email}</p>
              </div>

              <div className={`hidden md:flex items-center gap-4 text-sm ${textSecondary}`}>
                <div className="flex items-center gap-1">
                  <MdPlayCircle className="text-blue-400" />
                  <span>{learner.completedLectures}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MdWorkspacePremium className="text-blue-400" />
                  <span>{learner.certificates}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaFire className="text-blue-400" />
                  <span>{learner.currentStreak}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className={`font-bold ${textPrimary}`}>{learner.score}</p>
                <p className={`${textSecondary} text-xs`}>points</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Leaderboard;