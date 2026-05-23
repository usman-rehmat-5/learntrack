import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { MdRateReview, MdVisibility, MdStar, MdPerson } from 'react-icons/md';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function PeerReview() {
  const { token, api } = useAuth();
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const [pending, setPending] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [tab, setTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [reviewForm, setReviewForm] = useState(null);
  const [ratings, setRatings] = useState({ clarity: 3, completeness: 3, creativity: 3, comments: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [pendingRes, reviewsRes] = await Promise.all([
        api.get('/peer-reviews/pending'),
        api.get('/peer-reviews/my-reviews')
      ]);
      setPending(pendingRes.data);
      setMyReviews(reviewsRes.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const handleSubmitReview = async (submissionId) => {
    try {
      await api.post('/peer-reviews', { submissionId, ...ratings });
      setMsg(t('reviewSubmitted'));
      setReviewForm(null);
      setRatings({ clarity: 3, completeness: 3, creativity: 3, comments: '' });
      fetchData();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed');
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  const StarRating = ({ value, onChange }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} onClick={() => onChange(n)} className={`text-xl transition ${n <= value ? 'text-yellow-500' : 'text-gray-500'}`}>★</button>
      ))}
    </div>
  );

  return (
    <div className={`min-h-screen ${bgPrimary} ${textPrimary} transition-colors`}>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-1">{t('peerReview')}</h2>
        <p className={`${textSecondary} mb-6`}>{t('pendingReviews')}</p>

        {msg && (
          <div className={`p-3 rounded-xl mb-4 text-sm font-semibold ${msg.includes('success') || msg.includes('کامیابی') ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>{msg}</div>
        )}

        <div className={`flex gap-2 p-1.5 ${cardBg} rounded-2xl border ${borderColor} inline-flex mb-6`}>
          <button onClick={() => setTab('pending')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${tab === 'pending' ? 'bg-blue-600 text-white' : textSecondary}`}>
            {t('pendingReviews')} ({pending.length})
          </button>
          <button onClick={() => setTab('my')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${tab === 'my' ? 'bg-blue-600 text-white' : textSecondary}`}>
            {t('myReviews')} ({myReviews.length})
          </button>
        </div>

        {loading ? (
          <div className={`text-center py-16 ${textSecondary}`}>{t('loading')}</div>
        ) : tab === 'pending' ? (
          pending.length === 0 ? (
            <div className={`text-center py-16 ${cardBg} rounded-2xl border ${borderColor}`}>
              <MdRateReview className="text-5xl mx-auto mb-4 text-gray-500" />
              <p className={textSecondary}>{t('noPendingReviews')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pending.map(sub => (
                <div key={sub._id} className={`${cardBg} p-5 rounded-2xl border ${borderColor}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {sub.userId?.name?.slice(0, 2).toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-semibold">{sub.userId?.name || 'Unknown'}</p>
                      <p className={`text-xs ${textSecondary}`}>{sub.assignmentId?.title || 'Assignment'}</p>
                    </div>
                  </div>
                  {sub.textContent && (
                    <p className={`text-sm ${textSecondary} mb-3 p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>{sub.textContent}</p>
                  )}
                  {sub.filePath && (
                    <a href={`${API}${sub.filePath}`} target="_blank" rel="noreferrer" className="text-blue-500 text-sm hover:underline flex items-center gap-1 mb-3">
                      <MdVisibility /> View submission file
                    </a>
                  )}

                  {reviewForm === sub._id ? (
                    <div className={`p-4 rounded-xl border ${borderColor} ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      {['clarity', 'completeness', 'creativity'].map(criterion => (
                        <div key={criterion} className="flex items-center justify-between mb-2">
                          <span className="text-sm capitalize">{t(criterion)}</span>
                          <StarRating value={ratings[criterion]} onChange={v => setRatings({ ...ratings, [criterion]: v })} />
                        </div>
                      ))}
                      <textarea value={ratings.comments} onChange={e => setRatings({ ...ratings, comments: e.target.value })}
                        placeholder={t('comments')} rows={2} className={`w-full px-3 py-2 rounded-lg text-sm mt-2 ${isDark ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'} border ${borderColor} focus:outline-none`} />
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => handleSubmitReview(sub._id)} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-xl text-white text-sm font-semibold transition">{t('submitReview')}</button>
                        <button onClick={() => setReviewForm(null)} className={`px-4 py-2 rounded-xl text-sm transition ${isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'} ${textPrimary}`}>{t('cancel')}</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setReviewForm(sub._id)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white text-sm font-semibold transition">{t('submitReview')}</button>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          myReviews.length === 0 ? (
            <div className={`text-center py-16 ${cardBg} rounded-2xl border ${borderColor}`}>
              <MdRateReview className="text-5xl mx-auto mb-4 text-gray-500" />
              <p className={textSecondary}>{t('myReviews')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myReviews.map(r => (
                <div key={r._id} className={`${cardBg} p-4 rounded-2xl border ${borderColor}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <MdPerson className="text-blue-500" />
                    <span className="font-semibold text-sm">{r.submissionId?.userId?.name || 'Student'}</span>
                    <span className={`text-xs ${textSecondary}`}>— {r.submissionId?.assignmentId?.title || 'Assignment'}</span>
                  </div>
                  <div className="flex gap-3 text-xs mt-2">
                    <span>{t('clarity')}: {'★'.repeat(r.clarity)}{'☆'.repeat(5 - r.clarity)}</span>
                    <span>{t('completeness')}: {'★'.repeat(r.completeness)}{'☆'.repeat(5 - r.completeness)}</span>
                    <span>{t('creativity')}: {'★'.repeat(r.creativity)}{'☆'.repeat(5 - r.creativity)}</span>
                  </div>
                  {r.comments && <p className={`text-xs ${textSecondary} mt-1`}>"{r.comments}"</p>}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default PeerReview;
