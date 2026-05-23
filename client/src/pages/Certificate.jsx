import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function Certificate() {
  const { fieldId, trackId } = useParams();
  const navigate = useNavigate();
  const { user, token, api } = useAuth();
  const { isDark } = useTheme();
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);

  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';

  useEffect(() => {
    fetchTrack();
  }, [trackId]);

  const fetchTrack = async () => {
    try {
      const res = await api.get(`/admin/fields/${fieldId}/tracks`);
      const found = res.data.find(t => t._id === trackId);
      setTrack(found);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className={`min-h-screen ${bgPrimary} flex items-center justify-center`}>
        <p className={textSecondary}>Loading...</p>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto px-6 py-10 ${bgPrimary} ${textPrimary} transition-colors duration-300`}>

      {/* Back + Download */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <button onClick={() => navigate(`/field/${fieldId}/track/${trackId}`)} className={`${textSecondary} hover:${textPrimary} flex items-center gap-2 transition`}>
          ← Back to Track
        </button>
        <button
          onClick={handlePrint}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition"
        >
          Download / Print
        </button>
      </div>

      {/* Certificate */}
      <div className="bg-white text-gray-900 p-16 rounded-3xl shadow-2xl relative overflow-hidden">

        {/* Border Design */}
        <div className="absolute inset-0 border-8 border-blue-600 rounded-3xl m-4 pointer-events-none"></div>
        <div className="absolute inset-0 border-2 border-blue-300 rounded-3xl m-6 pointer-events-none"></div>

        {/* Top */}
        <div className="flex justify-between items-start mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">LT</span>
          </div>
          <div className="text-center">
            <p className="text-blue-600 font-bold text-lg tracking-widest uppercase">LearnTrack</p>
            <p className="text-gray-500 text-sm">Certificate of Completion</p>
          </div>
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">✓</span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent mb-10"></div>

        {/* Main Content */}
        <div className="text-center mb-10">
          <p className="text-gray-500 text-lg mb-4 tracking-wide uppercase">This is to certify that</p>
          <h2 className="text-5xl font-bold text-gray-900 mb-4 font-serif">{user?.name}</h2>
          <p className="text-gray-500 text-lg mb-4 tracking-wide uppercase">has successfully completed</p>
          <h3 className="text-3xl font-bold text-blue-600 mb-2">
            {track?.name || trackId.replace(/-/g, ' ').toUpperCase()}
          </h3>
          <p className="text-gray-500">on the LearnTrack platform</p>
        </div>

        {/* Divider */}
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent mb-10"></div>

        {/* Bottom */}
        <div className="flex justify-between items-end">
          <div className="text-center">
            <div className="w-40 h-0.5 bg-gray-400 mb-2"></div>
            <p className="text-gray-600 text-sm">Date of Completion</p>
            <p className="text-gray-800 font-semibold">{today}</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white text-3xl">★</span>
            </div>
            <p className="text-blue-600 font-bold text-sm">Verified</p>
          </div>
          <div className="text-center">
            <div className="w-40 h-0.5 bg-gray-400 mb-2"></div>
            <p className="text-gray-600 text-sm">Authorized by</p>
            <p className="text-gray-800 font-semibold">LearnTrack</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Certificate;