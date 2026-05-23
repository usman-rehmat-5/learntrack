import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaGraduationCap, FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdEmail, MdLock, MdPerson, MdArrowForward } from 'react-icons/md';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark } = useTheme();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/api/auth/register`, { name, email, password });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className={`flex-1 flex items-center justify-center p-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: 'var(--accent-500)' }}>
              <FaGraduationCap className="text-2xl" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>LearnTrack</h1>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Learning Management System</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Create Account</h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Join us and start your learning journey</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Full Name</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <MdPerson className="text-xl" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className={`w-full pl-12 pr-4 py-4 rounded-xl ${
                    isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } placeholder-gray-500 focus:outline-none transition`}
                  required
                />
              </div>
            </div>

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
                  className={`w-full pl-12 pr-4 py-4 rounded-xl ${
                    isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } placeholder-gray-500 focus:outline-none transition`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <MdLock className="text-xl" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-14 py-4 rounded-xl ${
                    isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } placeholder-gray-500 focus:outline-none transition`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Confirm Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <MdLock className="text-xl" />
                </div>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-14 py-4 rounded-xl ${
                    isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } placeholder-gray-500 focus:outline-none transition`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-semibold text-white transition disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ backgroundColor: 'var(--accent-500)' }}
              onMouseEnter={e => { if (!loading) e.target.style.backgroundColor = 'var(--accent-600)'; }}
              onMouseLeave={e => { if (!loading) e.target.style.backgroundColor = 'var(--accent-500)'; }}
            >
              {loading ? (
                <span>Creating account...</span>
              ) : (
                <><span>Create Account</span><MdArrowForward className="text-lg" /></>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 rounded-xl text-sm"
            style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}>
            <p>After registering, check your email to verify your account.</p>
          </div>

          <div className="mt-8 text-center">
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--accent-400)' }} className="font-semibold hover:brightness-110 transition">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className={`${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} text-sm transition`}>
              ← Back to home
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center p-12"
        style={{ backgroundColor: 'var(--accent-600)' }}>
        <div className="text-center text-white max-w-lg">
          <div className="w-24 h-24 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-8">
            <FaGraduationCap className="text-5xl" />
          </div>
          <h3 className="text-3xl font-bold mb-4">Join Thousands of Learners</h3>
          <p className="text-white/80 text-lg">
            Get access to expert-led courses, track your progress, and earn certificates to showcase your skills.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">10+</p>
              <p className="text-white/70 text-sm">Fields</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">50+</p>
              <p className="text-white/70 text-sm">Tracks</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">100+</p>
              <p className="text-white/70 text-sm">Courses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
