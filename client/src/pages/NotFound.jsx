import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NotFound() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-blue-400 mb-4">404</h1>
        <p className="text-2xl font-semibold mb-2">Page Not Found</p>
        <p className="text-gray-400 mb-6">The page you are looking for does not exist.</p>
        <button
          onClick={() => navigate(user ? '/dashboard' : '/')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition"
        >
          {user ? 'Go to Dashboard' : 'Go Home'}
        </button>
      </div>
    </div>
  );
}

export default NotFound;
