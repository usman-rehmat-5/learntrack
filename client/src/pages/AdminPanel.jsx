import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MdDashboard, MdAdd, MdDelete, MdEdit, MdBook, MdAnnouncement, MdPeople, MdWorkspacePremium } from 'react-icons/md';
import { FaLayerGroup, FaRoad, FaBullhorn, FaUserGraduate, FaCrown } from 'react-icons/fa';
import CourseManager from '../components/CourseManager';
import QuizManager from '../components/QuizManager';

function AdminPanel() {
  const navigate = useNavigate();
  const { user, token, api } = useAuth();
  const { isDark } = useTheme();

  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDark ? 'bg-gray-700' : 'bg-white';
  const tabActive = isDark ? 'bg-blue-600' : 'bg-blue-500';
  const tabInactive = isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100';
  const innerCardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const inputFieldBg = isDark ? 'bg-gray-700' : 'bg-gray-100';
  const sectionBg = isDark ? 'bg-gray-700' : 'bg-gray-100';
  const secondaryBtn = isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400';
  const placeholderColor = isDark ? 'placeholder-gray-400' : 'placeholder-gray-500';

  const [activeTab, setActiveTab] = useState('fields');
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);

  // Add forms
  const [fieldForm, setFieldForm] = useState({ name: '', description: '' });
  const [trackForm, setTrackForm] = useState({ name: '', description: '' });
  const [roadmapForm, setRoadmapForm] = useState({ title: '', desc: '', status: 'required' });

  const [showFieldForm, setShowFieldForm] = useState(false);
  const [showTrackForm, setShowTrackForm] = useState(false);
  const [showRoadmapForm, setShowRoadmapForm] = useState(false);

  // Edit states
  const [editingField, setEditingField] = useState(null);
  const [editingTrack, setEditingTrack] = useState(null);
  const [editingRoadmapStep, setEditingRoadmapStep] = useState(null);
  const [editFieldForm, setEditFieldForm] = useState({ name: '', description: '' });
  const [editTrackForm, setEditTrackForm] = useState({ name: '', description: '' });
  const [editRoadmapForm, setEditRoadmapForm] = useState({ title: '', desc: '', status: 'required' });

  // Announcement state
  const [announcements, setAnnouncements] = useState([]);
  const [annForm, setAnnForm] = useState({ title: '', content: '', priority: 'normal' });
  const [showAnnForm, setShowAnnForm] = useState(false);

  // User progress state
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userProgress, setUserProgress] = useState(null);

  // Premium management state
  const [premiumCourses, setPremiumCourses] = useState([]);
  const [premiumLectures, setPremiumLectures] = useState([]);
  const [premiumUsers, setPremiumUsers] = useState([]);
  const [premiumMsg, setPremiumMsg] = useState('');

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      navigate('/dashboard');
    }
    if (token) fetchFields();
  }, [token]);

  const fetchFields = async () => {
    try {
      const res = await api.get('/admin/fields');
      setFields(res.data);
    } catch (err) { console.log(err); }
  };

  const fetchTracks = async (fieldId) => {
    try {
      const res = await api.get(`/admin/fields/${fieldId}/tracks`);
      setTracks(res.data);
    } catch (err) { console.log(err); }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/announcements/all');
      setAnnouncements(res.data);
    } catch (err) { console.log(err); }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) { console.log(err); }
  };

  const fetchPremiumContent = async () => {
    try {
      const res = await api.get('/admin/premium-content');
      setPremiumCourses(res.data.premiumCourses || []);
      setPremiumLectures(res.data.premiumLectures || []);
    } catch (err) { console.log(err); }
  };

  const fetchPremiumUsers = async () => {
    try {
      const res = await api.get('/subscription/users');
      setPremiumUsers(res.data);
    } catch (err) { console.log(err); }
  };

  const toggleCoursePremium = async (courseId, isPremium) => {
    try {
      await api.put(`/admin/courses/${courseId}/toggle-premium`, { isPremium: !isPremium });
      fetchPremiumContent();
      setPremiumMsg(`Course updated`);
      setTimeout(() => setPremiumMsg(''), 3000);
    } catch (err) { console.log(err); }
  };

  const toggleLecturePremium = async (lectureId, isPremium) => {
    try {
      await api.put(`/admin/lectures/${lectureId}/toggle-premium`, { isPremium: !isPremium });
      fetchPremiumContent();
      setPremiumMsg(`Lecture updated`);
      setTimeout(() => setPremiumMsg(''), 3000);
    } catch (err) { console.log(err); }
  };

  const setUserPremium = async (userId, tier, durationDays) => {
    try {
      await api.put(`/subscription/users/${userId}`, { tier, durationDays });
      fetchPremiumUsers();
      setPremiumMsg(`User ${tier === 'premium' ? 'upgraded to premium' : 'downgraded to free'}`);
      setTimeout(() => setPremiumMsg(''), 3000);
    } catch (err) { console.log(err); }
  };

  const fetchUserProgress = async (userId) => {
    try {
      const res = await api.get(`/admin/users/${userId}/progress`);
      setUserProgress(res.data);
      setSelectedUser(userId);
    } catch (err) { console.log(err); }
  };

  // Field handlers
  const handleAddField = async () => {
    if (!fieldForm.name) return;
    try {
      await api.post('/admin/fields', fieldForm);
      setFieldForm({ name: '', description: '' });
      setShowFieldForm(false);
      fetchFields();
    } catch (err) { console.log(err); }
  };

  const handleAddTrack = async () => {
    if (!trackForm.name || !selectedField) return;
    try {
      await api.post(`/admin/fields/${selectedField._id}/tracks`, trackForm);
      setTrackForm({ name: '', description: '' });
      setShowTrackForm(false);
      fetchTracks(selectedField._id);
    } catch (err) { console.log(err); }
  };

  const handleAddRoadmapStep = async () => {
    if (!roadmapForm.title || !selectedTrack) return;
    try {
      const res = await api.post(`/admin/tracks/${selectedTrack._id}/roadmap`, roadmapForm);
      setSelectedTrack(res.data);
      setRoadmapForm({ title: '', desc: '', status: 'required' });
      setShowRoadmapForm(false);
    } catch (err) { console.log(err); }
  };

  const handleDeleteField = async (id) => {
    if (!confirm('Delete this field and all its tracks?')) return;
    try {
      await api.delete(`/admin/fields/${id}`);
      fetchFields();
      setSelectedField(null);
      setTracks([]);
    } catch (err) { console.log(err); }
  };

  const handleDeleteTrack = async (id) => {
    if (!confirm('Delete this track?')) return;
    try {
      await api.delete(`/admin/tracks/${id}`);
      fetchTracks(selectedField._id);
      setSelectedTrack(null);
    } catch (err) { console.log(err); }
  };

  const handleDeleteRoadmapStep = async (index) => {
    try {
      const res = await api.delete(`/admin/tracks/${selectedTrack._id}/roadmap/${index}`);
      setSelectedTrack(res.data);
    } catch (err) { console.log(err); }
  };

  const handleEditField = async () => {
    try {
      await api.put(`/admin/fields/${editingField}`, editFieldForm);
      setEditingField(null);
      fetchFields();
    } catch (err) { console.log(err); }
  };

  const handleEditTrack = async () => {
    try {
      await api.put(`/admin/tracks/${editingTrack}`, editTrackForm);
      setEditingTrack(null);
      fetchTracks(selectedField._id);
    } catch (err) { console.log(err); }
  };

  const handleEditRoadmapStep = async (index) => {
    try {
      const updatedRoadmap = [...selectedTrack.roadmap];
      updatedRoadmap[index] = { ...updatedRoadmap[index], ...editRoadmapForm };
      const res = await api.put(`/admin/tracks/${selectedTrack._id}`, { roadmap: updatedRoadmap });
      setSelectedTrack(res.data);
      setEditingRoadmapStep(null);
    } catch (err) { console.log(err); }
  };

  // Announcement handlers
  const handleAddAnnouncement = async () => {
    if (!annForm.title || !annForm.content) return;
    try {
      await api.post('/announcements', annForm);
      setAnnForm({ title: '', content: '', priority: 'normal' });
      setShowAnnForm(false);
      fetchAnnouncements();
    } catch (err) { console.log(err); }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!confirm('Delete this announcement?')) return;
    try {
      await api.delete(`/announcements/${id}`);
      fetchAnnouncements();
    } catch (err) { console.log(err); }
  };

  // Select handlers
  const handleSelectField = (field) => {
    setSelectedField(field);
    setSelectedTrack(null);
    setActiveTab('tracks');
    fetchTracks(field._id);
  };

  const handleSelectTrack = (track) => {
    setSelectedTrack(track);
    setActiveTab('roadmap');
  };

  return (
    <div className={`min-h-screen ${bgPrimary} ${textPrimary} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <button onClick={() => setActiveTab('fields')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition ${activeTab === 'fields' ? tabActive : tabInactive} ${textPrimary}`}>
            <MdDashboard /> Fields
          </button>
          <button onClick={() => setActiveTab('tracks')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition ${activeTab === 'tracks' ? tabActive : tabInactive} ${textPrimary}`}>
            <FaLayerGroup /> Tracks {selectedField && `(${selectedField.name})`}
          </button>
          <button onClick={() => setActiveTab('roadmap')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition ${activeTab === 'roadmap' ? tabActive : tabInactive} ${textPrimary}`}>
            <FaRoad /> Roadmap {selectedTrack && `(${selectedTrack.name})`}
          </button>
          <button onClick={() => setActiveTab('courses')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition ${activeTab === 'courses' ? tabActive : tabInactive} ${textPrimary}`}>
            <MdBook /> Courses {selectedTrack && `(${selectedTrack.name})`}
          </button>
          <button onClick={() => setActiveTab('quiz')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition ${activeTab === 'quiz' ? tabActive : tabInactive} ${textPrimary}`}>
            <MdBook /> Quiz {selectedTrack && `(${selectedTrack.name})`}
          </button>
          <button onClick={() => { setActiveTab('announcements'); fetchAnnouncements(); }} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition ${activeTab === 'announcements' ? tabActive : tabInactive} ${textPrimary}`}>
            <MdAnnouncement /> Announcements
          </button>
          <button onClick={() => { setActiveTab('users'); fetchUsers(); }} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition ${activeTab === 'users' ? tabActive : tabInactive} ${textPrimary}`}>
            <MdPeople /> Users
          </button>
          <button onClick={() => { setActiveTab('premium'); fetchPremiumContent(); fetchPremiumUsers(); }} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition ${activeTab === 'premium' ? tabActive : tabInactive} ${textPrimary}`}>
            <FaCrown style={{ color: '#F59E0B' }} /> Premium
          </button>
        </div>

        {/* FIELDS TAB */}
        {activeTab === 'fields' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">All Fields</h2>
              <button onClick={() => setShowFieldForm(!showFieldForm)} className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition">
                <MdAdd className="text-xl" /> Add Field
              </button>
            </div>
            {showFieldForm && (
              <div className={`${innerCardBg} p-6 rounded-2xl mb-6 border ${borderColor}`}>
                <h3 className={`text-lg font-bold mb-4 ${textPrimary}`}>New Field</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Field Name" value={fieldForm.name} onChange={(e) => setFieldForm({ ...fieldForm, name: e.target.value })} className={`px-4 py-3 rounded-lg ${inputFieldBg} ${textPrimary} ${placeholderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                  <input type="text" placeholder="Description" value={fieldForm.description} onChange={(e) => setFieldForm({ ...fieldForm, description: e.target.value })} className={`px-4 py-3 rounded-lg ${inputFieldBg} ${textPrimary} ${placeholderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={handleAddField} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition">Add</button>
                  <button onClick={() => setShowFieldForm(false)} className={`px-6 py-2 ${secondaryBtn} rounded-lg transition ${textPrimary}`}>Cancel</button>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fields.length === 0 ? (
                <div className={`col-span-3 text-center py-20 ${textSecondary}`}><p className="text-xl">No fields yet.</p></div>
              ) : (
                fields.map((field) => (
                  <div key={field._id} className={`${innerCardBg} p-6 rounded-2xl border ${borderColor} hover:border-blue-500 transition`}>
                    <h3 className={`text-xl font-bold mb-1 ${textPrimary}`}>{field.name}</h3>
                    <p className={`${textSecondary} text-sm mb-4`}>{field.description || 'No description'}</p>
                    {editingField === field._id ? (
                      <div className="space-y-2 mt-2">
                        <input type="text" value={editFieldForm.name} onChange={(e) => setEditFieldForm({ ...editFieldForm, name: e.target.value })} className={`w-full px-3 py-2 rounded-lg ${inputFieldBg} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                        <input type="text" value={editFieldForm.description} onChange={(e) => setEditFieldForm({ ...editFieldForm, description: e.target.value })} className={`w-full px-3 py-2 rounded-lg ${inputFieldBg} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                        <div className="flex gap-2">
                          <button onClick={handleEditField} className="flex-1 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-semibold transition">Save</button>
                          <button onClick={() => setEditingField(null)} className={`flex-1 py-1.5 ${secondaryBtn} rounded-lg text-sm transition ${textPrimary}`}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => handleSelectField(field)} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition">Manage Tracks</button>
                        <button onClick={() => { setEditingField(field._id); setEditFieldForm({ name: field.name, description: field.description }); }} className={`p-2 ${sectionBg} rounded-lg transition`}><MdEdit className={`${textSecondary} text-lg`} /></button>
                        <button onClick={() => handleDeleteField(field._id)} className="p-2 bg-red-900 hover:bg-red-800 rounded-lg transition"><MdDelete className="text-red-400 text-lg" /></button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TRACKS TAB */}
        {activeTab === 'tracks' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Tracks {selectedField ? `— ${selectedField.name}` : ''}</h2>
              {selectedField && (
                <button onClick={() => setShowTrackForm(!showTrackForm)} className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition">
                  <MdAdd className="text-xl" /> Add Track
                </button>
              )}
            </div>
            {!selectedField ? (
              <div className={`text-center py-20 ${textSecondary}`}><p className="text-xl">Select a field first</p></div>
            ) : (
              <>
                {showTrackForm && (
                  <div className={`${innerCardBg} p-6 rounded-2xl mb-6 border ${borderColor}`}>
                    <h3 className={`text-lg font-bold mb-4 ${textPrimary}`}>New Track</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="Track Name" value={trackForm.name} onChange={(e) => setTrackForm({ ...trackForm, name: e.target.value })} className={`px-4 py-3 rounded-lg ${inputFieldBg} ${textPrimary} ${placeholderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                      <input type="text" placeholder="Description" value={trackForm.description} onChange={(e) => setTrackForm({ ...trackForm, description: e.target.value })} className={`px-4 py-3 rounded-lg ${inputFieldBg} ${textPrimary} ${placeholderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button onClick={handleAddTrack} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition">Add</button>
                      <button onClick={() => setShowTrackForm(false)} className={`px-6 py-2 ${secondaryBtn} rounded-lg transition ${textPrimary}`}>Cancel</button>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {tracks.length === 0 ? (
                    <div className={`col-span-3 text-center py-20 ${textSecondary}`}><p className="text-xl">No tracks yet.</p></div>
                  ) : (
                    tracks.map((track) => (
                      <div key={track._id} className={`${innerCardBg} p-6 rounded-2xl border ${borderColor} hover:border-blue-500 transition`}>
                        <h3 className={`text-xl font-bold mb-1 ${textPrimary}`}>{track.name}</h3>
                        <p className={`${textSecondary} text-sm mb-1`}>{track.description || 'No description'}</p>
                        <p className={`${textSecondary} text-xs mb-4`}>{track.roadmap?.length || 0} roadmap steps</p>
                        {editingTrack === track._id ? (
                          <div className="space-y-2 mt-2">
                            <input type="text" value={editTrackForm.name} onChange={(e) => setEditTrackForm({ ...editTrackForm, name: e.target.value })} className={`w-full px-3 py-2 rounded-lg ${inputFieldBg} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                            <input type="text" value={editTrackForm.description} onChange={(e) => setEditTrackForm({ ...editTrackForm, description: e.target.value })} className={`w-full px-3 py-2 rounded-lg ${inputFieldBg} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                            <div className="flex gap-2">
                              <button onClick={handleEditTrack} className="flex-1 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-semibold transition">Save</button>
                              <button onClick={() => setEditingTrack(null)} className={`flex-1 py-1.5 ${secondaryBtn} rounded-lg text-sm transition ${textPrimary}`}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button onClick={() => handleSelectTrack(track)} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition">Manage Roadmap</button>
                            <button onClick={() => { setEditingTrack(track._id); setEditTrackForm({ name: track.name, description: track.description }); }} className={`p-2 ${sectionBg} rounded-lg transition`}><MdEdit className={`${textSecondary} text-lg`} /></button>
                            <button onClick={() => handleDeleteTrack(track._id)} className="p-2 bg-red-900 hover:bg-red-800 rounded-lg transition"><MdDelete className="text-red-400 text-lg" /></button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ROADMAP TAB */}
        {activeTab === 'roadmap' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Roadmap {selectedTrack ? `— ${selectedTrack.name}` : ''}</h2>
              {selectedTrack && (
                <button onClick={() => setShowRoadmapForm(!showRoadmapForm)} className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition">
                  <MdAdd className="text-xl" /> Add Step
                </button>
              )}
            </div>
            {!selectedTrack ? (
              <div className={`text-center py-20 ${textSecondary}`}><p className="text-xl">Select a track first</p></div>
            ) : (
              <>
                {showRoadmapForm && (
                  <div className={`${innerCardBg} p-6 rounded-2xl mb-6 border ${borderColor}`}>
                    <h3 className={`text-lg font-bold mb-4 ${textPrimary}`}>New Roadmap Step</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="Title" value={roadmapForm.title} onChange={(e) => setRoadmapForm({ ...roadmapForm, title: e.target.value })} className={`px-4 py-3 rounded-lg ${inputFieldBg} ${textPrimary} ${placeholderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                      <input type="text" placeholder="Description" value={roadmapForm.desc} onChange={(e) => setRoadmapForm({ ...roadmapForm, desc: e.target.value })} className={`px-4 py-3 rounded-lg ${inputFieldBg} ${textPrimary} ${placeholderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                      <select value={roadmapForm.status} onChange={(e) => setRoadmapForm({ ...roadmapForm, status: e.target.value })} className={`px-4 py-3 rounded-lg ${inputFieldBg} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                        <option value="required">Required</option>
                        <option value="optional">Optional</option>
                      </select>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button onClick={handleAddRoadmapStep} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition">Add</button>
                      <button onClick={() => setShowRoadmapForm(false)} className={`px-6 py-2 ${secondaryBtn} rounded-lg transition ${textPrimary}`}>Cancel</button>
                    </div>
                  </div>
                )}
                <div className="space-y-3">
                  {selectedTrack.roadmap.length === 0 ? (
                    <div className={`text-center py-20 ${textSecondary}`}><p className="text-xl">No steps yet.</p></div>
                  ) : (
                    selectedTrack.roadmap.map((step, index) => (
                      <div key={index} className={`${innerCardBg} p-5 rounded-xl border ${borderColor}`}>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm shrink-0 text-white">{step.step}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className={`font-semibold text-lg ${textPrimary}`}>{step.title}</h4>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${step.status === 'required' ? (isDark ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-600') : (isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-600')}`}>{step.status}</span>
                            </div>
                            <p className={`${textSecondary} text-sm`}>{step.desc}</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => { setEditingRoadmapStep(index); setEditRoadmapForm({ title: step.title, desc: step.desc, status: step.status }); }} className={`p-2 ${sectionBg} rounded-lg transition`}><MdEdit className={`${textSecondary} text-lg`} /></button>
                            <button onClick={() => handleDeleteRoadmapStep(index)} className="p-2 bg-red-900 hover:bg-red-800 rounded-lg transition"><MdDelete className="text-red-400 text-lg" /></button>
                          </div>
                        </div>
                        {editingRoadmapStep === index && (
                          <div className={`mt-4 space-y-2 border-t ${borderColor} pt-4`}>
                            <input type="text" value={editRoadmapForm.title} onChange={(e) => setEditRoadmapForm({ ...editRoadmapForm, title: e.target.value })} className={`w-full px-3 py-2 rounded-lg ${inputFieldBg} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                            <input type="text" value={editRoadmapForm.desc} onChange={(e) => setEditRoadmapForm({ ...editRoadmapForm, desc: e.target.value })} className={`w-full px-3 py-2 rounded-lg ${inputFieldBg} ${textPrimary} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                            <select value={editRoadmapForm.status} onChange={(e) => setEditRoadmapForm({ ...editRoadmapForm, status: e.target.value })} className={`w-full px-3 py-2 rounded-lg ${inputFieldBg} ${textPrimary} text-sm focus:outline-none`}>
                              <option value="required">Required</option>
                              <option value="optional">Optional</option>
                            </select>
                            <div className="flex gap-2">
                              <button onClick={() => handleEditRoadmapStep(index)} className="flex-1 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-semibold transition">Save</button>
                              <button onClick={() => setEditingRoadmapStep(null)} className={`flex-1 py-1.5 ${secondaryBtn} rounded-lg text-sm transition ${textPrimary}`}>Cancel</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Courses {selectedTrack ? `— ${selectedTrack.name}` : ''}</h2>
            </div>
            {!selectedTrack ? (
              <div className={`text-center py-20 ${textSecondary}`}><p className="text-xl">Select a track first</p></div>
            ) : (
              <CourseManager fieldId={selectedField._id} trackId={selectedTrack._id} />
            )}
          </div>
        )}

        {/* QUIZ TAB */}
        {activeTab === 'quiz' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${textPrimary}`}>Quiz {selectedTrack ? `— ${selectedTrack.name}` : ''}</h2>
            </div>
            {!selectedTrack ? (
              <div className={`text-center py-20 ${textSecondary}`}><p className="text-xl">Select a track first</p></div>
            ) : (
              <QuizManager trackId={selectedTrack._id} />
            )}
          </div>
        )}

        {/* ANNOUNCEMENTS TAB */}
        {activeTab === 'announcements' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Announcements</h2>
              <button onClick={() => setShowAnnForm(!showAnnForm)} className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition">
                <MdAdd className="text-xl" /> New Announcement
              </button>
            </div>

            {showAnnForm && (
              <div className={`${innerCardBg} p-6 rounded-2xl mb-6 border ${borderColor}`}>
                <h3 className={`text-lg font-bold mb-4 ${textPrimary}`}>Create Announcement</h3>
                <div className="space-y-4">
                  <input type="text" placeholder="Title" value={annForm.title} onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })} className={`w-full px-4 py-3 rounded-lg ${inputFieldBg} ${textPrimary} ${placeholderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                  <textarea placeholder="Content" value={annForm.content} onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })} rows={4} className={`w-full px-4 py-3 rounded-lg ${inputFieldBg} ${textPrimary} ${placeholderColor} focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`} />
                  <select value={annForm.priority} onChange={(e) => setAnnForm({ ...annForm, priority: e.target.value })} className={`w-full px-4 py-3 rounded-lg ${inputFieldBg} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={handleAddAnnouncement} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition">Post</button>
                  <button onClick={() => setShowAnnForm(false)} className={`px-6 py-2 ${secondaryBtn} rounded-lg transition ${textPrimary}`}>Cancel</button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {announcements.length === 0 ? (
                <div className={`text-center py-20 ${textSecondary}`}><p className="text-xl">No announcements yet</p></div>
              ) : (
                announcements.map(ann => (
                  <div key={ann._id} className={`${innerCardBg} p-5 rounded-2xl border ${ann.priority === 'high' ? 'border-yellow-500' : borderColor}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <FaBullhorn className={`text-xl mt-1 ${ann.priority === 'high' ? 'text-yellow-400' : 'text-blue-400'}`} />
                        <div>
                          <h4 className={`font-bold ${textPrimary}`}>{ann.title}</h4>
                          <p className={`${textSecondary} text-sm`}>{ann.content}</p>
                          <p className={`text-xs ${textSecondary} mt-1`}>
                            {ann.createdBy?.name || 'Admin'} · {new Date(ann.createdAt).toLocaleDateString()}
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                              ann.priority === 'high' ? 'bg-yellow-100 text-yellow-700' :
                              ann.priority === 'normal' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                            }`}>{ann.priority}</span>
                          </p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteAnnouncement(ann._id)} className="p-2 bg-red-900 hover:bg-red-800 rounded-lg transition shrink-0"><MdDelete className="text-red-400" /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* PREMIUM MANAGEMENT TAB */}
        {activeTab === 'premium' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaCrown className="text-yellow-500" /> Premium Management
            </h2>

            {premiumMsg && (
              <div className="p-3 rounded-xl mb-4 text-sm font-semibold text-white bg-green-600">{premiumMsg}</div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Premium Courses */}
              <div className={`${innerCardBg} p-4 rounded-2xl border ${borderColor}`}>
                <h3 className={`font-bold mb-4 ${textPrimary}`}>Premium Courses ({premiumCourses.length})</h3>
                {premiumCourses.length === 0 ? (
                  <p className={`text-sm ${textSecondary}`}>No premium courses. Mark a course as premium in Courses tab.</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {premiumCourses.map(c => (
                      <div key={c._id} className={`flex items-center justify-between p-2.5 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div>
                          <p className={`text-sm font-semibold ${textPrimary}`}>{c.title}</p>
                          <p className={`text-xs ${textSecondary}`}>{c.trackId?.name || ''}</p>
                        </div>
                        <button onClick={() => toggleCoursePremium(c._id, true)}
                          className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition">
                          Remove Premium
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Premium Lectures */}
              <div className={`${innerCardBg} p-4 rounded-2xl border ${borderColor}`}>
                <h3 className={`font-bold mb-4 ${textPrimary}`}>Premium Lectures ({premiumLectures.length})</h3>
                {premiumLectures.length === 0 ? (
                  <p className={`text-sm ${textSecondary}`}>No premium lectures.</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {premiumLectures.map(l => (
                      <div key={l._id} className={`flex items-center justify-between p-2.5 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div>
                          <p className={`text-sm font-semibold ${textPrimary}`}>{l.title}</p>
                          <p className={`text-xs ${textSecondary}`}>{l.courseId?.title || ''}</p>
                        </div>
                        <button onClick={() => toggleLecturePremium(l._id, true)}
                          className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition">
                          Remove Premium
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Premium Users */}
            <div className={`${innerCardBg} p-4 rounded-2xl border ${borderColor}`}>
              <h3 className={`font-bold mb-4 ${textPrimary}`}>Premium Users ({premiumUsers.length})</h3>
              {premiumUsers.length === 0 ? (
                <p className={`text-sm ${textSecondary}`}>No premium users yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className={`${textSecondary} text-xs uppercase`}>
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">End Date</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {premiumUsers.map(u => (
                        <tr key={u._id || u.id} className={`border-t ${borderColor}`}>
                          <td className="p-2 font-semibold">{u.name}</td>
                          <td className={`p-2 ${textSecondary}`}>{u.email}</td>
                          <td className={`p-2 ${textSecondary}`}>
                            {u.subscriptionEndDate ? new Date(u.subscriptionEndDate).toLocaleDateString() : '-'}
                          </td>
                          <td className="p-2">
                            {u.subscriptionEndDate && new Date(u.subscriptionEndDate) > new Date() ? (
                              <span className="text-green-500 font-semibold">Active</span>
                            ) : (
                              <span className="text-red-500 font-semibold">Expired</span>
                            )}
                          </td>
                          <td className="p-2">
                            <button onClick={() => setUserPremium(u._id || u.id, 'free')}
                              className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition mr-2">
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* USERS / PROGRESS TAB */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">User Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className={`${innerCardBg} p-4 rounded-2xl border ${borderColor} md:col-span-1`}>
                <h3 className={`font-bold mb-3 text-sm ${textPrimary}`}>Users</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {users.length === 0 ? (
                    <p className={`text-sm ${textSecondary}`}>No users found</p>
                  ) : (
                    users.map(u => (
                      <div
                        key={u._id}
                        onClick={() => fetchUserProgress(u._id)}
                        className={`p-3 rounded-xl cursor-pointer transition text-sm ${
                          selectedUser === u._id
                            ? 'bg-blue-600 text-white'
                            : `${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} ${textPrimary}`
                        }`}
                      >
                        <p className="font-semibold">{u.name}</p>
                        <p className={`text-xs ${selectedUser === u._id ? 'text-blue-200' : textSecondary}`}>{u.email}</p>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${u.role === 'superadmin' ? 'bg-purple-200 text-purple-700' : u.role === 'admin' ? 'bg-blue-200 text-blue-700' : 'bg-gray-200 text-gray-700'}`}>{u.role}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className={`${innerCardBg} p-4 rounded-2xl border ${borderColor} md:col-span-3`}>
                {!userProgress ? (
                  <div className={`text-center py-20 ${textSecondary}`}>
                    <FaUserGraduate className="text-5xl mx-auto mb-4 opacity-30" />
                    <p>Select a user to view their progress</p>
                  </div>
                ) : (
                  <div>
                    <h3 className={`font-bold mb-4 ${textPrimary}`}>Learning Progress</h3>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'} text-center`}>
                        <p className="text-2xl font-bold text-green-400">{userProgress.stats?.totalCompleted || 0}</p>
                        <p className={`text-xs ${textSecondary}`}>Completed</p>
                      </div>
                      <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'} text-center`}>
                        <p className="text-2xl font-bold text-blue-400">{userProgress.stats?.totalInProgress || 0}</p>
                        <p className={`text-xs ${textSecondary}`}>In Progress</p>
                      </div>
                      <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'} text-center`}>
                        <p className="text-2xl font-bold text-yellow-400">{userProgress.stats?.totalBadges || 0}</p>
                        <p className={`text-xs ${textSecondary}`}>Badges</p>
                      </div>
                    </div>

                    <h4 className={`font-semibold mb-3 text-sm ${textPrimary}`}>Badges</h4>
                    {userProgress.badges?.length > 0 ? (
                      <div className="flex gap-2 mb-6 flex-wrap">
                        {userProgress.badges.map(b => (
                          <div key={b._id} className={`px-3 py-1.5 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'} text-sm`}>
                            <span>{b.icon}</span> {b.name}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className={`text-xs ${textSecondary} mb-6`}>No badges yet</p>
                    )}

                    <h4 className={`font-semibold mb-3 text-sm ${textPrimary}`}>Lecture Activity</h4>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {userProgress.progress?.length === 0 ? (
                        <p className={`text-sm ${textSecondary}`}>No activity yet</p>
                      ) : (
                        userProgress.progress.slice(0, 20).map(p => (
                          <div key={p._id} className={`flex items-center gap-3 p-2.5 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <div className={`w-3 h-3 rounded-full ${p.isCompleted ? 'bg-green-500' : 'bg-blue-500'}`} />
                            <div className="flex-1">
                              <p className={`text-sm ${textPrimary}`}>{p.lectureId?.title || 'Unknown lecture'}</p>
                              <p className={`text-xs ${textSecondary}`}>{p.courseId?.title || 'Unknown course'}</p>
                            </div>
                            {p.lastAccessedAt && (
                              <span className={`text-xs ${textSecondary}`}>{new Date(p.lastAccessedAt).toLocaleDateString()}</span>
                            )}
                            <span className={`text-xs font-semibold ${p.isCompleted ? 'text-green-400' : 'text-blue-400'}`}>
                              {p.isCompleted ? 'Done' : 'In progress'}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminPanel;
