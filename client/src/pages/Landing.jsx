import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { FaGraduationCap, FaYoutube, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { MdPlayCircle, MdQuiz, MdWorkspacePremium, MdForum, MdSearch, MdTrendingUp } from 'react-icons/md';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Landing() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [stats, setStats] = useState(null);
  const [realFields, setRealFields] = useState([]);
  const [loading, setLoading] = useState(true);

  const bg = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const cardBorder = isDark ? 'border-gray-700' : 'border-gray-200';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const heading = isDark ? 'text-white' : 'text-gray-900';

  useEffect(() => {
    document.title = 'LearnTrack — Your Personal Learning Management System';
    fetchStats();
    fetchFields();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/api/public/stats`);
      setStats(res.data);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchFields = async () => {
    try {
      const res = await axios.get(`${API}/api/public/fields`);
      setRealFields(res.data || []);
    } catch {
      setRealFields([]);
    }
  };

  const features = [
    { icon: <MdPlayCircle className="text-4xl" style={{ color: 'var(--accent-400)' }} />, title: 'Video Lectures', desc: 'Upload your own videos or add YouTube links to track your learning.' },
    { icon: <MdTrendingUp className="text-4xl" style={{ color: 'var(--accent-400)' }} />, title: 'Progress Tracking', desc: 'Track your progress across all courses and see how far you have come.' },
    { icon: <MdQuiz className="text-4xl" style={{ color: 'var(--accent-400)' }} />, title: 'Quizzes & MCQs', desc: 'Test your knowledge with quizzes after completing each track.' },
    { icon: <MdWorkspacePremium className="text-4xl" style={{ color: 'var(--accent-400)' }} />, title: 'Certificates', desc: 'Get certificates after passing quizzes to prove your skills.' },
    { icon: <MdForum className="text-4xl" style={{ color: 'var(--accent-400)' }} />, title: 'Discussion Forum', desc: 'Ask questions and share knowledge with other learners.' },
    { icon: <MdSearch className="text-4xl" style={{ color: 'var(--accent-400)' }} />, title: 'Smart Search', desc: 'Search for any field or track instantly.' },
  ];

  const steps = [
    { step: '01', title: 'Create Account', desc: 'Register for free and set up your profile in seconds.' },
    { step: '02', title: 'Choose Your Field', desc: 'Select from Web Development, Cyber Security, AI and more.' },
    { step: '03', title: 'Follow Roadmap', desc: 'Follow the structured roadmap to learn step by step.' },
    { step: '04', title: 'Track Progress', desc: 'Add courses, complete lectures and track your progress.' },
    { step: '05', title: 'Take Quizzes', desc: 'Test your knowledge and earn certificates.' },
  ];

  return (
    <div className={`min-h-screen ${bg} ${heading} transition-colors duration-300`}>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${isDark ? 'bg-gray-900/90 border-gray-800' : 'bg-white/90 border-gray-200'} backdrop-blur-md border-b px-6 py-4`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <FaGraduationCap className="text-2xl" style={{ color: 'var(--accent-400)' }} />
            <h1 className="text-xl font-bold" style={{ color: 'var(--accent-400)' }}>LearnTrack</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/login')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 rounded-xl font-semibold text-sm text-white transition"
              style={{ backgroundColor: 'var(--accent-500)', hover: { backgroundColor: 'var(--accent-600)' } }}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`pt-32 pb-20 px-6`}>
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}
          >
            <FaGraduationCap />
            Your Personal Learning Tracker
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Track Your Learning
            <span style={{ color: 'var(--accent-400)' }}> Journey</span>
          </h1>
          <p className={`text-xl ${textMuted} mb-10 max-w-3xl mx-auto`}>
            LearnTrack helps you organize your courses, follow structured roadmaps,
            track your progress and earn certificates — all in one place.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 rounded-xl font-bold text-lg text-white transition active:scale-95"
              style={{ backgroundColor: 'var(--accent-500)' }}
              onMouseEnter={e => e.target.style.backgroundColor = 'var(--accent-600)'}
              onMouseLeave={e => e.target.style.backgroundColor = 'var(--accent-500)'}
            >
              Start Learning Free
            </button>
            <button
              onClick={() => navigate('/login')}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition border active:scale-95 ${
                isDark ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-white hover:bg-gray-50 border-gray-300'
              }`}
            >
              Login
            </button>
          </div>

          {/* Stats */}
          {!loading && stats && (
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div>
                <p className="text-4xl font-bold" style={{ color: 'var(--accent-400)' }}>{stats.totalFields}+</p>
                <p className="text-gray-400 text-sm mt-1">Fields Available</p>
              </div>
              <div>
                <p className="text-4xl font-bold" style={{ color: 'var(--accent-400)' }}>{stats.totalUsers}+</p>
                <p className="text-gray-400 text-sm mt-1">Active Learners</p>
              </div>
              <div>
                <p className="text-4xl font-bold" style={{ color: 'var(--accent-400)' }}>{stats.totalCertificates}+</p>
                <p className="text-gray-400 text-sm mt-1">Certificates Issued</p>
              </div>
            </div>
          )}
          {!loading && !stats && (
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div>
                <p className="text-4xl font-bold" style={{ color: 'var(--accent-400)' }}>5+</p>
                <p className="text-gray-400 text-sm mt-1">Fields Available</p>
              </div>
              <div>
                <p className="text-4xl font-bold" style={{ color: 'var(--accent-400)' }}>1K+</p>
                <p className="text-gray-400 text-sm mt-1">Active Learners</p>
              </div>
              <div>
                <p className="text-4xl font-bold" style={{ color: 'var(--accent-400)' }}>500+</p>
                <p className="text-gray-400 text-sm mt-1">Certificates Issued</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Fields Section */}
      <section className={`py-20 px-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Available Fields</h2>
            <p className={`${textMuted} text-lg`}>Choose your learning path from our structured fields</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(realFields.length > 0 ? realFields : []).map((field, index) => (
              <div
                key={field._id}
                role="button"
                tabIndex={0}
                aria-label={`Explore ${field.name}`}
                className={`p-8 rounded-2xl cursor-pointer transition-all border ${cardBorder} ${cardBg} hover:scale-[1.02] active:scale-[0.98]`}
                onClick={() => navigate('/register')}
                onKeyDown={(e) => { if (e.key === 'Enter') navigate('/register'); }}
              >
                <h3 className="text-xl font-bold mb-2">{field.name}</h3>
                <p className={`text-sm ${textMuted}`}>{field.description || 'View roadmap & courses'}</p>
              </div>
            ))}
            {realFields.length === 0 && !loading && (
              <>
                {['Web Development', 'Cyber Security', 'Artificial Intelligence', 'Data Science', 'Cloud Computing', 'DevOps'].map((name, i) => (
                  <div key={name} className={`p-8 rounded-2xl border ${cardBorder} ${cardBg}`}>
                    <h3 className="text-xl font-bold mb-2">{name}</h3>
                    <p className={`text-sm ${textMuted}`}>Explore courses and roadmap</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 px-6 ${bg}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className={`${textMuted} text-lg`}>Powerful features to supercharge your learning</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className={`${cardBg} p-6 rounded-2xl border ${cardBorder} transition`}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-300)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = ''}>
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className={`${textMuted} text-sm`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={`py-20 px-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className={`${textMuted} text-lg`}>Get started in minutes</p>
          </div>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className={`flex items-start gap-6 ${cardBg} p-6 rounded-2xl border ${cardBorder}`}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 text-white"
                  style={{ backgroundColor: 'var(--accent-500)' }}>
                  {step.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{step.title}</h3>
                  <p className={textMuted}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 px-6 ${bg}`}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className={`${textMuted} text-lg mb-8`}>Join LearnTrack today and take control of your learning journey.</p>
          <button
            onClick={() => navigate('/register')}
            className="px-10 py-4 rounded-xl font-bold text-xl text-white transition active:scale-95"
            style={{ backgroundColor: 'var(--accent-500)' }}
            onMouseEnter={e => e.target.style.backgroundColor = 'var(--accent-600)'}
            onMouseLeave={e => e.target.style.backgroundColor = 'var(--accent-500)'}
          >
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t py-12 px-6`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <FaGraduationCap className="text-2xl" style={{ color: 'var(--accent-400)' }} />
                <h3 className="text-xl font-bold" style={{ color: 'var(--accent-400)' }}>LearnTrack</h3>
              </div>
              <p className={`${textMuted} text-sm`}>Your personal learning tracker — organize, track and achieve your goals.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className={`space-y-2 ${textMuted} text-sm`}>
                <li><button onClick={() => navigate('/login')} className={`transition ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>Login</button></li>
                <li><button onClick={() => navigate('/register')} className={`transition ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>Register</button></li>
                <li><button onClick={() => navigate('/about')} className={`transition ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>About Us</button></li>
                <li><button onClick={() => navigate('/contact')} className={`transition ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>Contact Us</button></li>
                <li><button onClick={() => navigate('/faq')} className={`transition ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>FAQ</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className={`space-y-2 ${textMuted} text-sm`}>
                <li><button onClick={() => navigate('/terms')} className={`transition ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>Terms of Service</button></li>
                <li><button onClick={() => navigate('/terms')} className={`transition ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>Privacy Policy</button></li>
                <li><button onClick={() => navigate('/cookies')} className={`transition ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>Cookie Policy</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Fields</h4>
              <ul className={`space-y-2 ${textMuted} text-sm`}>
                {realFields.length > 0 ? realFields.slice(0, 5).map(f => (
                  <li key={f._id}>{f.name}</li>
                )) : (
                  <>
                    <li>Web Development</li>
                    <li>Cyber Security</li>
                    <li>Artificial Intelligence</li>
                    <li>Data Science</li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                {[
                  { icon: <FaGithub className="text-lg" />, label: 'GitHub', href: 'https://github.com', hover: isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-300' },
                  { icon: <FaLinkedin className="text-lg" />, label: 'LinkedIn', href: 'https://linkedin.com', hover: isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-300' },
                  { icon: <FaTwitter className="text-lg" />, label: 'Twitter', href: 'https://twitter.com', hover: isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-300' },
                  { icon: <FaYoutube className="text-lg" />, label: 'YouTube', href: 'https://youtube.com', hover: isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-300' },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                    className={`w-10 h-10 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} ${s.hover} rounded-xl flex items-center justify-center transition`}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {stats && (
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 ${isDark ? 'bg-gray-900' : 'bg-gray-100'} p-6 rounded-2xl`}>
              {[
                { label: 'Learners', value: stats.totalUsers, color: 'var(--accent-400)' },
                { label: 'Fields', value: stats.totalFields, color: 'var(--accent-400)' },
                { label: 'Tracks', value: stats.totalTracks, color: 'var(--accent-400)' },
                { label: 'Certificates', value: stats.totalCertificates, color: 'var(--accent-400)' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}+</p>
                  <p className={`${textMuted} text-sm`}>{s.label}</p>
                </div>
              ))}
            </div>
          )}

          <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} pt-6 flex flex-col sm:flex-row justify-between items-center gap-4`}>
            <p className={`${textMuted} text-sm`}>© 2026 LearnTrack — All rights reserved</p>
            <div className={`flex gap-4 ${textMuted} text-sm flex-wrap justify-center`}>
              <button onClick={() => navigate('/cookies')} className={`transition ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>Cookie Policy</button>
              <button onClick={() => navigate('/terms')} className={`transition ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>Privacy Policy</button>
              <button onClick={() => navigate('/terms')} className={`transition ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
