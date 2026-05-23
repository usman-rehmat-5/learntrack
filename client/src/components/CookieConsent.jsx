import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-gray-800 border-t border-gray-700 p-4 animate-slide-up">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm text-gray-300 flex-1">
          We use cookies to improve your experience. By using LearnTrack, you agree to our{' '}
          <button onClick={() => navigate('/cookies')} className="text-blue-400 hover:underline">Cookie Policy</button>.
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => navigate('/cookies')}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
          >
            Learn More
          </button>
          <button
            onClick={accept}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
