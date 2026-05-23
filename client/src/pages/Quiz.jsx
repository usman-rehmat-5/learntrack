import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function Quiz() {
  const { fieldId, trackId } = useParams();
  const navigate = useNavigate();
  const { user, token, api } = useAuth();
  const { isDark } = useTheme();

  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDark ? 'bg-gray-700' : 'bg-gray-100';
  const sectionBg = isDark ? 'bg-gray-800' : 'bg-white';
  const buttonSecondary = isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400';
  const progressBg = isDark ? 'bg-gray-700' : 'bg-gray-200';
  const optionDefault = isDark ? 'bg-gray-700 border-gray-600 hover:border-blue-500 text-gray-200' : 'bg-gray-100 border-gray-300 hover:border-blue-500 text-gray-700';
  const dotInactive = isDark ? 'bg-gray-700' : 'bg-gray-300';
  const reviewOptionBg = isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600';

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchQuiz();
  }, [trackId]);

  const fetchQuiz = async () => {
    try {
      const res = await api.get(`/quiz/${trackId}`);
      setQuiz(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionIndex) => {
    setAnswers({ ...answers, [currentQ]: optionIndex });
  };

  const handleNext = () => {
    if (currentQ < quiz.questions.length - 1) setCurrentQ(currentQ + 1);
  };

  const handlePrev = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  const handleSubmit = async () => {
    try {
      const answersArray = quiz.questions.map((_, i) => answers[i] ?? -1);
      const res = await api.post('/quiz/submit', {
        quizId: quiz._id,
        answers: answersArray
      });
      setResult(res.data);
      setSubmitted(true);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return (
    <div className={`flex items-center justify-center py-20 ${textSecondary}`}>Loading...</div>
  );

  if (!quiz) return (
    <div className={`max-w-3xl mx-auto px-6 py-10 ${bgPrimary} ${textPrimary}`}>
      <button onClick={() => navigate(`/field/${fieldId}/track/${trackId}`)} className={`mb-6 ${textSecondary} hover:${textPrimary} flex items-center gap-2 transition`}>
        ← Back to Track
      </button>
      <div className={`text-center py-20 ${textSecondary}`}>
        <p className="text-5xl mb-4">📝</p>
        <p className="text-xl">No quiz available for this track yet.</p>
      </div>
    </div>
  );

  const percent = result ? Math.round((result.score / result.total) * 100) : 0;

  return (
    <div className={`max-w-3xl mx-auto px-6 py-10 ${bgPrimary} ${textPrimary} transition-colors duration-300`}>

      {/* Back */}
      <button onClick={() => navigate(`/field/${fieldId}/track/${trackId}`)} className={`mb-6 ${textSecondary} hover:${textPrimary} flex items-center gap-2 transition`}>
        ← Back to Track
      </button>

      {!submitted ? (
        <>
          {/* Quiz Header */}
          <div className="mb-8">
            <h2 className={`text-3xl font-bold mb-2 ${textPrimary}`}>{quiz.title}</h2>
            <p className={textSecondary}>Question {currentQ + 1} of {quiz.questions.length}</p>
            <div className={`w-full ${progressBg} rounded-full h-2 mt-3`}>
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${((currentQ + 1) / quiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className={`${sectionBg} p-8 rounded-2xl border ${borderColor} mb-6`}>
            <h3 className={`text-xl font-semibold mb-6 ${textPrimary}`}>
              {quiz.questions[currentQ].question}
            </h3>
            <div className="space-y-3">
              {quiz.questions[currentQ].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition font-medium ${
                    answers[currentQ] === index
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : optionDefault
                  }`}
                >
                  <span className="mr-3 font-bold">{['A', 'B', 'C', 'D'][index]}.</span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={currentQ === 0}
              className={`px-6 py-2 ${buttonSecondary} rounded-xl transition disabled:opacity-40 ${textPrimary}`}
            >
              ← Previous
            </button>

            {/* Question Dots */}
            <div className="flex gap-2">
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQ(index)}
                  className={`w-8 h-8 rounded-full text-sm font-semibold transition ${
                    answers[index] !== undefined
                      ? 'bg-blue-600'
                      : currentQ === index
                      ? `${dotInactive} border border-blue-500`
                      : dotInactive
                  } ${textPrimary}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQ === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < quiz.questions.length}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-xl transition disabled:opacity-40 font-semibold"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl transition"
              >
                Next →
              </button>
            )}
          </div>
        </>
      ) : (
        /* Result Screen */
        <div className="text-center">
          <div className={`w-40 h-40 rounded-full mx-auto flex items-center justify-center text-5xl font-bold mb-8 ${result.passed ? (isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-600') : (isDark ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-600')}`}>
            {percent}%
          </div>

          <h2 className={`text-3xl font-bold mb-2 ${textPrimary}`}>
            {result.passed ? 'Congratulations!' : 'Better Luck Next Time!'}
          </h2>
          <p className={`${textSecondary} mb-2`}>You scored {result.score} out of {result.total}</p>
          <p className={`text-lg font-semibold mb-8 ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
            {result.passed ? 'You Passed!' : 'You need 70% to pass'}
          </p>

          {/* Answers Review */}
          <div className="text-left space-y-4 mb-8">
            {quiz.questions.map((q, index) => (
              <div key={index} className={`${sectionBg} p-5 rounded-xl border ${borderColor}`}>
                <p className={`font-semibold mb-3 ${textPrimary}`}>{index + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((option, i) => (
                    <div
                      key={i}
                      className={`px-4 py-2 rounded-lg text-sm ${
                        i === q.correctAnswer
                          ? (isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-600')
                          : answers[index] === i
                          ? (isDark ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-600')
                          : reviewOptionBg
                      }`}
                    >
                      {['A', 'B', 'C', 'D'][i]}. {option}
                      {i === q.correctAnswer && ' ✓'}
                      {answers[index] === i && i !== q.correctAnswer && ' ✗'}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => { setSubmitted(false); setAnswers({}); setCurrentQ(0); setResult(null); }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition"
            >
              Retry Quiz
            </button>
            {result.passed && (
              <button
                onClick={() => navigate(`/field/${fieldId}/track/${trackId}/certificate`)}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold transition"
              >
                Get Certificate
              </button>
            )}
            <button
              onClick={() => navigate(`/field/${fieldId}/track/${trackId}`)}
              className={`px-6 py-3 ${buttonSecondary} rounded-xl font-semibold transition ${textPrimary}`}
            >
              Back to Track
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;