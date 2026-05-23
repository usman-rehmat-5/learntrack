import { useState, useEffect } from 'react';
import { MdAdd, MdDelete, MdEdit } from 'react-icons/md';
import { FaYoutube, FaVideo } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function CourseManager({ fieldId, trackId }) {
  const { api } = useAuth();
  const { isDark } = useTheme();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    platform: 'YouTube',
    order: 0,
    thumbnail: ''
  });

  useEffect(() => {
    fetchCourses();
  }, [trackId, api]);

  const fetchCourses = async () => {
    try {
      const res = await api.get(`/courses/${fieldId}/${trackId}`);
      setCourses(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async () => {
    if (!form.title) return;
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('platform', form.platform);
      formData.append('order', form.order);
      if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

      const res = await axios.post(
        `${API}/api/courses/${fieldId}/${trackId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      setCourses([...courses, res.data]);
      setForm({ title: '', description: '', platform: 'YouTube', order: 0, thumbnail: '' });
      setThumbnailFile(null);
      setShowForm(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditCourse = async () => {
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('platform', form.platform);
      formData.append('order', form.order);
      if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

      const res = await axios.put(
        `${API}/api/courses/${editingCourse}`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      setCourses(courses.map(c => c._id === editingCourse ? res.data : c));
      setEditingCourse(null);
      setForm({ title: '', description: '', platform: 'YouTube', order: 0, thumbnail: '' });
      setThumbnailFile(null);
      setShowForm(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!confirm('Delete this course and all its lectures?')) return;
    try {
      await api.delete(`/courses/${id}`);
      setCourses(courses.filter(c => c._id !== id));
      if (selectedCourse?._id === id) setSelectedCourse(null);
    } catch (err) {
      console.log(err);
    }
  };

  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const cardBg = isDark ? 'bg-gray-700' : 'bg-white';
  const borderColor = isDark ? 'border-gray-600' : 'border-gray-200';
  const inputBg = isDark ? 'bg-gray-800' : 'bg-gray-100';
  const sectionBg = isDark ? 'bg-gray-700' : 'bg-gray-100';
  const buttonSecondary = isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400';
  const badgeBg = isDark ? 'bg-gray-600' : 'bg-gray-200';

  return (
    <div>
      {!selectedCourse ? (
        <>
          {/* Courses Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-xl font-bold ${textPrimary}`}>Courses ({courses.length})</h3>
            <button
              onClick={() => { setShowForm(!showForm); setEditingCourse(null); setThumbnailFile(null); setForm({ title: '', description: '', platform: 'YouTube', order: 0, thumbnail: '' }); }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold transition"
            >
              <MdAdd /> Add Course
            </button>
          </div>

          {/* Add/Edit Course Form */}
          {showForm && (
            <div className={`${cardBg} p-6 rounded-2xl mb-6 border ${borderColor}`}>
              <h4 className={`font-bold mb-4 ${textPrimary}`}>{editingCourse ? 'Edit Course' : 'New Course'}</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Course Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg ${inputBg} ${textPrimary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className={`w-full px-4 py-3 rounded-lg ${inputBg} ${textPrimary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={form.platform}
                    onChange={(e) => setForm({ ...form, platform: e.target.value })}
                    className={`px-4 py-3 rounded-lg ${inputBg} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option>YouTube</option>
                    <option>Udemy</option>
                    <option>Coursera</option>
                    <option>Other</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Order (1, 2, 3...)"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })}
                    className={`px-4 py-3 rounded-lg ${inputBg} ${textPrimary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnailFile(e.target.files[0] || null)}
                    className={`w-full px-4 py-3 rounded-lg ${inputBg} ${textPrimary} focus:outline-none`}
                  />
                  {editingCourse && form.thumbnail && (
                    <p className={`text-xs ${textSecondary} mt-1`}>Current thumbnail will be kept if no new file selected.</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={editingCourse ? handleEditCourse : handleAddCourse}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
                  >
                    {editingCourse ? 'Save' : 'Add'}
                  </button>
                  <button
                    onClick={() => { setShowForm(false); setThumbnailFile(null); }}
                    className={`px-6 py-2 ${buttonSecondary} rounded-lg transition ${textPrimary}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Courses List */}
          {loading ? (
            <div className={`text-center py-10 ${textSecondary}`}>Loading...</div>
          ) : courses.length === 0 ? (
            <div className={`text-center py-10 ${textSecondary}`}>
              <p>No courses yet. Add your first course!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {courses.map((course) => (
                <div key={course._id} className={`${cardBg} p-5 rounded-xl border ${borderColor}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1 flex items-start gap-4">
                      {course.thumbnail && (
                        <img
                          src={`${API}${course.thumbnail}`}
                          alt={course.title}
                          className="w-24 h-16 object-cover rounded-lg shrink-0"
                        />
                      )}
                      <div>
                        <h4 className={`font-bold text-lg ${textPrimary}`}>{course.title}</h4>
                        <p className={`${textSecondary} text-sm mt-1`}>{course.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`text-xs px-2 py-1 ${badgeBg} rounded-lg ${textSecondary}`}>{course.platform}</span>
                          <span className={`text-xs ${textSecondary}`}>{course.totalLectures} lectures</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition"
                      >
                        Manage Lectures
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            await api.put(`/admin/courses/${course._id}/toggle-premium`);
                            fetchCourses();
                          } catch (err) { console.log(err); }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${course.isPremium ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-500'} text-white`}
                      >
                        {course.isPremium ? 'Premium ✓' : 'Set Premium'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingCourse(course._id);
                          setThumbnailFile(null);
                          setForm({ title: course.title, description: course.description, platform: course.platform, order: course.order, thumbnail: course.thumbnail });
                          setShowForm(true);
                        }}
                        className={`p-1.5 ${sectionBg} rounded-lg transition`}
                      >
                        <MdEdit className={textSecondary} />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course._id)}
                        className="p-1.5 bg-red-900 hover:bg-red-800 rounded-lg transition"
                      >
                        <MdDelete className="text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <LectureManager
          course={selectedCourse}
          token={token}
          onBack={() => setSelectedCourse(null)}
          api={api}
        />
      )}
    </div>
  );
}

// Lecture Manager Component
function LectureManager({ course, token, onBack, api }) {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [bulkJson, setBulkJson] = useState('');
  const [bulkStatus, setBulkStatus] = useState('');
  const [form, setForm] = useState({
    title: '',
    type: 'youtube',
    youtubeUrl: '',
    video: null,
    duration: ''
  });

  useEffect(() => {
    fetchLectures();
  }, [course._id]);

  const fetchLectures = async () => {
    try {
      const res = await api.get(`/lectures/${course._id}`);
      setLectures(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLecture = async () => {
    if (!form.title) return;
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('type', form.type);
      formData.append('duration', form.duration || 0);
      if (form.type === 'youtube') {
        formData.append('youtubeUrl', form.youtubeUrl);
      } else {
        formData.append('video', form.video);
      }

      const res = await axios.post(
        `${API}/api/lectures/${course._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      setLectures([...lectures, res.data]);
      setForm({ title: '', type: 'youtube', youtubeUrl: '', video: null, duration: '' });
      setShowForm(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteLecture = async (id) => {
    try {
      await api.delete(`/lectures/${id}`);
      setLectures(lectures.filter(l => l._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleBulkUpload = async () => {
    setBulkStatus('');
    try {
      const lectures = JSON.parse(bulkJson);
      if (!Array.isArray(lectures) || lectures.length === 0) {
        setBulkStatus('Provide a non-empty JSON array');
        return;
      }
      const res = await api.post(`/lectures/bulk/${course._id}`, { lectures });
      setBulkStatus(`Added ${res.data.lectures.length} lectures successfully!`);
      setBulkJson('');
      setShowBulk(false);
      fetchLectures();
    } catch (err) {
      if (err instanceof SyntaxError) {
        setBulkStatus('Invalid JSON format');
      } else {
        setBulkStatus(err.response?.data?.message || 'Upload failed');
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <button onClick={onBack} className={`${textSecondary} hover:${textPrimary} text-sm mb-1 flex items-center gap-1 transition`}>
            ← Back to Courses
          </button>
          <h3 className={`text-xl font-bold ${textPrimary}`}>{course.title} — Lectures</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setShowBulk(!showBulk); setShowForm(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'} ${textPrimary}`}
          >
            Bulk Add
          </button>
          <button
            onClick={() => { setShowForm(!showForm); setShowBulk(false); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold transition"
          >
            <MdAdd /> Add Lecture
          </button>
        </div>
      </div>

      {/* Add Lecture Form */}
      {showForm && (
        <div className={`${cardBg} p-6 rounded-2xl mb-6 border ${borderColor}`}>
          <h4 className={`font-bold mb-4 ${textPrimary}`}>New Lecture</h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Lecture Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg ${inputBg} ${textPrimary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setForm({ ...form, type: 'youtube' })}
                className={`flex items-center gap-2 flex-1 py-2 rounded-lg font-semibold transition ${form.type === 'youtube' ? 'bg-red-600' : buttonSecondary} ${textPrimary}`}
              >
                <FaYoutube /> YouTube
              </button>
              <button
                onClick={() => setForm({ ...form, type: 'video' })}
                className={`flex items-center gap-2 flex-1 py-2 rounded-lg font-semibold transition ${form.type === 'video' ? 'bg-blue-600' : buttonSecondary} ${textPrimary}`}
              >
                <FaVideo /> Upload Video
              </button>
            </div>
            {form.type === 'youtube' ? (
              <input
                type="text"
                placeholder="YouTube URL"
                value={form.youtubeUrl}
                onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg ${inputBg} ${textPrimary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            ) : (
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setForm({ ...form, video: e.target.files[0] })}
                className={`w-full px-4 py-3 rounded-lg ${inputBg} ${textPrimary} focus:outline-none`}
              />
            )}
            <div>
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg ${inputBg} ${textPrimary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                min="0"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={handleAddLecture} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition">Add</button>
              <button onClick={() => setShowForm(false)} className={`px-6 py-2 ${buttonSecondary} rounded-lg transition ${textPrimary}`}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Form */}
      {showBulk && (
        <div className={`${cardBg} p-6 rounded-2xl mb-6 border ${borderColor}`}>
          <h4 className={`font-bold mb-4 ${textPrimary}`}>Bulk Add Lectures</h4>
          <p className={`${textSecondary} text-sm mb-3`}>
            Paste a JSON array of lecture objects. Each object can have: title (required), type, youtubeUrl, duration, order.
          </p>
          <textarea
            value={bulkJson}
            onChange={(e) => setBulkJson(e.target.value)}
            placeholder='[{"title": "Lecture 1", "youtubeUrl": "https://youtube.com/...", "duration": 15}]'
            rows={6}
            className={`w-full px-4 py-3 rounded-lg ${inputBg} ${textPrimary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm`}
          />
          {bulkStatus && (
            <p className={`mt-2 text-sm ${bulkStatus.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
              {bulkStatus}
            </p>
          )}
          <div className="flex gap-3 mt-3">
            <button onClick={handleBulkUpload} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition">Upload</button>
            <button onClick={() => { setShowBulk(false); setBulkStatus(''); }} className={`px-6 py-2 ${buttonSecondary} rounded-lg transition ${textPrimary}`}>Cancel</button>
          </div>
        </div>
      )}

      {/* Lectures List */}
      {loading ? (
        <div className={`text-center py-10 ${textSecondary}`}>Loading...</div>
      ) : lectures.length === 0 ? (
        <div className={`text-center py-10 ${textSecondary}`}>
          <p>No lectures yet. Add your first lecture!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lectures.map((lecture, index) => (
            <div key={lecture._id} className={`flex items-center gap-4 ${cardBg} p-4 rounded-xl border ${borderColor}`}>
              <div className={`w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold shrink-0 text-white`}>
                {index + 1}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${textPrimary}`}>{lecture.title}</p>
                <p className={`text-xs ${textSecondary} mt-0.5`}>
                  {lecture.type === 'youtube' ? 'YouTube' : 'Video File'}
                  {lecture.duration > 0 && <span className="ml-2">· {lecture.duration} min</span>}
                </p>
              </div>
              <button
                onClick={() => handleDeleteLecture(lecture._id)}
                className="p-2 bg-red-900 hover:bg-red-800 rounded-lg transition"
              >
                <MdDelete className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseManager;