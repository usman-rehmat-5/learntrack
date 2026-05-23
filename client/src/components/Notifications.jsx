import { useState, useEffect } from 'react';
import { MdCheckCircle, MdInfo, MdWarning, MdClose } from 'react-icons/md';

let addNotificationFn = null;

export function notify(message, type = 'success') {
  if (addNotificationFn) addNotificationFn(message, type);
}

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    addNotificationFn = (message, type) => {
      const id = Date.now();
      setNotifications(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 4000);
    };
    return () => { addNotificationFn = null; };
  }, []);

  const getIcon = (type) => {
    if (type === 'success') return <MdCheckCircle className="text-xl shrink-0" />;
    if (type === 'error') return <MdWarning className="text-xl shrink-0" />;
    return <MdInfo className="text-xl shrink-0" />;
  };

  const getColor = (type) => {
    if (type === 'success') return 'bg-green-900 border-green-700 text-green-300';
    if (type === 'error') return 'bg-red-900 border-red-700 text-red-300';
    return 'bg-blue-900 border-blue-700 text-blue-300';
  };

  const remove = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 w-80">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${getColor(n.type)} animate-pulse-once`}
        >
          {getIcon(n.type)}
          <p className="flex-1 text-sm font-medium">{n.message}</p>
          <button onClick={() => remove(n.id)} className="opacity-70 hover:opacity-100 transition">
            <MdClose />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Notifications;