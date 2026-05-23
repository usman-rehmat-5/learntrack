import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FaGraduationCap } from 'react-icons/fa';

function TermsAndPrivacy() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('terms');

  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const tabActive = isDark ? 'bg-blue-600' : 'bg-blue-500';
  const tabInactive = isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100';

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
            <h1 className="text-4xl font-bold mb-4">Legal</h1>
            <p className={textSecondary}>Last updated: May 2026</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-6 py-2.5 rounded-xl font-semibold transition ${activeTab === 'terms' ? tabActive : tabInactive}`}
              >
                Terms of Service
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`px-6 py-2.5 rounded-xl font-semibold transition ${activeTab === 'privacy' ? tabActive : tabInactive}`}
            >
              Privacy Policy
            </button>
          </div>

          {/* Terms of Service */}
          {activeTab === 'terms' && (
            <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} space-y-8`}>
              <div>
                <h2 className={`text-2xl font-bold mb-4 ${textPrimary}`}>Terms of Service</h2>
                <p className={textSecondary}>By using LearnTrack, you agree to these terms. Please read them carefully.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3 text-blue-400">1. Acceptance of Terms</h3>
                <p className={`${textSecondary} leading-relaxed`}>By accessing and using LearnTrack, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3 text-blue-400">2. User Accounts</h3>
                <div className={`${textSecondary} space-y-2`}>
                  <p>You must provide accurate and complete information when creating an account.</p>
                  <p>You are responsible for maintaining the security of your account and password.</p>
                  <p>You must notify us immediately of any unauthorized use of your account.</p>
                  <p>One person may not maintain more than one account.</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3 text-blue-400">3. Acceptable Use</h3>
                <div className="text-gray-400 space-y-2">
                  <p>You agree not to use LearnTrack for any unlawful purpose.</p>
                  <p>You agree not to attempt to gain unauthorized access to any part of the platform.</p>
                  <p>You agree not to upload any harmful, offensive or inappropriate content.</p>
                  <p>You agree not to interfere with or disrupt the platform or servers.</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3 text-blue-400">4. Content</h3>
                <div className="text-gray-400 space-y-2">
                  <p>All course content on LearnTrack is provided for educational purposes only.</p>
                  <p>Administrators are responsible for the accuracy of content they upload.</p>
                  <p>We reserve the right to remove any content that violates these terms.</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3 text-blue-400">5. Certificates</h3>
                <div className="text-gray-400 space-y-2">
                  <p>Certificates are issued upon successful completion of all course requirements.</p>
                  <p>LearnTrack certificates are for educational purposes and do not guarantee employment.</p>
                  <p>We reserve the right to revoke certificates if fraud is detected.</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3 text-blue-400">6. Termination</h3>
                <p className={`${textSecondary} leading-relaxed`}>We reserve the right to terminate or suspend your account at any time for violations of these terms. You may also delete your account at any time.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3 text-blue-400">7. Changes to Terms</h3>
                <p className={`${textSecondary} leading-relaxed`}>We may update these terms at any time. Continued use of LearnTrack after changes constitutes acceptance of the new terms.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3 text-blue-400">8. Contact</h3>
                <p className={textSecondary}>For questions about these terms, contact us at <span className="text-blue-400">support@learntrack.com</span></p>
              </div>
            </div>
          )}

          {/* Privacy Policy */}
          {activeTab === 'privacy' && (
            <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} space-y-8`}>
              <div>
                <h2 className={`text-2xl font-bold mb-4 ${textPrimary}`}>Privacy Policy</h2>
                <p className={textSecondary}>Your privacy is important to us. This policy explains how we collect, use and protect your information.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3 text-blue-400">1. Information We Collect</h3>
                <div className={`${textSecondary} space-y-2`}>
                  <p>Account information — name, email address and password (encrypted).</p>
                  <p>Profile information — avatar and other optional profile details.</p>
                  <p>Usage data — courses viewed, progress, quiz results and certificates earned.</p>
                  <p>Discussion forum posts and replies you create.</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3 text-blue-400">2. How We Use Your Information</h3>
                <div className={`${textSecondary} space-y-2`}>
                  <p>To provide and improve the LearnTrack platform.</p>
                  <p>To track your learning progress and generate certificates.</p>
                  <p>To send important notifications such as certificate emails.</p>
                  <p>To respond to your support requests.</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3 text-blue-400">3. Data Security</h3>
                <div className={`${textSecondary} space-y-2`}>
                  <p>Passwords are encrypted using industry-standard bcrypt hashing.</p>
                  <p>All API requests are authenticated using JWT tokens.</p>
                  <p>We do not share your personal data with third parties.</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3 text-blue-400">4. Cookies</h3>
                <p className={`${textSecondary} leading-relaxed`}>LearnTrack uses localStorage to store your session token. We do not use tracking cookies or third-party analytics.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3 text-blue-400">5. Your Rights</h3>
                <div className={`${textSecondary} space-y-2`}>
                  <p>You can update your profile information at any time.</p>
                  <p>You can delete your account and all associated data.</p>
                  <p>You can request a copy of your data by contacting us.</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3 text-blue-400">6. Data Retention</h3>
                <p className={`${textSecondary} leading-relaxed`}>We retain your data as long as your account is active. When you delete your account, all personal data is permanently removed within 30 days.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3 text-blue-400">7. Children's Privacy</h3>
                <p className={`${textSecondary} leading-relaxed`}>LearnTrack is not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3 text-blue-400">8. Contact</h3>
                <p className={textSecondary}>For privacy questions, contact us at <span className="text-blue-400">privacy@learntrack.com</span></p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <footer className={`${cardBg} border-t ${borderColor} py-6 px-6 text-center ${textSecondary} text-sm`}>
        <p>© 2026 LearnTrack — All rights reserved</p>
      </footer>
    </div>
  );
}

export default TermsAndPrivacy;