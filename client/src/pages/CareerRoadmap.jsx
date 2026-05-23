import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MdSearch, MdTimeline, MdSchool, MdTrendingUp } from 'react-icons/md';
import { FaGraduationCap, FaLock } from 'react-icons/fa';
import RoadmapTree, { SubFieldCard, CareerPathCard } from '../components/RoadmapTree';
import FieldIcon from '../components/FieldIcon';

function CareerRoadmap() {
  const navigate = useNavigate();
  const { token, activeEnrollment, api } = useAuth();
  const { isDark } = useTheme();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedField, setSelectedField] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/roadmap/careers');
      setFields(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  const filteredFields = fields.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.subFields?.some(sf => sf.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (selectedField) {
    return (
      <FieldDetailView
        field={selectedField}
        onBack={() => setSelectedField(null)}
        isDark={isDark}
        token={token}
        navigate={navigate}
        activeEnrollment={activeEnrollment}
      />
    );
  }

  return (
    <div className={`min-h-screen ${bgPrimary} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MdTimeline className="text-3xl text-blue-500" />
            <h2 className={`text-3xl font-bold ${textPrimary}`}>Career Roadmaps</h2>
          </div>
          <p className={textSecondary}>Choose your career path and follow the structured learning roadmap</p>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className={`flex-1 flex items-center gap-2 ${cardBg} px-4 py-2.5 rounded-xl border ${borderColor} focus-within:border-blue-500 transition`}>
            <MdSearch className={`${textSecondary} text-lg`} />
            <input
              type="text"
              placeholder="Search fields or sub-fields..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`flex-1 bg-transparent ${textPrimary} placeholder-gray-400 focus:outline-none text-sm`}
            />
          </div>
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''
              } ${textPrimary}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''
              } ${textPrimary}`}
            >
              List
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={`h-48 ${cardBg} rounded-2xl animate-pulse`}></div>
            ))}
          </div>
        ) : filteredFields.length === 0 ? (
          <div className={`text-center py-20 ${textSecondary}`}>
            <MdSchool className="text-6xl mx-auto mb-4 opacity-30" />
            <p className="text-xl">No fields found</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFields.map((field) => {
              const isActiveField = activeEnrollment?.enrolled && activeEnrollment.field?._id === field._id;
              const isLocked = activeEnrollment?.enrolled && !isActiveField;

              return (
                <div
                  key={field._id}
                  onClick={() => !isLocked && setSelectedField(field)}
                  className={`relative group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                    isActiveField
                      ? 'ring-2 ring-blue-500 shadow-lg'
                      : isLocked
                      ? 'opacity-60'
                      : 'hover:shadow-xl hover:-translate-y-1'
                  }`}
                >
                  {/* Banner */}
                  <div className={`h-28 ${field.bannerColor || 'bg-gradient-to-br from-blue-600 to-purple-700'} p-5 flex items-end`}>
                    <div className="flex items-center gap-3">
                      <FieldIcon name={field.icon} className="text-4xl" />
                      <div>
                        <h3 className="text-white font-bold text-lg">{field.name}</h3>
                        {field.totalDuration && (
                          <p className="text-white/80 text-xs">{field.totalDuration}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 ${cardBg}`}>
                    <p className={`text-xs ${textSecondary} line-clamp-2 mb-3`}>{field.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {field.subFields?.slice(0, 4).map((sf, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                          <FieldIcon name={sf.icon} className="mr-0.5 inline" /> {sf.name}
                        </span>
                      ))}
                      {(field.subFields?.length || 0) > 4 && (
                        <span className="text-[10px] text-blue-500">+{field.subFields.length - 4} more</span>
                      )}
                    </div>
                    {isActiveField && (
                      <span className="inline-block mt-2 text-xs text-blue-500 font-semibold">Active Learning Path</span>
                    )}
                  </div>

                  {isLocked && (
                    <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-[1px] flex items-center justify-center">
                      <div className="text-center">
                        <FaLock className="text-2xl text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Complete current course first</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFields.map((field) => {
              const isActiveField = activeEnrollment?.enrolled && activeEnrollment.field?._id === field._id;
              const isLocked = activeEnrollment?.enrolled && !isActiveField;

              return (
                <div
                  key={field._id}
                  onClick={() => !isLocked && setSelectedField(field)}
                  className={`${cardBg} p-4 rounded-2xl border ${borderColor} cursor-pointer transition ${
                    isActiveField ? 'ring-2 ring-blue-500' : isLocked ? 'opacity-50' : 'hover:border-blue-500'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <FieldIcon name={field.icon} className="text-3xl" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-bold ${textPrimary}`}>{field.name}</h3>
                        {field.difficulty && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500">
                            {field.difficulty}
                          </span>
                        )}
                        {isActiveField && <span className="text-xs text-blue-500">Active</span>}
                      </div>
                      <p className={`text-xs ${textSecondary} mt-0.5`}>{field.description}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{field.subFields?.length || 0} sub-fields · {field.careerPaths?.length || 0} career paths</p>
                    </div>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {field.technologies?.slice(0, 4).map((t, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function FieldDetailView({ field, onBack, isDark, token, navigate, activeEnrollment }) {
  const [activeTab, setActiveTab] = useState('roadmap');

  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  const isLocked = activeEnrollment?.enrolled && activeEnrollment.field?._id !== field._id;

  const tabs = [
    { id: 'roadmap', label: 'Roadmap', icon: 'timeline' },
    { id: 'subfields', label: 'Sub-Fields', icon: 'folder' },
    { id: 'careers', label: 'Career Paths', icon: 'star' },
    { id: 'technologies', label: 'Technologies', icon: 'cogs' }
  ];

  return (
    <div className={`min-h-screen ${bgPrimary} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-6 py-8">

        <button onClick={onBack} className={`mb-6 flex items-center gap-2 transition ${textSecondary} hover:${textPrimary}`}>
          ← Back to All Roadmaps
        </button>

        {/* Field Header */}
        <div className={`${field.bannerColor || 'bg-gradient-to-br from-blue-600 to-purple-700'} rounded-2xl p-8 mb-6 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-3">
              <FieldIcon name={field.icon} className="text-5xl" />
              <div>
                <h2 className="text-3xl font-bold text-white">{field.name}</h2>
                <p className="text-white/80 text-sm mt-1">{field.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {field.totalDuration && (
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">
                  {field.totalDuration}
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">
                {field.subFields?.length || 0} Sub-Fields
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">
                {field.careerPaths?.length || 0} Career Paths
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium capitalize">
                {field.difficulty || 'All Levels'}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-200 dark:bg-gray-700 p-1 rounded-xl">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <FieldIcon name={tab.icon} className="mr-1 inline" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'roadmap' && (
          <div className={`${cardBg} rounded-2xl border ${borderColor} p-6`}>
            <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${textPrimary}`}>
              <MdTimeline className="text-blue-500" /> Learning Roadmap
            </h3>
            {field.roadmap?.length > 0 ? (
              <RoadmapTree
                steps={field.roadmap}
                progress={[]}
                isLocked={isLocked}
              />
            ) : (
              <p className={`text-sm ${textSecondary} py-8 text-center`}>Roadmap details coming soon</p>
            )}
          </div>
        )}

        {activeTab === 'subfields' && (
          <div>
            <h3 className={`text-lg font-bold mb-4 ${textPrimary}`}>Sub-Fields & Tracks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {field.subFields?.map((sf, i) => (
                <SubFieldCard key={i} subField={sf} isLocked={isLocked} />
              ))}
              {(!field.subFields || field.subFields.length === 0) && (
                <p className={`text-sm ${textSecondary} col-span-full text-center py-8`}>No sub-fields available</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'careers' && (
          <div>
            <h3 className={`text-lg font-bold mb-4 ${textPrimary}`}>Career Paths & Opportunities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {field.careerPaths?.map((cp, i) => (
                <CareerPathCard key={i} path={cp} />
              ))}
              {(!field.careerPaths || field.careerPaths.length === 0) && (
                <p className={`text-sm ${textSecondary} col-span-full text-center py-8`}>No career paths available</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'technologies' && (
          <div className={`${cardBg} rounded-2xl border ${borderColor} p-6`}>
            <h3 className={`text-lg font-bold mb-4 ${textPrimary}`}>Technologies You'll Learn</h3>
            {field.technologies?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {field.technologies.map((tech, i) => (
                  <span key={i} className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-medium text-sm border border-blue-200 dark:border-blue-800">
                    {tech}
                  </span>
                ))}
              </div>
            ) : (
              <p className={`text-sm ${textSecondary} py-8 text-center`}>No technologies listed</p>
            )}
            {field.prerequisites?.length > 0 && (
              <>
                <h4 className={`font-semibold mt-6 mb-2 text-sm ${textPrimary}`}>Prerequisites</h4>
                <ul className="list-disc list-inside space-y-1">
                  {field.prerequisites.map((p, i) => (
                    <li key={i} className={`text-sm ${textSecondary}`}>{p}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CareerRoadmap;
