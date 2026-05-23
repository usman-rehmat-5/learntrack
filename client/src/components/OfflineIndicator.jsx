import { useState, useEffect } from 'react';
import { MdWifiOff } from 'react-icons/md';

function OfflineIndicator() {
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

  if (!isOffline) return null;

  return (
    <div className="sticky top-16 z-[60] bg-yellow-600 text-white text-center py-2 px-4 flex items-center justify-center gap-2 text-sm font-semibold shadow-lg">
      <MdWifiOff className="text-lg" />
      You are offline. Some features may be limited.
    </div>
  );
}

export default OfflineIndicator;
