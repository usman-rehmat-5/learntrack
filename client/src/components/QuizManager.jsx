import { useState, useEffect } from 'react';
import { MdAdd, MdDelete } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function QuizManager({ trackId }) {
  const { api } = useAuth();
  const { isDark } = useTheme();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDark ? 'bg-gray-700' : 'bg-gray-100';
  const sectionBg = isDark ? 'bg-gray-700' : 'bg-gray-100';
  const buttonSecondary = isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400';
  const optionBg = isDark ? 'bg-gray-700' : 'bg-gray-100';

  useEffect(() => {
    fetchQuiz();
  }, [trackId, api]);

  const fetchQuiz = async () => {
    try {
      const res = await api.get(`/quiz/${trackId}`);
      if (res.data) {
        setQuiz(res.data);
        setTitle(res.data.title);
        setQuestions(res.data.questions);
      } else {
        setQuiz(null);
        setTitle('');
        setQuestions([]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (index, value) => {
    const opts = [...newQuestion.options];
    opts[index] = value;
    setNewQuestion({ ...newQuestion, options: opts });
  };

  const handleAddQuestion = () => {
    if (!newQuestion.question || newQuestion.options.some(o => !o)) return;
    setQuestions([...questions, newQuestion]);
    setNewQuestion({ question: '', options: ['', '', '', ''], correctAnswer: 0 });
    setShowForm(false);
  };

  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSaveQuiz = async () => {
    if (!title || questions.length === 0) return;
    try {
      await api.post(`/quiz/admin/${trackId}`, { title, questions });
      fetchQuiz();
      alert('Quiz saved successfully!');
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteQuiz = async () => {
    if (!confirm('Delete this quiz?')) return;
    try {
      await api.delete(`/quiz/admin/${trackId}`);
      setQuiz(null);
      setTitle('');
      setQuestions([]);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <div className={textSecondary}>Loading...</div>;

  return (
    <div>
      {/* Quiz Title */}
      <div className={`${cardBg} p-6 rounded-2xl border ${borderColor} mb-6`}>
        <h3 className={`text-lg font-bold mb-4 ${textPrimary}`}>Quiz Title</h3>
        <input
          type="text"
          placeholder="e.g. MERN Stack Quiz"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-4 py-3 rounded-lg ${inputBg} ${textPrimary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>

      {/* Questions */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-bold ${textPrimary}`}>Questions ({questions.length})</h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold transition"
          >
            <MdAdd /> Add Question
          </button>
        </div>

        {/* Add Question Form */}
        {showForm && (
          <div className={`${cardBg} p-6 rounded-2xl border ${borderColor} mb-4`}>
            <h4 className={`font-bold mb-4 ${textPrimary}`}>New Question</h4>
            <input
              type="text"
              placeholder="Question"
              value={newQuestion.question}
              onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg ${inputBg} ${textPrimary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4`}
            />
            <div className="space-y-2 mb-4">
              {newQuestion.options.map((opt, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="correct"
                    checked={newQuestion.correctAnswer === index}
                    onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: index })}
                    className="accent-blue-500"
                  />
                  <input
                    type="text"
                    placeholder={`Option ${['A', 'B', 'C', 'D'][index]}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className={`flex-1 px-4 py-2 rounded-lg ${inputBg} ${textPrimary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
              ))}
            </div>
            <p className={`${textSecondary} text-sm mb-4`}>Select the radio button next to the correct answer</p>
            <div className="flex gap-3">
              <button onClick={handleAddQuestion} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition">Add</button>
              <button onClick={() => setShowForm(false)} className={`px-6 py-2 ${buttonSecondary} rounded-lg transition ${textPrimary}`}>Cancel</button>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-3">
          {questions.map((q, index) => (
            <div key={index} className={`${cardBg} p-5 rounded-xl border ${borderColor}`}>
              <div className="flex justify-between items-start mb-3">
                <p className={`font-semibold ${textPrimary}`}>{index + 1}. {q.question}</p>
                <button onClick={() => handleDeleteQuestion(index)} className="p-1 bg-red-900 hover:bg-red-800 rounded-lg transition">
                  <MdDelete className="text-red-400" />
                </button>
              </div>
              <div className="space-y-1">
                {q.options.map((opt, i) => (
                  <p key={i} className={`text-sm px-3 py-1.5 rounded-lg ${i === q.correctAnswer ? (isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-600') : `${optionBg} ${textSecondary}`}`}>
                    {['A', 'B', 'C', 'D'][i]}. {opt} {i === q.correctAnswer && '✓'}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save / Delete */}
      <div className="flex gap-4">
        <button
          onClick={handleSaveQuiz}
          disabled={!title || questions.length === 0}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold transition disabled:opacity-40"
        >
          Save Quiz
        </button>
        {quiz && (
          <button
            onClick={handleDeleteQuiz}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition"
          >
            Delete Quiz
          </button>
        )}
      </div>
    </div>
  );
}

export default QuizManager;