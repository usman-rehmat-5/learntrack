import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { FaGraduationCap } from 'react-icons/fa';
import { MdEmail, MdArrowForward } from 'react-icons/md';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isDark } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/api/auth/forgot-password`, { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-8 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <FaGraduationCap className="text-2xl text-white" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>LearnTrack</h1>
            <p className="text-gray-500 text-sm">Learning Management System</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Reset Password</h2>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Enter your email and we'll send you a reset link</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
        )}

        {sent ? (
          <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
            <p className="text-green-400 font-semibold mb-2">Check Your Email</p>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
              If an account exists for {email}, we've sent a password reset link.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <MdEmail className="text-xl" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full pl-12 pr-4 py-4 rounded-xl ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition`}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? 'Sending...' : (
                <><span>Send Reset Link</span><MdArrowForward className="text-lg" /></>
              )}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Remember your password?{' '}
            <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300 transition">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
