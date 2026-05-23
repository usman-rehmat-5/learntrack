import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MdSearch } from 'react-icons/md';

function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ fields: [], tracks: [] });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { api } = useAuth();
  const { isDark } = useTheme();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get(`/admin/search?q=${query}`);
      setResults(res.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDark ? 'bg-gray-800' : 'bg-white';

  return (
    <div className={`min-h-screen ${bgPrimary} transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Search Box */}
        <div className="mb-8">
          <h2 className={`text-3xl font-bold mb-6 ${textPrimary}`}>Search</h2>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <MdSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${textSecondary} text-xl`} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search fields and tracks..."
                className={`w-full pl-12 pr-4 py-4 rounded-2xl ${inputBg} ${textPrimary} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg`}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`px-8 py-4 rounded-2xl font-semibold transition ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white disabled:opacity-50`}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Results */}
        {searched && (
          <div>
            {loading ? (
              <div className="text-center py-10">
                <p className={textSecondary}>Searching...</p>
              </div>
            ) : results.fields.length === 0 && results.tracks.length === 0 ? (
              <div className={`text-center py-10 ${cardBg} rounded-2xl border ${borderColor}`}>
                <p className={`text-xl ${textSecondary}`}>No results found for "{query}"</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Fields */}
                {results.fields.length > 0 && (
                  <div>
                    <h3 className={`text-xl font-bold mb-4 ${textPrimary}`}>Fields ({results.fields.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.fields.map((field) => (
                        <div
                          key={field._id}
                          onClick={() => navigate(`/field/${field._id}`)}
                          className={`${cardBg} p-5 rounded-2xl border ${borderColor} cursor-pointer hover:border-blue-500 transition`}
                        >
                          <h4 className={`font-bold text-lg ${textPrimary}`}>{field.name}</h4>
                          <p className={`text-sm ${textSecondary}`}>{field.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tracks */}
                {results.tracks.length > 0 && (
                  <div>
                    <h3 className={`text-xl font-bold mb-4 ${textPrimary}`}>Tracks ({results.tracks.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.tracks.map((track) => (
                        <div
                          key={track._id}
                          onClick={() => navigate(`/field/${track.fieldId?._id || track.fieldId}/track/${track._id}`)}
                          className={`${cardBg} p-5 rounded-2xl border ${borderColor} cursor-pointer hover:border-blue-500 transition`}
                        >
                          <h4 className={`font-bold text-lg ${textPrimary}`}>{track.name}</h4>
                          <p className={`text-sm ${textSecondary}`}>{track.description}</p>
                          <p className={`text-xs mt-2 ${textSecondary}`}>Field: {track.fieldId?.name || 'Unknown'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Initial State */}
        {!searched && (
          <div className={`text-center py-20 ${cardBg} rounded-2xl border ${borderColor}`}>
            <MdSearch className={`text-6xl mx-auto mb-4 opacity-30 ${textSecondary}`} />
            <p className={`text-xl ${textSecondary}`}>Search for fields and tracks</p>
            <p className={`text-sm ${textSecondary}`}>Enter a keyword to find learning paths</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;