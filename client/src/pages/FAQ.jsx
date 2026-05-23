import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FaGraduationCap } from 'react-icons/fa';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';

const faqs = [
  {
    category: 'General',
    questions: [
      { q: 'What is LearnTrack?', a: 'LearnTrack is a personal learning management system that helps you organize courses, follow structured roadmaps, track progress and earn certificates — all in one place.' },
      { q: 'Is LearnTrack free to use?', a: 'Yes! LearnTrack is completely free to use. Simply register and start learning.' },
      { q: 'Who can use LearnTrack?', a: 'Anyone who wants to learn — students, professionals, or anyone looking to upgrade their skills.' },
    ]
  },
  {
    category: 'Courses & Learning',
    questions: [
      { q: 'How do I start learning?', a: 'Register an account, go to Dashboard, select a field, choose a track, follow the roadmap and start watching courses.' },
      { q: 'What fields are available?', a: 'We offer Web Development, Cyber Security, Artificial Intelligence, Data Science, Software Engineering and many more. New fields are added regularly by our admin team.' },
      { q: 'Can I track my progress?', a: 'Yes! You can mark lectures as complete and track your progress with progress bars on every course.' },
      { q: 'What platforms are courses from?', a: 'Courses can be from YouTube, Udemy, Coursera or any other platform. Our admins add the best available courses.' },
    ]
  },
  {
    category: 'Quizzes & Certificates',
    questions: [
      { q: 'How do I earn a certificate?', a: 'Complete all lectures in a course and pass the quiz with at least 70% score. A certificate will be automatically generated and emailed to you.' },
      { q: 'How many attempts do I get for a quiz?', a: 'You can retake the quiz as many times as you need until you pass.' },
      { q: 'Are the certificates valid?', a: 'LearnTrack certificates are proof of your completion and knowledge. They can be shared on LinkedIn or added to your resume.' },
    ]
  },
  {
    category: 'Account & Profile',
    questions: [
      { q: 'How do I update my profile?', a: 'Go to Profile from the sidebar, update your name or email and click Save.' },
      { q: 'Can I change my password?', a: 'Yes! Go to Profile, click Change Password tab, enter your current password and set a new one.' },
      { q: 'How do I become an admin?', a: 'Admin access is granted by the Super Admin. Contact us if you need admin access.' },
    ]
  },
  {
    category: 'Technical',
    questions: [
      { q: 'What browsers are supported?', a: 'LearnTrack works on all modern browsers including Chrome, Firefox, Safari and Edge.' },
      { q: 'Is LearnTrack mobile friendly?', a: 'Yes! LearnTrack is fully responsive and works great on mobile devices.' },
      { q: 'I found a bug. How do I report it?', a: 'Contact us through the Contact page and describe the issue. We will fix it as soon as possible.' },
    ]
  }
];

function FAQ() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [openItem, setOpenItem] = useState(null);
  const [search, setSearch] = useState('');

  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDark ? 'bg-gray-800' : 'bg-gray-100';

  const filtered = faqs.map(cat => ({
    ...cat,
    questions: cat.questions.filter(
      q => q.q.toLowerCase().includes(search.toLowerCase()) ||
           q.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

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

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className={`${textSecondary} text-lg mb-6`}>Find answers to the most common questions</p>

            {/* Search */}
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full px-5 py-3 rounded-xl ${inputBg} ${textPrimary} placeholder-gray-400 border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          {/* FAQs */}
          <div className="space-y-8">
            {filtered.map((cat) => (
              <div key={cat.category}>
                <h3 className="text-lg font-bold text-blue-400 mb-3">{cat.category}</h3>
                <div className="space-y-2">
                  {cat.questions.map((item, index) => {
                    const key = `${cat.category}-${index}`;
                    const isOpen = openItem === key;
                    return (
                      <div key={key} className={`${cardBg} rounded-xl border ${borderColor} overflow-hidden`}>
                        <button
                          onClick={() => setOpenItem(isOpen ? null : key)}
                          className="w-full flex justify-between items-center px-6 py-4 text-left hover:bg-gray-750 transition"
                        >
                          <span className="font-semibold text-sm">{item.q}</span>
                          {isOpen ? <MdExpandLess className="text-blue-400 text-xl shrink-0" /> : <MdExpandMore className={`${textSecondary} text-xl shrink-0`} />}
                        </button>
                        {isOpen && (
                          <div className={`px-6 pb-4 border-t ${borderColor}`}>
                            <p className={`${textSecondary} text-sm leading-relaxed pt-3`}>{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Still have questions */}
          <div className={`mt-12 ${cardBg} p-8 rounded-2xl border ${borderColor} text-center`}>
            <h3 className={`text-xl font-bold mb-2 ${textPrimary}`}>Still have questions?</h3>
            <p className={`${textSecondary} mb-6`}>Can not find the answer you are looking for? Contact our support team.</p>
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`${cardBg} border-t ${borderColor} py-6 px-6 text-center ${textSecondary} text-sm`}>
        <p>© 2026 LearnTrack — All rights reserved</p>
      </footer>
    </div>
  );
}

export default FAQ;