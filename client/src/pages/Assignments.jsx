import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { MdAssignment, MdUpload, MdCheckCircle, MdSchedule, MdStar } from 'react-icons/md';
import { FaFileUpload, FaDownload } from 'react-icons/fa';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Assignments() {
  const { trackId } = useParams();
  const { token, api } = useAuth();
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchAssignments(); }, [trackId]);

  const fetchAssignments = async () => {
    try {
      const res = await api.get(`/assignments/track/${trackId}`);
      setAssignments(res.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (assignmentId) => {
    try {
      const formData = new FormData();
      if (file) formData.append('file', file);
      if (text) formData.append('textContent', text);
      await api.post(`/assignments/${assignmentId}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMsg(t('assignmentSubmitted'));
      setSubmitting(null);
      setFile(null);
      setText('');
      fetchAssignments();
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
  const inputBg = isDark ? 'bg-gray-700' : 'bg-gray-100';

  return (
    <div className={`min-h-screen ${bgPrimary} ${textPrimary} transition-colors`}>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-1">{t('trackAssignments')}</h2>
        <p className={`${textSecondary} mb-8`}>{t('noAssignments')}</p>

        {msg && (
          <div className={`p-3 rounded-xl mb-4 text-sm font-semibold ${msg.includes('success') || msg.includes('کامیابی') ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>{msg}</div>
        )}

        {loading ? (
          <div className={`text-center py-16 ${textSecondary}`}>{t('loading')}</div>
        ) : assignments.length === 0 ? (
          <div className={`text-center py-16 ${cardBg} rounded-2xl border ${borderColor}`}>
            <MdAssignment className="text-5xl mx-auto mb-4 text-gray-500" />
            <p className={textSecondary}>{t('noAssignments')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map(a => {
              const overdue = a.dueDate && new Date(a.dueDate) < new Date();
              return (
                <div key={a._id} className={`${cardBg} p-6 rounded-2xl border ${a.submitted ? 'border-green-500' : overdue ? 'border-red-500' : borderColor}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <MdAssignment className="text-blue-500" />
                        <h3 className="font-bold text-lg">{a.title}</h3>
                        {a.submitted && <MdCheckCircle className="text-green-500" />}
                      </div>
                      <p className={`text-sm ${textSecondary}`}>{a.description}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs">
                        {a.totalPoints && <span className={`flex items-center gap-1 ${textSecondary}`}><MdStar className="text-yellow-500" /> {a.totalPoints} {t('totalPoints')}</span>}
                        {a.dueDate && <span className={`flex items-center gap-1 ${overdue ? 'text-red-400' : textSecondary}`}><MdSchedule /> {t('dueDate')}: {new Date(a.dueDate).toLocaleDateString()}</span>}
                      </div>
                    </div>
                    <div className="shrink-0">
                      {a.submitted ? (
                        <div className="text-right">
                          <span className="text-green-500 font-semibold text-sm">{t('alreadySubmitted')}</span>
                          {a.submission?.grade !== null && (
                            <p className="text-yellow-500 text-sm mt-1">{t('grade')}: {a.submission.grade}/{a.totalPoints}</p>
                          )}
                          {a.submission?.feedback && (
                            <p className={`text-xs ${textSecondary} mt-0.5 italic`}>"{a.submission.feedback}"</p>
                          )}
                        </div>
                      ) : (
                        <button onClick={() => setSubmitting(submitting === a._id ? null : a._id)}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${submitting === a._id ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                          {t('submitAssignment')}
                        </button>
                      )}
                    </div>
                  </div>

                  {submitting === a._id && (
                    <div className={`mt-4 p-4 rounded-xl ${inputBg} border ${borderColor}`}>
                      {a.fileRequired && (
                        <div className="mb-3">
                          <label className={`block text-sm font-semibold mb-1 ${textPrimary}`}>{t('uploadFile')}</label>
                          <input type="file" onChange={e => setFile(e.target.files[0])}
                            className={`w-full px-3 py-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-white'} text-sm`} />
                        </div>
                      )}
                      <div className="mb-3">
                        <label className={`block text-sm font-semibold mb-1 ${textPrimary}`}>{t('textContent')}</label>
                        <textarea value={text} onChange={e => setText(e.target.value)} rows={3}
                          className={`w-full px-3 py-2 rounded-lg ${inputBg} border ${borderColor} text-sm focus:outline-none`} placeholder="Write your answer..." />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleSubmit(a._id)} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-xl text-white text-sm font-semibold transition">
                          <FaFileUpload /> {t('submit')}
                        </button>
                        <button onClick={() => setSubmitting(null)} className={`px-4 py-2 rounded-xl text-sm transition ${textPrimary} ${isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'}`}>{t('cancel')}</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Assignments;
