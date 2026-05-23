import { useNavigate } from 'react-router-dom';

function CookiePolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto py-12">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-400 hover:text-blue-300 mb-6 inline-flex items-center gap-1"
        >
          &larr; Back
        </button>
        <h1 className="text-4xl font-bold mb-2">Cookie Policy</h1>
        <p className="text-gray-400 mb-8">Last updated: May 2026</p>

        <section className="space-y-6 text-gray-300">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">What Are Cookies</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and improve your experience.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">How We Use Cookies</h2>
            <p>LearnTrack uses cookies for the following purposes:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Authentication:</strong> To keep you logged in across sessions</li>
              <li><strong>Preferences:</strong> To remember your theme and language settings</li>
              <li><strong>Performance:</strong> To analyze how you use the platform and improve it</li>
              <li><strong>Security:</strong> To protect your account and detect suspicious activity</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Types of Cookies We Use</h2>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Essential:</strong> Required for the platform to function (auth, security)</li>
              <li><strong>Preference:</strong> Remember your settings (theme, language)</li>
              <li><strong>Analytics:</strong> Help us understand usage patterns (optional)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Third-Party Cookies</h2>
            <p>We do not use third-party tracking cookies. All cookies are strictly related to the functionality of LearnTrack.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Managing Cookies</h2>
            <p>You can control or delete cookies through your browser settings. Note that disabling essential cookies may affect platform functionality.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Contact Us</h2>
            <p>If you have questions about our cookie policy, please <button onClick={() => navigate('/contact')} className="text-blue-400 hover:underline">contact us</button>.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default CookiePolicy;
