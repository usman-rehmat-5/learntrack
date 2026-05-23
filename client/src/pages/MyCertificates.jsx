import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaAward } from 'react-icons/fa';
import { MdDownload, MdVerified } from 'react-icons/md';

function MyCertificates() {
  const navigate = useNavigate();
  const { user, token, api } = useAuth();
  const { isDark } = useTheme();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await api.get('/certificates/my');
      setCertificates(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className={`max-w-5xl mx-auto px-6 py-10 ${bgPrimary} ${textPrimary} transition-colors duration-300`}>

      {/* Header */}
      <div className="mb-8">
        <h2 className={`text-3xl font-bold mb-2 flex items-center gap-3 ${textPrimary}`}>
          <FaAward className="text-yellow-400" />
          My Certificates
        </h2>
        <p className={textSecondary}>Your earned certificates of completion</p>
      </div>

      {loading ? (
        <div className={`text-center py-20 ${textSecondary}`}>Loading...</div>
      ) : certificates.length === 0 ? (
        <div className={`text-center py-20 ${textSecondary}`}>
          <FaAward className="text-6xl mx-auto mb-4 opacity-30" />
          <p className="text-xl mb-2">No certificates yet</p>
          <p className="text-sm">Complete all lectures and pass the quiz to earn a certificate</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition"
          >
            Start Learning
          </button>
        </div>
      ) : (
        <>
          {/* Certificates Grid */}
          {!selected && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {certificates.map((cert) => (
                <div
                  key={cert._id}
                  className={`${cardBg} p-6 rounded-2xl border ${borderColor} hover:border-yellow-500 transition cursor-pointer`}
                  onClick={() => setSelected(cert)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-yellow-900 rounded-xl flex items-center justify-center">
                      <FaAward className="text-yellow-400 text-2xl" />
                    </div>
                    <div className="flex items-center gap-1 text-green-400 text-sm">
                      <MdVerified className="text-lg" />
                      Verified
                    </div>
                  </div>
                  <h3 className={`text-xl font-bold mb-1 ${textPrimary}`}>{cert.trackName}</h3>
                  <p className={`${textSecondary} text-sm mb-3`}>{cert.fieldName}</p>
                  <div className="flex justify-between items-center">
                    <p className={`${textSecondary} text-xs`}>ID: {cert.certificateId}</p>
                    <p className={`${textSecondary} text-xs`}>{formatDate(cert.issuedAt)}</p>
                  </div>
                  <button className="mt-4 w-full py-2 bg-yellow-600 hover:bg-yellow-700 rounded-xl text-sm font-semibold transition">
                    View Certificate
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Certificate View */}
          {selected && (
            <div>
              {/* Back + Download */}
              <div className="flex justify-between items-center mb-6 print:hidden">
                <button
                  onClick={() => setSelected(null)}
                  className={`${textSecondary} hover:${textPrimary} flex items-center gap-2 transition`}
                >
                  ← Back to Certificates
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition"
                >
                  <MdDownload /> Download / Print
                </button>
              </div>

              {/* Certificate Design */}
              <div className="bg-white text-gray-900 p-16 rounded-3xl shadow-2xl relative overflow-hidden">
                {/* Border */}
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
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                    <MdVerified className="text-white text-3xl" />
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent mb-10"></div>

                {/* Main */}
                <div className="text-center mb-10">
                  <p className="text-gray-500 text-lg mb-4 tracking-wide uppercase">This is to certify that</p>
                  <h2 className="text-5xl font-bold text-gray-900 mb-4 font-serif">{selected.userName}</h2>
                  <p className="text-gray-500 text-lg mb-4 tracking-wide uppercase">has successfully completed</p>
                  <h3 className="text-3xl font-bold text-blue-600 mb-2">{selected.trackName}</h3>
                  <p className="text-gray-500">{selected.fieldName} — LearnTrack Platform</p>
                </div>

                {/* Divider */}
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent mb-10"></div>

                {/* Bottom */}
                <div className="flex justify-between items-end">
                  <div className="text-center">
                    <div className="w-40 h-0.5 bg-gray-400 mb-2"></div>
                    <p className="text-gray-600 text-sm">Date of Completion</p>
                    <p className="text-gray-800 font-semibold">{formatDate(selected.issuedAt)}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FaAward className="text-white text-4xl" />
                    </div>
                    <p className="text-yellow-600 font-bold text-sm">Certificate ID</p>
                    <p className="text-gray-600 text-xs">{selected.certificateId}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-40 h-0.5 bg-gray-400 mb-2"></div>
                    <p className="text-gray-600 text-sm">Authorized by</p>
                    <p className="text-gray-800 font-semibold">LearnTrack</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MyCertificates;