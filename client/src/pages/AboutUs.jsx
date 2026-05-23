import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FaGraduationCap, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { MdPlayCircle, MdQuiz, MdWorkspacePremium, MdForum, MdSearch, MdTrendingUp, MdSecurity, MdPeople, MdRocketLaunch } from 'react-icons/md';

function AboutUs() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const sectionBg = isDark ? 'bg-gray-800' : 'bg-gray-50';

  const team = [
    { name: 'Muhammad Usman', role: 'Full Stack Developer', avatar: 'MU', desc: 'Built LearnTrack from scratch using MERN stack.' },
  ];

  const values = [
    { icon: <MdRocketLaunch className="text-3xl text-blue-400" />, title: 'Innovation', desc: 'We constantly improve our platform to provide the best learning experience.' },
    { icon: <MdPeople className="text-3xl text-green-400" />, title: 'Community', desc: 'We believe in the power of community and collaborative learning.' },
    { icon: <MdSecurity className="text-3xl text-purple-400" />, title: 'Trust', desc: 'We are committed to keeping your data safe and secure.' },
    { icon: <MdTrendingUp className="text-3xl text-yellow-400" />, title: 'Growth', desc: 'We help you grow your skills and achieve your learning goals.' },
  ];

  const stats = [
    { value: '10+', label: 'Learning Fields' },
    { value: '100%', label: 'Free to Use' },
    { value: '24/7', label: 'Available' },
    { value: '∞', label: 'Courses' },
  ];

  return (
    <div className={`min-h-screen ${bgPrimary} ${textPrimary} transition-colors duration-300`}>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${bgPrimary} border-b ${borderColor} px-6 py-4`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <FaGraduationCap className="text-blue-400 text-2xl" />
            <h1 className="text-xl font-bold text-blue-400">LearnTrack</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/login')} className={`px-4 py-2 ${textSecondary} hover:${textPrimary} transition text-sm`}>Login</button>
            <button onClick={() => navigate('/register')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold transition">Get Started</button>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16">

        {/* Hero */}
        <section className="px-6 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FaGraduationCap className="text-white text-4xl" />
            </div>
            <h1 className="text-5xl font-bold mb-6">About LearnTrack</h1>
            <p className={`text-xl ${textSecondary} max-w-2xl mx-auto`}>
              LearnTrack is a personal learning management system built to help students and professionals organize their learning journey, track progress and earn certificates.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className={`px-6 py-12 ${sectionBg}`}>
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-blue-400">{stat.value}</p>
                <p className={`${textSecondary} text-sm mt-1`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className={`${textSecondary} text-lg leading-relaxed mb-4`}>
                  Our mission is to make quality education accessible to everyone. We believe that learning should be organized, trackable and rewarding.
                </p>
                <p className={`${textSecondary} text-lg leading-relaxed`}>
                  LearnTrack provides structured roadmaps, progress tracking, quizzes and certificates — all in one place, completely free.
                </p>
              </div>
              <div className={`${cardBg} p-8 rounded-2xl border ${borderColor}`}>
                <h3 className="text-xl font-bold mb-4">What We Offer</h3>
                <div className="space-y-3">
                  {[
                    { icon: <MdPlayCircle className="text-blue-400" />, text: 'Video lectures — YouTube & uploads' },
                    { icon: <MdTrendingUp className="text-green-400" />, text: 'Progress tracking across all courses' },
                    { icon: <MdQuiz className="text-purple-400" />, text: 'Quizzes to test your knowledge' },
                    { icon: <MdWorkspacePremium className="text-yellow-400" />, text: 'Certificates upon completion' },
                    { icon: <MdForum className="text-red-400" />, text: 'Discussion forums for learners' },
                    { icon: <MdSearch className="text-pink-400" />, text: 'Smart search for fields and tracks' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="text-xl">{item.icon}</div>
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className={`px-6 py-16 ${sectionBg}`}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className={`text-3xl font-bold mb-4 ${textPrimary}`}>Our Values</h2>
              <p className={textSecondary}>The principles that guide everything we do</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {values.map((value) => (
                <div key={value.title} className={`${isDark ? 'bg-gray-900' : 'bg-white'} p-6 rounded-2xl border ${borderColor} text-center`}>
                  <div className="mb-4 flex justify-center">{value.icon}</div>
                  <h3 className={`text-lg font-bold mb-2 ${textPrimary}`}>{value.title}</h3>
                  <p className={`${textSecondary} text-sm`}>{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Team</h2>
              <p className={textSecondary}>The people behind LearnTrack</p>
            </div>
            <div className="flex justify-center">
              {team.map((member) => (
                <div key={member.name} className={`${cardBg} p-8 rounded-2xl border ${borderColor} text-center max-w-sm`}>
                  <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {member.avatar}
                  </div>
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-blue-400 text-sm mb-3">{member.role}</p>
                  <p className={`${textSecondary} text-sm`}>{member.desc}</p>
                  <div className="flex justify-center gap-3 mt-4">
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="w-9 h-9 bg-gray-700 hover:bg-gray-600 rounded-xl flex items-center justify-center transition">
                      <FaGithub />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-9 h-9 bg-gray-700 hover:bg-blue-700 rounded-xl flex items-center justify-center transition">
                      <FaLinkedin />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 bg-gray-700 hover:bg-sky-600 rounded-xl flex items-center justify-center transition">
                      <FaTwitter />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={`px-6 py-16 ${sectionBg}`}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className={`text-3xl font-bold mb-4 ${textPrimary}`}>Ready to Start Learning?</h2>
            <p className={`${textSecondary} mb-8`}>Join LearnTrack today and take control of your learning journey.</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition"
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate('/contact')}
                className={`px-8 py-3 ${isDark ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' : 'bg-gray-200 hover:bg-gray-300 border-gray-300'} rounded-xl font-bold transition border`}
              >
                Contact Us
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className={`${cardBg} border-t ${borderColor} py-6 px-6 text-center ${textSecondary} text-sm`}>
        <p>© 2026 LearnTrack — All rights reserved</p>
      </footer>
    </div>
  );
}

export default AboutUs;