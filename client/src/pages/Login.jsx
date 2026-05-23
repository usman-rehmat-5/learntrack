import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaGraduationCap, FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdEmail, MdLock, MdArrowForward } from 'react-icons/md';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark } = useTheme();

  const [require2FA, setRequire2FA] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/api/auth/login`, { email, password });

      if (res.data.require2fa) {
        setTempToken(res.data.tempToken);
        setRequire2FA(true);
        setLoading(false);
        return;
      }

      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handle2FAVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/api/auth/verify-2fa-login`, { tempToken, twoFactorCode });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid 2FA code');
    } finally {
      setLoading(false);
    }
  };

  if (require2FA) {
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
              <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Two-Factor Authentication</h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Enter the code from your authenticator app</p>
            </div>
            {error && (
              <div className="p-4 rounded-xl mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
            )}
            <form onSubmit={handle2FAVerify} className="space-y-5">
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Authentication Code</label>
                <input
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="000000"
                  className={`w-full px-4 py-4 rounded-xl text-center text-2xl tracking-[0.5em] ${
                    isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } placeholder-gray-500 focus:outline-none transition`}
                  style={{ borderColor: isDark ? 'var(--accent-800)' : undefined }}
                  maxLength={6}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-semibold text-white transition disabled:opacity-50"
                style={{ backgroundColor: 'var(--accent-500)' }}
                onMouseEnter={e => { if (!loading) e.target.style.backgroundColor = 'var(--accent-600)'; }}
                onMouseLeave={e => { if (!loading) e.target.style.backgroundColor = 'var(--accent-500)'; }}
              >
                {loading ? 'Verifying...' : (
                  <span className="flex items-center justify-center gap-2"><span>Verify</span><MdArrowForward className="text-lg" /></span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

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
            <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Welcome Back</h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Enter your credentials to access your account</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
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
              <div className="text-right mt-2">
                <Link to="/forgot-password" style={{ color: 'var(--accent-400)' }} className="text-sm hover:brightness-110 transition">
                  Forgot password?
                </Link>
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
                <span>Signing in...</span>
              ) : (
                <><span>Sign In</span><MdArrowForward className="text-lg" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--accent-400)' }} className="font-semibold hover:brightness-110 transition">Create one now</Link>
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
          <h3 className="text-3xl font-bold mb-4">Start Your Learning Journey</h3>
          <p className="text-white/80 text-lg">
            Track your courses, monitor your progress, and earn certificates as you master new skills.
          </p>
          <div className="mt-10 flex justify-center gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold">50+</p>
              <p className="text-white/70 text-sm">Courses</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">1000+</p>
              <p className="text-white/70 text-sm">Students</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">50+</p>
              <p className="text-white/70 text-sm">Instructors</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
