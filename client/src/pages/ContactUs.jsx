import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { MdEmail, MdPhone, MdLocationOn, MdSend } from 'react-icons/md';
import { FaGraduationCap, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

function ContactUs() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { api } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDark ? 'bg-gray-700' : 'bg-gray-100';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await api.post('/contact', form);
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

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
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
            <p className={`${textSecondary} text-lg`}>Have a question? We would love to hear from you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* Left - Contact Info */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
              <p className={`${textSecondary} mb-8`}>Fill out the form and our team will get back to you within 24 hours.</p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-900 rounded-xl flex items-center justify-center">
                    <MdEmail className="text-blue-400 text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className={`${textSecondary} text-sm`}>support@learntrack.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-900 rounded-xl flex items-center justify-center">
                    <MdPhone className="text-green-400 text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className={`${textSecondary} text-sm`}>+92 300 0000000</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-900 rounded-xl flex items-center justify-center">
                    <MdLocationOn className="text-purple-400 text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className={`${textSecondary} text-sm`}>Lahore, Pakistan</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <p className="font-semibold mb-4">Follow Us</p>
                <div className="flex gap-3">
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center transition">
                    <FaGithub className="text-lg" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-xl flex items-center justify-center transition">
                    <FaLinkedin className="text-lg" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-sky-600 rounded-xl flex items-center justify-center transition">
                    <FaTwitter className="text-lg" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right - Form */}
            <div className={`${cardBg} p-8 rounded-2xl border ${borderColor}`}>
              {sent ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MdSend className="text-green-400 text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-gray-400">We will get back to you within 24 hours.</p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-xl font-bold mb-4">Send a Message</h3>
                  {error && <p className="text-red-400 bg-red-900/50 px-4 py-3 rounded-lg text-sm">{error}</p>}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`${textSecondary} text-sm mb-1 block`}>Name</label>
                      <input
                        type="text"
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        className={`w-full px-4 py-3 rounded-lg ${inputBg} ${textPrimary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    <div>
                      <label className={`${textSecondary} text-sm mb-1 block`}>Email</label>
                      <input
                        type="email"
                        placeholder="Your email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        className={`w-full px-4 py-3 rounded-lg ${inputBg} ${textPrimary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                  </div>
                  <div>
                      <label className={`${textSecondary} text-sm mb-1 block`}>Subject</label>
                    <input
                      type="text"
                      placeholder="Subject"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      required
                      className={`w-full px-4 py-3 rounded-lg ${inputBg} ${textPrimary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <div>
                      <label className={`${textSecondary} text-sm mb-1 block`}>Message</label>
                    <textarea
                      placeholder="Your message..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      rows={5}
                      className={`w-full px-4 py-3 rounded-lg ${inputBg} ${textPrimary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <MdSend /> {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
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

export default ContactUs;