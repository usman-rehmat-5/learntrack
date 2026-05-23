import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { FaGraduationCap, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { isDark } = useTheme();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/verify-email`, { token });
      setStatus('success');
      setMessage(res.data.message);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Verification failed. The link may be expired.');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-8 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="w-full max-w-md text-center">
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <FaGraduationCap className="text-2xl text-white" />
          </div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>LearnTrack</h1>
        </div>

        {status === 'verifying' && (
          <div>
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6" />
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Verifying your email...</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <FaCheckCircle className="text-6xl text-green-400 mx-auto mb-6" />
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Email Verified!</h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>{message}</p>
            <Link to="/login" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-white transition inline-block">
              Go to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div>
            <FaTimesCircle className="text-6xl text-red-400 mx-auto mb-6" />
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Verification Failed</h2>
            <p className="text-red-400 mb-6">{message}</p>
            <Link to="/login" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-white transition inline-block">
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
