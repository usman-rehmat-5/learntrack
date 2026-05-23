import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { subscribeToPush, unsubscribeFromPush, requestNotificationPermission } from '../utils/pushNotifications';
import FieldIcon from '../components/FieldIcon';
import {
  MdPerson, MdEdit, MdLock, MdDashboard, MdSchool,
  MdTrendingUp, MdBook, MdVerified, MdTimeline,
  MdUpload, MdSave, MdClose, MdSecurity,
  MdDevices, MdEmail, MdNotifications
} from 'react-icons/md';
import {
  FaUserShield, FaUserCog, FaUser, FaUsers,
  FaChalkboardTeacher, FaCertificate, FaGoogle
} from 'react-icons/fa';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Profile() {
  const navigate = useNavigate();
  const { user, token, login, updateUser, api } = useAuth();
  const { isDark, toggleTheme, accent, setAccent, fontSize, setFontSize } = useTheme();
  const { t } = useLanguage();
  const fileInputRef = useRef(null);

  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDark ? 'bg-gray-700' : 'bg-gray-50';

  const [activeTab, setActiveTab] = useState('overview');
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [stats, setStats] = useState({});
  const [activityLogs, setActivityLogs] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Security state
  const [twoFactorSecret, setTwoFactorSecret] = useState('');
  const [twoFactorQR, setTwoFactorQR] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [securityMessage, setSecurityMessage] = useState('');
  const [securityError, setSecurityError] = useState('');

  useEffect(() => {
    if (token) {
      fetchStats();
      fetchActivity();
    }
  }, [token]);

  const fetchStats = async () => {
    try {
      if (user?.role === 'superadmin') {
        const res = await api.get('/superadmin/stats');
        setStats(res.data);
      } else if (user?.role === 'admin') {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } else {
        const res = await api.get('/courses/all');
        const courses = res.data || [];
        const completed = courses.filter(c => c.status === 'completed').length;
        setStats({
          totalCourses: courses.length,
          completedCourses: completed,
          inProgressCourses: courses.filter(c => c.status === 'in-progress').length
        });
      }
    } catch (err) { console.log(err); }
  };

  const fetchActivity = async () => {
    try {
      if (user?.role === 'superadmin') {
        const res = await api.get('/superadmin/activity', { params: { limit: 10 } });
        setActivityLogs(res.data.logs || []);
      }
    } catch (err) { console.log(err); }
  };

  const handleUpdateProfile = async () => {
    if (!form.name || !form.email) return;
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await api.put('/auth/profile', form);
      login(res.data.user, token);
      setMessage('Profile updated');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Passwords do not match'); return;
    }
    if (passwordForm.newPassword.length < 6) {
      setError('Password must be at least 6 characters'); return;
    }
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await api.put('/auth/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setMessage('Password changed');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const res = await api.post('/auth/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      login(res.data.user, token);
      setMessage('Avatar updated');
    } catch (err) {
      setError('Avatar upload failed');
    } finally {
      setAvatarUploading(false);
    }
  };

  const getRoleIcon = () => {
    if (user?.role === 'superadmin') return <FaUserShield />;
    if (user?.role === 'admin') return <FaUserCog />;
    return <FaUser />;
  };

  const getRoleLabel = () => {
    if (user?.role === 'superadmin') return 'Super Admin';
    if (user?.role === 'admin') return 'Admin';
    return 'Learner';
  };

  const isLearner = () => user?.role === 'user' || !user?.role;

  const tabs = [
    { key: 'overview', label: 'Overview', icon: <MdDashboard /> },
    { key: 'profile', label: 'Profile', icon: <MdPerson /> },
    { key: 'password', label: 'Password', icon: <MdLock /> },
    { key: 'security', label: 'Security', icon: <MdSecurity /> },
    { key: 'appearance', label: t('appearance'), icon: <MdDashboard /> },
    ...(user?.role === 'superadmin' ? [{ key: 'activity', label: 'Activity', icon: <MdTimeline /> }] : [])
  ];

  return (
    <div className={`min-h-screen ${bgPrimary} ${textPrimary} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className={`bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 mb-8 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/30">
                  {user?.avatar ? (
                    <img src={`${API}${user.avatar}`} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl text-white">{getRoleIcon()}</span>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 hover:bg-blue-400 rounded-full flex items-center justify-center text-white text-sm transition-all shadow-lg border-2 border-white dark:border-gray-800 opacity-0 group-hover:opacity-100"
                >
                  <MdEdit />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                {avatarUploading && (
                  <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">Uploading...</span>
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-3xl font-bold text-white">{user?.name}</h2>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-white text-xs flex items-center gap-1 font-medium">
                    {getRoleIcon()} {getRoleLabel()}
                  </span>
                </div>
                <p className="text-white/80 mt-1">{user?.email}</p>
                <p className="text-white/50 text-xs mt-1">Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
              </div>
            </div>
            {(user?.role === 'admin' || user?.role === 'superadmin') && (
              <button
                onClick={() => navigate(user?.role === 'superadmin' ? '/superadmin' : '/admin')}
                className="bg-white/20 hover:bg-white/30 px-5 py-2.5 rounded-xl font-semibold transition flex items-center gap-2 text-white text-sm"
              >
                <MdSchool /> Panel
              </button>
            )}
          </div>
        </div>

        {message && <p className="text-green-400 bg-green-900/50 px-4 py-3 rounded-xl mb-6 flex items-center gap-2"><MdVerified className="text-green-400" /> {message}</p>}
        {error && <p className="text-red-400 bg-red-900/50 px-4 py-3 rounded-xl mb-6">{error}</p>}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {user?.role === 'superadmin' ? (
            <>
              <StatCard icon={<FaUsers className="text-blue-500" />} value={stats.totalUsers || 0} label="Total Users" cardBg={cardBg} borderColor={borderColor} />
              <StatCard icon={<FaUserCog className="text-blue-500" />} value={stats.totalAdmins || 0} label="Admins" cardBg={cardBg} borderColor={borderColor} />
              <StatCard icon={<MdSchool className="text-blue-500" />} value={stats.totalFields || 0} label="Fields" cardBg={cardBg} borderColor={borderColor} />
              <StatCard icon={<FaChalkboardTeacher className="text-blue-500" />} value={stats.totalTracks || 0} label="Tracks" cardBg={cardBg} borderColor={borderColor} />
            </>
          ) : user?.role === 'admin' ? (
            <>
              <StatCard icon={<MdSchool className="text-blue-500" />} value={stats.totalFields || 0} label="Fields" cardBg={cardBg} borderColor={borderColor} />
              <StatCard icon={<MdBook className="text-blue-500" />} value={stats.totalCourses || 0} label="Courses" cardBg={cardBg} borderColor={borderColor} />
              <StatCard icon={<MdVerified className="text-blue-500" />} value={stats.totalQuizzes || 0} label="Quizzes" cardBg={cardBg} borderColor={borderColor} />
              <StatCard icon={<MdTrendingUp className="text-blue-500" />} value={stats.totalTracks || 0} label="Tracks" cardBg={cardBg} borderColor={borderColor} />
            </>
          ) : (
            <>
              <StatCard icon={<MdBook className="text-blue-500" />} value={stats.totalCourses || 0} label="Total Courses" cardBg={cardBg} borderColor={borderColor} />
              <StatCard icon={<MdTrendingUp className="text-blue-500" />} value={stats.inProgressCourses || 0} label="In Progress" cardBg={cardBg} borderColor={borderColor} />
              <StatCard icon={<MdVerified className="text-blue-500" />} value={stats.completedCourses || 0} label="Completed" cardBg={cardBg} borderColor={borderColor} />
              <StatCard icon={<FaCertificate className="text-blue-500" />} value={stats.totalCourses || 0} label="Certificates" cardBg={cardBg} borderColor={borderColor} />
            </>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(tab => (
            <button key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition text-sm ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-md'
                  : `${cardBg} border ${borderColor} hover:bg-gray-100 dark:hover:bg-gray-700`
              }`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <OverviewContent role={user?.role} cardBg={cardBg} borderColor={borderColor} textPrimary={textPrimary} textSecondary={textSecondary} isDark={isDark} navigate={navigate} stats={stats} />}
        {activeTab === 'profile' && (
          <ProfileForm form={form} setForm={setForm} handleSubmit={handleUpdateProfile} loading={loading}
            cardBg={cardBg} borderColor={borderColor} inputBg={inputBg} textPrimary={textPrimary} textSecondary={textSecondary} />
        )}
        {activeTab === 'password' && (
          <PasswordForm passwordForm={passwordForm} setPasswordForm={setPasswordForm} handleSubmit={handleChangePassword} loading={loading}
            cardBg={cardBg} borderColor={borderColor} inputBg={inputBg} textPrimary={textPrimary} textSecondary={textSecondary} />
        )}
        {activeTab === 'security' && (
          <SecurityForm
            user={user} token={token} api={api} updateUser={updateUser}
            cardBg={cardBg} borderColor={borderColor} inputBg={inputBg}
            textPrimary={textPrimary} textSecondary={textSecondary} isDark={isDark}
            twoFactorSecret={twoFactorSecret} setTwoFactorSecret={setTwoFactorSecret}
            twoFactorQR={twoFactorQR} setTwoFactorQR={setTwoFactorQR}
            twoFactorCode={twoFactorCode} setTwoFactorCode={setTwoFactorCode}
            show2FASetup={show2FASetup} setShow2FASetup={setShow2FASetup}
            securityMessage={securityMessage} setSecurityMessage={setSecurityMessage}
            securityError={securityError} setSecurityError={setSecurityError}
          />
        )}
        {activeTab === 'appearance' && (
          <AppearanceForm
            isDark={isDark} toggleTheme={toggleTheme}
            accent={accent} setAccent={setAccent}
            fontSize={fontSize} setFontSize={setFontSize}
            t={t} cardBg={cardBg} borderColor={borderColor}
            textPrimary={textPrimary} textSecondary={textSecondary}
          />
        )}
        {activeTab === 'activity' && user?.role === 'superadmin' && (
          <ActivityFeed logs={activityLogs} cardBg={cardBg} borderColor={borderColor} textPrimary={textPrimary} textSecondary={textSecondary} isDark={isDark} />
        )}

      </div>
    </div>
  );
}

function StatCard({ icon, value, label, cardBg, borderColor }) {
  return (
    <div className={`${cardBg} p-5 rounded-2xl border ${borderColor}`}>
      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-lg mb-2">
        {icon}
      </div>
      <p className="text-2xl font-bold text-blue-600">{value}</p>
      <p className={`text-xs text-gray-500 dark:text-gray-400`}>{label}</p>
    </div>
  );
}

function OverviewContent({ role, cardBg, borderColor, textPrimary, textSecondary, isDark, navigate, stats }) {
  const isLearner = role === 'user' || !role;

  if (role === 'superadmin') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${cardBg} p-6 rounded-2xl border ${borderColor}`}>
          <h4 className="font-bold mb-4 flex items-center gap-2 text-blue-400"><FaUserShield /> System Overview</h4>
          <div className="space-y-3">
            {[
              { label: 'Total Users', value: stats.totalUsers || 0 },
              { label: 'Super Admins', value: stats.totalSuperadmins || 0 },
              { label: 'Admins', value: stats.totalAdmins || 0 },
              { label: 'Fields', value: stats.totalFields || 0 },
              { label: 'Tracks', value: stats.totalTracks || 0 },
              { label: 'Courses', value: stats.totalCourses || 0 },
              { label: 'Quizzes', value: stats.totalQuizzes || 0 },
              { label: 'Certificates', value: stats.totalCertificates || 0 }
            ].map((item, i) => (
              <div key={i} className={`flex justify-between p-2.5 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl text-sm`}>
                <span className={textSecondary}>{item.label}</span>
                <span className="font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={`${cardBg} p-6 rounded-2xl border ${borderColor}`}>
          <h4 className="font-bold mb-4 flex items-center gap-2 text-blue-400"><FaCertificate /> Quick Actions</h4>
          <div className="space-y-3">
            <button onClick={() => navigate('/superadmin')} className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-left font-semibold transition text-white text-sm">Manage Users</button>
            <button onClick={() => navigate('/admin')} className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-left font-semibold transition text-white text-sm">Manage Fields & Tracks</button>
            <button onClick={() => navigate('/dashboard')} className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-left font-semibold transition text-white text-sm">View Dashboard</button>
            <button onClick={() => navigate('/admin')} className="w-full p-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-left font-semibold transition text-white text-sm">Manage Courses</button>
          </div>
        </div>
      </div>
    );
  }

  if (role === 'admin') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${cardBg} p-6 rounded-2xl border ${borderColor}`}>
          <h4 className="font-bold mb-4 flex items-center gap-2 text-blue-400"><MdSchool /> Content Stats</h4>
          <div className="space-y-3">
            {[
              { label: 'Fields', value: stats.totalFields || 0 },
              { label: 'Tracks', value: stats.totalTracks || 0 },
              { label: 'Courses', value: stats.totalCourses || 0 },
              { label: 'Quizzes', value: stats.totalQuizzes || 0 }
            ].map((item, i) => (
              <div key={i} className={`flex justify-between p-2.5 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl text-sm`}>
                <span className={textSecondary}>{item.label}</span>
                <span className="font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={`${cardBg} p-6 rounded-2xl border ${borderColor}`}>
          <h4 className="font-bold mb-4 flex items-center gap-2 text-blue-400"><FaUserCog /> Admin Actions</h4>
          <div className="space-y-3">
            <button onClick={() => navigate('/admin')} className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-left font-semibold transition text-white text-sm">Manage Fields & Tracks</button>
            <button onClick={() => navigate('/admin')} className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-left font-semibold transition text-white text-sm">Manage Courses</button>
            <button onClick={() => navigate('/admin')} className="w-full p-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-left font-semibold transition text-white text-sm">Create Quizzes</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className={`${cardBg} p-6 rounded-2xl border ${borderColor}`}>
        <h4 className="font-bold mb-4 flex items-center gap-2 text-blue-400"><MdTrendingUp /> Learning Progress</h4>
        <div className="space-y-3">
          {[
            { label: 'Total Courses', value: stats.totalCourses || 0 },
            { label: 'In Progress', value: stats.inProgressCourses || 0 },
            { label: 'Completed', value: stats.completedCourses || 0 }
          ].map((item, i) => (
            <div key={i} className={`flex justify-between p-2.5 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl text-sm`}>
              <span className={textSecondary}>{item.label}</span>
              <span className="font-bold">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={`${cardBg} p-6 rounded-2xl border ${borderColor}`}>
        <h4 className="font-bold mb-4 flex items-center gap-2 text-blue-400"><FaCertificate /> Quick Actions</h4>
        <div className="space-y-3">
          <button onClick={() => navigate('/dashboard')} className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-left font-semibold transition text-white text-sm">Browse Courses</button>
          <button onClick={() => navigate('/mycertificates')} className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-left font-semibold transition text-white text-sm">View Certificates</button>
          <button onClick={() => navigate('/leaderboard')} className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-left font-semibold transition text-white text-sm">Leaderboard</button>
        </div>
      </div>
    </div>
  );
}

function ProfileForm({ form, setForm, handleSubmit, loading, cardBg, borderColor, inputBg, textPrimary, textSecondary }) {
  return (
    <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} max-w-2xl`}>
      <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-blue-400"><MdEdit /> Edit Profile</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`${textSecondary} text-sm mb-1.5 block font-medium`}>Full Name</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl ${inputBg} ${textPrimary} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500 transition`} />
        </div>
        <div>
          <label className={`${textSecondary} text-sm mb-1.5 block font-medium`}>Email Address</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl ${inputBg} ${textPrimary} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500 transition`} />
        </div>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <button onClick={handleSubmit} disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition disabled:opacity-40 text-white flex items-center gap-2">
          <MdSave /> {loading ? 'Saving...' : 'Save Changes'}
        </button>
        <button onClick={() => setForm({ name: '', email: '' })}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-xl font-semibold transition text-white flex items-center gap-2">
          <MdClose /> Reset
        </button>
      </div>
    </div>
  );
}

function PasswordForm({ passwordForm, setPasswordForm, handleSubmit, loading, cardBg, borderColor, inputBg, textPrimary, textSecondary }) {
  return (
    <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} max-w-2xl`}>
      <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-blue-400"><MdLock /> Change Password</h4>
      <div className="space-y-5">
        <div>
          <label className={`${textSecondary} text-sm mb-1.5 block font-medium`}>Current Password</label>
          <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl ${inputBg} ${textPrimary} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500 transition`} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`${textSecondary} text-sm mb-1.5 block font-medium`}>New Password</label>
            <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl ${inputBg} ${textPrimary} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500 transition`} />
          </div>
          <div>
            <label className={`${textSecondary} text-sm mb-1.5 block font-medium`}>Confirm New Password</label>
            <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl ${inputBg} ${textPrimary} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500 transition`} />
          </div>
        </div>
        <button onClick={handleSubmit} disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition disabled:opacity-40 text-white flex items-center gap-2">
          <MdLock /> {loading ? 'Changing...' : 'Update Password'}
        </button>
      </div>
    </div>
  );
}

function SecurityForm({
  user, token, api, updateUser,
  cardBg, borderColor, inputBg, textPrimary, textSecondary, isDark,
  twoFactorSecret, setTwoFactorSecret, twoFactorQR, setTwoFactorQR,
  twoFactorCode, setTwoFactorCode, show2FASetup, setShow2FASetup,
  securityMessage, setSecurityMessage, securityError, setSecurityError
}) {
  const [loading2FA, setLoading2FA] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setPushEnabled(true);
    }
  }, []);

  const handleSetup2FA = async () => {
    try {
      const res = await api.get('/auth/setup-2fa');
      setTwoFactorSecret(res.data.secret);
      setTwoFactorQR(res.data.qrCode);
      setShow2FASetup(true);
    } catch (err) {
      setSecurityError('Failed to setup 2FA');
    }
  };

  const handleEnable2FA = async () => {
    setLoading2FA(true);
    setSecurityError('');
    try {
      const res = await api.post('/auth/enable-2fa', { secret: twoFactorSecret, twoFactorCode });
      updateUser(res.data.user);
      setSecurityMessage('2FA enabled successfully');
      setShow2FASetup(false);
      setTwoFactorCode('');
    } catch (err) {
      setSecurityError(err.response?.data?.message || 'Failed to enable 2FA');
    } finally {
      setLoading2FA(false);
    }
  };

  const handleDisable2FA = async () => {
    const password = prompt('Enter your password to disable 2FA:');
    if (!password) return;
    const code = prompt('Enter your current 2FA code:');
    if (!code) return;
    setLoading2FA(true);
    setSecurityError('');
    try {
      const res = await api.post('/auth/disable-2fa', { password, twoFactorCode: code });
      updateUser(res.data.user);
      setSecurityMessage('2FA disabled successfully');
    } catch (err) {
      setSecurityError(err.response?.data?.message || 'Failed to disable 2FA');
    } finally {
      setLoading2FA(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await api.post('/auth/resend-verification');
      setSecurityMessage('Verification email sent');
    } catch (err) {
      setSecurityError('Failed to send verification email');
    }
  };

  const handleLogoutAll = async () => {
    if (!confirm('This will log you out of all devices. Continue?')) return;
    try {
      await api.post('/auth/logout-all');
      setSecurityMessage('Logged out of all devices. Please login again.');
      setTimeout(() => {
        localStorage.clear();
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setSecurityError('Failed to logout all devices');
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {securityMessage && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
          <MdVerified /> {securityMessage}
        </div>
      )}
      {securityError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{securityError}</div>
      )}

      {/* Email Verification */}
      <div className={`${cardBg} p-6 rounded-2xl border ${borderColor}`}>
        <h4 className="font-bold mb-4 flex items-center gap-2 text-blue-400"><MdEmail /> Email Verification</h4>
        <div className="flex items-center justify-between">
          <div>
            <p className={`${textSecondary} text-sm`}>
              Status: {user?.emailVerified ? (
                <span className="text-green-400 font-semibold">Verified</span>
              ) : (
                <span className="text-yellow-400 font-semibold">Not Verified</span>
              )}
            </p>
          </div>
          {!user?.emailVerified && (
            <button onClick={handleResendVerification} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white text-sm font-semibold transition">
              Resend Email
            </button>
          )}
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className={`${cardBg} p-6 rounded-2xl border ${borderColor}`}>
        <h4 className="font-bold mb-4 flex items-center gap-2 text-blue-400"><FaGoogle /> Two-Factor Authentication</h4>
        <p className={`${textSecondary} text-sm mb-4`}>
          {user?.twoFactorEnabled
            ? '2FA is currently enabled. Your account is protected with an additional authentication layer.'
            : 'Add an extra layer of security to your account by enabling 2FA.'}
        </p>

        {show2FASetup && (
          <div className="mb-4 p-4 rounded-xl bg-gray-700/50">
            {twoFactorQR && (
              <div className="text-center mb-4">
                <img src={twoFactorQR} alt="2FA QR Code" className="mx-auto rounded-xl bg-white p-2" />
                <p className={`text-xs ${textSecondary} mt-2`}>Scan this QR code with your authenticator app</p>
              </div>
            )}
            <p className={`text-xs ${textSecondary} mb-3 break-all`}>
              Or enter manually: <span className="font-mono text-blue-400">{twoFactorSecret}</span>
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                className={`w-32 px-3 py-2 rounded-xl ${inputBg} ${textPrimary} border ${borderColor} text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <button onClick={handleEnable2FA} disabled={loading2FA || twoFactorCode.length < 6}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-xl text-white text-sm font-semibold transition disabled:opacity-40">
                {loading2FA ? 'Verifying...' : 'Verify & Enable'}
              </button>
              <button onClick={() => setShow2FASetup(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-xl text-white text-sm transition">
                Cancel
              </button>
            </div>
          </div>
        )}

        <button
          onClick={user?.twoFactorEnabled ? handleDisable2FA : handleSetup2FA}
          disabled={loading2FA}
          className={`px-5 py-2.5 rounded-xl font-semibold transition text-sm ${
            user?.twoFactorEnabled
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {user?.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
        </button>
      </div>

      {/* Push Notifications */}
      <div className={`${cardBg} p-6 rounded-2xl border ${borderColor}`}>
        <h4 className="font-bold mb-4 flex items-center gap-2 text-blue-400"><MdNotifications /> Push Notifications</h4>
        <p className={`${textSecondary} text-sm mb-4`}>
          Receive notifications for course reminders, achievements, and updates even when the browser is closed.
        </p>
        <div className="flex items-center justify-between">
          <span className={`text-sm ${textPrimary}`}>
            {pushEnabled ? 'Push notifications are enabled' : 'Enable push notifications'}
          </span>
          <button
            onClick={async () => {
              setPushLoading(true);
              try {
                if (pushEnabled) {
                  await unsubscribeFromPush(token);
                  setPushEnabled(false);
                  setSecurityMessage('Push notifications disabled');
                } else {
                  const perm = await requestNotificationPermission();
                  if (perm === 'granted') {
                    await subscribeToPush(token);
                    setPushEnabled(true);
                    setSecurityMessage('Push notifications enabled');
                  } else {
                    setSecurityError('Notification permission denied');
                  }
                }
              } catch (err) {
                setSecurityError('Failed to toggle notifications');
              } finally {
                setPushLoading(false);
              }
            }}
            disabled={pushLoading}
            className={`px-5 py-2.5 rounded-xl font-semibold transition text-sm ${
              pushEnabled
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } disabled:opacity-40`}
          >
            {pushLoading ? 'Processing...' : pushEnabled ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>

      {/* Session Management */}
      <div className={`${cardBg} p-6 rounded-2xl border ${borderColor}`}>
        <h4 className="font-bold mb-4 flex items-center gap-2 text-blue-400"><MdDevices /> Session Management</h4>
        <p className={`${textSecondary} text-sm mb-4`}>
          Log out of all active sessions across all devices. You will need to login again.
        </p>
        <button onClick={handleLogoutAll} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition text-white text-sm">
          Logout All Devices
        </button>
      </div>
    </div>
  );
}

const ACCENTS = [
  { key: 'blue', label: 'Blue', from: '#2563eb', to: '#1e3a8a' },
  { key: 'green', label: 'Green', from: '#059669', to: '#064e3b' },
  { key: 'purple', label: 'Purple', from: '#9333ea', to: '#6b21a8' },
];

const FONT_SIZES = [
  { key: 'small', label: 'Small', desc: '14px' },
  { key: 'medium', label: 'Medium', desc: '16px' },
  { key: 'large', label: 'Large', desc: '18px' },
];

function AppearanceForm({ isDark, toggleTheme, accent, setAccent, fontSize, setFontSize, t, cardBg, borderColor, textPrimary, textSecondary }) {
  return (
    <div className="max-w-2xl space-y-6">
      {/* Dark/Light Mode */}
      <div className={`${cardBg} p-6 rounded-2xl border ${borderColor}`}>
        <h4 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--accent-400)' }}>{t('theme')}</h4>
        <div className="flex items-center justify-between">
          <p className={`${textSecondary} text-sm`}>{isDark ? t('darkMode') : t('lightMode')}</p>
          <button
            onClick={toggleTheme}
            className="relative w-14 h-7 rounded-full transition-colors duration-300"
            style={{ backgroundColor: isDark ? 'var(--accent-600)' : '#d1d5db' }}
          >
            <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 flex items-center justify-center text-xs
              ${isDark ? 'translate-x-7' : 'translate-x-0.5'}`}>
              {isDark ? '🌙' : '☀️'}
            </span>
          </button>
        </div>
      </div>

      {/* Accent Color */}
      <div className={`${cardBg} p-6 rounded-2xl border ${borderColor}`}>
        <h4 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--accent-400)' }}>{t('accentColor')}</h4>
        <div className="flex gap-3">
          {ACCENTS.map((a) => (
            <button
              key={a.key}
              onClick={() => setAccent(a.key)}
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 btn-press ${
                accent === a.key ? 'ring-2 ring-offset-2' : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                background: `linear-gradient(135deg, ${a.from}, ${a.to})`,
                borderColor: accent === a.key ? a.from : 'transparent',
                ringColor: a.from,
              }}
            >
              <p className="text-white font-semibold text-sm">{t(a.key)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className={`${cardBg} p-6 rounded-2xl border ${borderColor}`}>
        <h4 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--accent-400)' }}>{t('fontSize')}</h4>
        <div className="flex gap-3">
          {FONT_SIZES.map((f) => (
            <button
              key={f.key}
              onClick={() => setFontSize(f.key)}
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 btn-press text-center ${
                fontSize === f.key
                  ? (isDark ? 'border-gray-500 bg-gray-700' : 'border-gray-400 bg-gray-100')
                  : (isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white')
              }`}
            >
              <p className={`font-semibold ${textPrimary}`} style={{ fontSize: f.desc }}>Aa</p>
              <p className={`text-xs mt-1 ${textSecondary}`}>{t(f.key)}</p>
              <p className={`text-[10px] ${textSecondary}`}>{f.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActivityFeed({ logs, cardBg, borderColor, textPrimary, textSecondary, isDark }) {
  const actionDefs = {
    login: { icon: <MdTrendingUp className="text-green-400 text-xs" />, label: 'Login' },
    register: { icon: <MdPerson className="text-blue-400 text-xs" />, label: 'Register' },
    enroll_course: { icon: <MdBook className="text-purple-400 text-xs" />, label: 'Enrolled' },
    complete_course: { icon: <MdVerified className="text-green-400 text-xs" />, label: 'Completed' },
    change_role: { icon: <FaUserCog className="text-yellow-400 text-xs" />, label: 'Role Changed' },
  };

  return (
    <div className={`${cardBg} p-6 rounded-2xl border ${borderColor}`}>
      <h4 className="font-bold mb-4 flex items-center gap-2 text-blue-400"><MdTimeline /> Recent Activity</h4>
      {logs.length === 0 ? (
        <p className={`text-sm ${textSecondary} py-8 text-center`}>No recent activity</p>
      ) : (
        <div className="space-y-2">
          {logs.map((log, i) => {
            const def = actionDefs[log.action] || { icon: <MdPerson className="text-gray-400 text-xs" />, label: log.action };
            return (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  {def.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{def.label}</p>
                  <p className={`text-xs ${textSecondary}`}>{new Date(log.createdAt).toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Profile;
