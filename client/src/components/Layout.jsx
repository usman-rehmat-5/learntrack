import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MdDashboard, MdSearch, MdLogout, MdMenu, MdClose, MdPerson, MdSchool, MdAnalytics, MdPlayCircle, MdTimeline, MdWifiOff, MdHome, MdStar, MdBook, MdWorkspacePremium } from 'react-icons/md';
import { FaGraduationCap, FaBookOpen, FaUserShield, FaUserCog, FaUser, FaAward, FaTrophy, FaStar, FaLanguage, FaCrown } from 'react-icons/fa';
import { MdRateReview, MdVideocam } from 'react-icons/md';
import StreakCard from './StreakCard';
import { useLanguage } from '../context/LanguageContext';
import PremiumBadge from './PremiumBadge';

function Layout({ children }) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, activeEnrollment } = useAuth();
  const { isDark, toggleTheme, accent } = useTheme();
  const { t, lang, setLang } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close sidebar on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/login'); };

  // Theme-aware colors
  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const bgSecondary = isDark ? 'bg-gray-800' : 'bg-white';
  const bgTertiary = isDark ? 'bg-gray-700' : 'bg-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  const navItems = [
    { label: t('dashboard'), icon: <MdDashboard className="text-xl" />, path: '/dashboard' },
    { label: t('careerRoadmaps'), icon: <MdTimeline className="text-xl" />, path: '/roadmaps' },
    { label: t('search'), icon: <MdSearch className="text-xl" />, path: '/search' },
    { label: t('myCourses'), icon: <FaBookOpen className="text-xl" />, path: '/mycourses' },
    { label: t('gamification'), icon: <FaStar className="text-xl" />, path: '/gamification' },
    { label: t('liveClasses'), icon: <MdVideocam className="text-xl" />, path: '/live-classes' },
    { label: t('peerReview'), icon: <MdRateReview className="text-xl" />, path: '/peer-review' },
    { label: t('profile'), icon: <MdPerson className="text-xl" />, path: '/profile' },
    { label: t('certificates'), icon: <FaAward className="text-xl" />, path: '/mycertificates' },
    { label: t('leaderboard'), icon: <FaTrophy className="text-xl" />, path: '/leaderboard' },
    { label: 'Premium', icon: <FaCrown className="text-xl" style={{ color: '#F59E0B' }} />, path: '/subscription' },
  ];

  // Bottom nav items (subset for mobile)
  const bottomNavItems = [
    { icon: <MdHome className="text-xl" />, path: '/dashboard' },
    { icon: <MdSearch className="text-xl" />, path: '/search' },
    { icon: <FaBookOpen className="text-xl" />, path: '/mycourses' },
    { icon: <MdStar className="text-xl" />, path: '/gamification' },
    { icon: <MdPerson className="text-xl" />, path: '/profile' },
  ];

  const isActive = (path) => location.pathname === path;

  const accentBg600 = `var(--accent-600)`;
  const accentBg500 = `var(--accent-500)`;
  const accentBg700 = `var(--accent-700)`;

  const SidebarContent = () => (
    <div className={`p-4 h-full flex flex-col ${bgSecondary}`}>
      {/* User Card */}
      <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-2xl p-4 mb-6 text-center`}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-2 text-white"
          style={{ backgroundColor: accentBg600 }}>
          {user?.name?.slice(0, 2).toUpperCase()}
        </div>
        <p className={`font-semibold ${textPrimary}`}>{user?.name}</p>
        <p className={`text-xs truncate ${textSecondary}`}>{user?.email}</p>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className={`text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
            isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
          }`}>
            {user?.role === 'superadmin' ? <><FaUserShield className="text-xs" /> Super Admin</> :
             user?.role === 'admin' ? <><FaUserCog className="text-xs" /> Admin</> :
              <><FaUser className="text-xs" /> Learner</>}
          </span>
          {user?.subscriptionTier === 'premium' && <PremiumBadge />}
        </div>

        {/* Language Switcher */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <FaLanguage className={`text-xs ${textSecondary}`} />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className={`text-xs px-2 py-1 rounded-lg ${isDark ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'} focus:outline-none cursor-pointer`}
          >
            <option value="en">English</option>
            <option value="ur">اردو</option>
          </select>
        </div>
      </div>

      {/* Active Course */}
      {activeEnrollment?.enrolled && activeEnrollment.course && (
        <div className={`${isDark ? 'bg-gray-700' : 'bg-blue-50'} rounded-2xl p-3 mb-4 border`}
          style={{ borderColor: isDark ? 'var(--accent-800)' : 'var(--accent-200)' }}>
          <div className="flex items-center gap-2 mb-2">
            <MdPlayCircle className="text-lg" style={{ color: 'var(--accent-500)' }} />
            <p className={`text-xs font-semibold`} style={{ color: isDark ? 'var(--accent-300)' : 'var(--accent-700)' }}>Active Course</p>
          </div>
          <p className={`text-sm font-medium truncate ${textPrimary}`}>{activeEnrollment.course.title}</p>
          <div className={`w-full ${isDark ? 'bg-gray-600' : 'bg-blue-200'} rounded-full h-1.5 mt-2`}>
            <div className="h-1.5 rounded-full" style={{ width: `${activeEnrollment.percent}%`, backgroundColor: 'var(--accent-500)' }}></div>
          </div>
          <p className={`text-xs mt-1 ${textSecondary}`}>{activeEnrollment.percent}% complete</p>
        </div>
      )}

      {/* Streak Card */}
      <StreakCard />

      {/* Nav Items */}
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-left btn-press ${
              isActive(item.path)
                ? 'text-white'
                : (isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')
            }`}
            style={isActive(item.path) ? { backgroundColor: accentBg600 } : {}}
          >
            {item.icon}
            {item.label}
          </button>
        ))}

        {(user?.role === 'admin' || user?.role === 'superadmin') && (
          <button
            onClick={() => navigate('/admin')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-left btn-press ${
              isActive('/admin')
                ? 'text-white'
                : (isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')
            }`}
            style={isActive('/admin') ? { backgroundColor: accentBg600 } : {}}
          >
            <MdSchool className="text-xl" />
            Admin Panel
          </button>
        )}

        {(user?.role === 'admin' || user?.role === 'superadmin') && (
          <button
            onClick={() => navigate('/analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-left btn-press ${
              isActive('/analytics')
                ? 'text-white'
                : (isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')
            }`}
            style={isActive('/analytics') ? { backgroundColor: accentBg600 } : {}}
          >
            <MdAnalytics className="text-xl" />
            Analytics
          </button>
        )}

        {user?.role === 'superadmin' && (
          <button
            onClick={() => navigate('/superadmin')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-left btn-press ${
              isActive('/superadmin')
                ? 'text-white'
                : (isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')
            }`}
            style={isActive('/superadmin') ? { backgroundColor: accentBg600 } : {}}
          >
            <FaUserShield className="text-xl" />
            Super Admin
          </button>
        )}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-left btn-press text-gray-400 hover:bg-gray-700"
      >
        <MdLogout className="text-xl" />
        Logout
      </button>
    </div>
  );

  return (
    <div className={`min-h-screen ${bgPrimary} flex flex-col transition-colors duration-300`}>

      {/* Header */}
      <header className={`${bgSecondary} border-b ${borderColor} px-4 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-50 shadow-sm`}>
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden ${textSecondary} hover:${textPrimary} transition`}
          >
            {mobileOpen ? <MdClose className="text-2xl" /> : <MdMenu className="text-2xl" />}
          </button>

          {/* Desktop Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`hidden md:block ${textSecondary} hover:${textPrimary} transition`}
          >
            <MdMenu className="text-2xl" />
          </button>

          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <FaGraduationCap className="text-2xl" style={{ color: 'var(--accent-400)' }} />
            <h1 className="text-xl font-bold" style={{ color: 'var(--accent-400)' }}>LearnTrack</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search - Desktop */}
          <div
            onClick={() => navigate('/search')}
            className={`hidden md:flex items-center gap-2 ${bgTertiary} px-4 py-2 rounded-xl cursor-pointer hover:opacity-80 transition`}
          >
            <MdSearch className={textSecondary} />
            <span className={`text-sm ${textSecondary}`}>Search...</span>
          </div>

          {/* Search - Mobile */}
          <button
            onClick={() => navigate('/search')}
            className={`md:hidden w-9 h-9 ${bgTertiary} rounded-xl flex items-center justify-center transition`}
          >
            <MdSearch className={textSecondary} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`w-9 h-9 ${bgTertiary} rounded-xl flex items-center justify-center transition hover:opacity-80`}
          >
            {isDark ? <span className="text-lg">☀️</span> : <span className="text-lg">🌙</span>}
          </button>

          {/* User */}
          <div className={`hidden md:flex items-center gap-2 ${bgTertiary} px-3 py-2 rounded-xl`}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: 'var(--accent-500)' }}>
              {user?.name?.slice(0, 2).toUpperCase()}
            </div>
            <span className={`text-sm ${textPrimary}`}>{user?.name}</span>
          </div>

          {/* Logout - Desktop */}
          <button
            onClick={handleLogout}
            className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition
              ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}
          >
            <MdLogout className="text-lg" />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed top-16 left-0 bottom-0 w-72 ${bgSecondary} border-r ${borderColor} z-40 transform transition-transform duration-300 ease-out md:hidden overflow-y-auto ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className={`hidden md:block fixed top-16 left-0 bottom-0 w-72 ${bgSecondary} border-r ${borderColor} z-40 overflow-y-auto transform transition-transform duration-300 ease-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>

      {/* Offline Banner */}
      {isOffline && (
        <div className="fixed top-16 left-0 right-0 z-[60] bg-yellow-600 text-white text-center py-2 px-4 flex items-center justify-center gap-2 text-sm font-semibold shadow-lg animate-slide-down"
          style={{ left: sidebarOpen ? '18rem' : '0' }}>
          <MdWifiOff className="text-lg" />
          You are offline. Some features may be limited.
        </div>
      )}

      {/* Main Content */}
      <div className={`flex flex-col flex-1 pt-16 transition-all duration-300 ease-out ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'}`}>
        <main className="flex-1 has-bottom-nav page-enter">
          {children}
        </main>

        {/* Footer */}
        <footer className={`${bgSecondary} border-t ${borderColor} py-4 px-6 ${textSecondary} text-sm`}>
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© 2026 LearnTrack — All rights reserved</p>
            <div className="flex gap-4">
              <button onClick={() => navigate('/cookies')} className="hover:text-white transition">Cookie Policy</button>
              <button onClick={() => navigate('/terms')} className="hover:text-white transition">Privacy Policy</button>
            </div>
          </div>
        </footer>
      </div>

      {/* Bottom Navigation Bar — Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {bottomNavItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center gap-0.5 w-14 h-full transition-all duration-200 relative"
              >
                {active && (
                  <span className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--accent-500)' }} />
                )}
                <span className={active ? 'text-lg' : 'text-lg text-gray-500'}
                  style={active ? { color: 'var(--accent-400)' } : {}}>
                  {item.icon}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default Layout;
