import { useState, useEffect } from 'react';
import { MdDownload } from 'react-icons/md';

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setShow(false);
    }
    setDeferredPrompt(null);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-800 border border-blue-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-md w-full mx-4">
      <div className="flex-1">
        <p className="font-bold text-sm">Install LearnTrack</p>
        <p className="text-xs text-gray-400">Get the app experience!</p>
      </div>
      <button
        onClick={handleInstall}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold transition"
      >
        <MdDownload /> Install
      </button>
      <button
        onClick={() => setShow(false)}
        className="text-gray-400 hover:text-white text-xl transition"
      >
        &times;
      </button>
    </div>
  );
}

export default InstallPrompt;
