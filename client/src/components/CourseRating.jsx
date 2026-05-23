import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MdStar, MdStarBorder } from 'react-icons/md';
import { notify } from './Notifications';

function StarRating({ value, onChange, readonly = false }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`text-2xl transition ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
        >
          {star <= (hovered || value) ? (
            <MdStar className="text-yellow-400" />
          ) : (
            <MdStarBorder className="text-gray-500" />
          )}
        </button>
      ))}
    </div>
  );
}

function CourseRating({ courseId }) {
  const { api } = useAuth();
  const { isDark } = useTheme();
  const [ratingsData, setRatingsData] = useState({ ratings: [], avgRating: 0, totalRatings: 0 });
  const [myRating, setMyRating] = useState(null);
  const [form, setForm] = useState({ rating: 0, review: '' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
    fetchMyRating();
  }, [courseId, api]);

  const fetchRatings = async () => {
    try {
      const res = await api.get(`/ratings/${courseId}`);
      setRatingsData(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRating = async () => {
    try {
      const res = await api.get(`/ratings/${courseId}/my`);
      if (res.data) {
        setMyRating(res.data);
        setForm({ rating: res.data.rating, review: res.data.review });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    if (form.rating === 0) return;
    try {
      await api.post(`/ratings/${courseId}`, form);
      notify('Rating submitted!', 'success');
      setShowForm(false);
      fetchRatings();
      fetchMyRating();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/ratings/${courseId}`);
      setMyRating(null);
      setForm({ rating: 0, review: '' });
      notify('Rating removed!', 'success');
      fetchRatings();
    } catch (err) {
      console.log(err);
    }
  };

  const getTimeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: ratingsData.ratings.filter(r => r.rating === star).length
  }));

  return (
    <div className={`mt-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Course Ratings & Reviews</h3>

      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-2xl border mb-6`}>
        <div className="flex gap-8 items-center">
          <div className="text-center shrink-0">
            <p className="text-6xl font-bold text-yellow-400">{ratingsData.avgRating}</p>
            <StarRating value={Math.round(ratingsData.avgRating)} readonly />
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mt-1`}>{ratingsData.totalRatings} reviews</p>
          </div>

          <div className="flex-1">
            {ratingCounts.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-3 mb-1">
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm w-4`}>{star}</span>
                <MdStar className="text-yellow-400 shrink-0" />
                <div className={`flex-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all"
                    style={{
                      width: ratingsData.totalRatings > 0
                        ? `${(count / ratingsData.totalRatings) * 100}%`
                        : '0%'
                    }}
                  ></div>
                </div>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm w-4`}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        {myRating ? (
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border p-4 rounded-2xl`}>
            <div className="flex justify-between items-start">
              <div>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-semibold mb-2`}>Your Rating</p>
                <StarRating value={myRating.rating} readonly />
                {myRating.review && <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm mt-2`}>{myRating.review}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition text-white"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className={`px-3 py-1.5 rounded-lg text-sm transition ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition text-white"
          >
            Rate this Course
          </button>
        )}
      </div>

      {showForm && (
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-2xl border mb-6`}>
          <h4 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{myRating ? 'Update Rating' : 'Add Rating'}</h4>
          <div className="space-y-4">
            <div>
              <label className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2 block`}>Your Rating</label>
              <StarRating
                value={form.rating}
                onChange={(val) => setForm({ ...form, rating: val })}
              />
            </div>
            <div>
              <label className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2 block`}>Review (Optional)</label>
              <textarea
                value={form.review}
                onChange={(e) => setForm({ ...form, review: e.target.value })}
                placeholder="Share your experience with this course..."
                rows={3}
                className={`w-full px-4 py-3 rounded-xl ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={form.rating === 0}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition disabled:opacity-40 text-white"
              >
                Submit
              </button>
              <button
                onClick={() => setShowForm(false)}
                className={`px-6 py-2 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded-xl transition`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className={`h-20 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} rounded-xl animate-pulse`}></div>
          ))}
        </div>
      ) : ratingsData.ratings.length === 0 ? (
        <div className={`text-center py-10 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
          <p>No reviews yet. Be the first to rate!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ratingsData.ratings.map((r) => (
            <div key={r._id} className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold shrink-0 text-white">
                  {r.userId?.avatar ? (
                    <img src={`${API}${r.userId.avatar}`} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    r.userId?.name?.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{r.userId?.name}</p>
                  <p className={`${isDark ? 'text-gray-500' : 'text-gray-500'} text-xs`}>{getTimeAgo(r.createdAt)}</p>
                </div>
                <StarRating value={r.rating} readonly />
              </div>
              {r.review && <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>{r.review}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseRating;