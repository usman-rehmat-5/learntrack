import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import FieldIcon from '../components/FieldIcon';
import {
  MdDelete, MdEdit, MdSearch, MdRefresh, MdCheck, MdClose,
  MdPerson, MdPeople, MdAdminPanelSettings, MdTimeline,
  MdWarning, MdVisibility, MdFilterList, MdMoreVert,
  MdChevronLeft, MdChevronRight, MdCheckCircle, MdBlock,
  MdSave, MdCancel, MdFiberNew, MdDateRange, MdLogin,
  MdAssignment, MdVerified
} from 'react-icons/md';
import {
  FaUserShield, FaUser, FaUserCog, FaUsers,
  FaRocket, FaBan, FaCheckDouble, FaChartLine
} from 'react-icons/fa';

const ROLE_ICONS = {
  superadmin: <FaUserShield className="text-yellow-400" />,
  admin: <FaUserCog className="text-blue-400" />,
  user: <FaUser className="text-gray-400" />
};

const ROLE_BADGES = {
  superadmin: 'bg-yellow-900 text-yellow-300',
  admin: 'bg-blue-900 text-blue-300',
  user: 'bg-gray-700 text-gray-300'
};

const ACTION_LABELS = {
  login: { icon: <MdLogin className="text-green-400" />, label: 'Login' },
  register: { icon: <MdFiberNew className="text-blue-400" />, label: 'Register' },
  enroll_course: { icon: <MdAssignment className="text-purple-400" />, label: 'Enrolled' },
  complete_course: { icon: <MdVerified className="text-green-400" />, label: 'Completed' },
  change_role: { icon: <MdAdminPanelSettings className="text-yellow-400" />, label: 'Role Changed' },
  disable_user: { icon: <MdBlock className="text-red-400" />, label: 'Disabled' },
  enable_user: { icon: <MdCheckCircle className="text-green-400" />, label: 'Enabled' },
  delete_user: { icon: <MdDelete className="text-red-400" />, label: 'Deleted' },
  batch_enable: { icon: <MdCheckCircle className="text-green-400" />, label: 'Batch Enable' },
  batch_disable: { icon: <MdBlock className="text-red-400" />, label: 'Batch Disable' },
  batch_makeAdmin: { icon: <FaUserCog className="text-blue-400" />, label: 'Made Admin' },
  batch_makeUser: { icon: <FaUser className="text-gray-400" />, label: 'Made User' }
};

function SuperAdminPanel() {
  const navigate = useNavigate();
  const { user, api } = useAuth();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);

  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDark ? 'bg-gray-700' : 'bg-gray-100';

  useEffect(() => {
    if (user?.role !== 'superadmin') navigate('/dashboard');
  }, [user, navigate]);

  const tabs = [
    { id: 'users', label: 'Users', icon: 'users' },
    { id: 'activity', label: 'Activity', icon: 'timeline' },
    { id: 'health', label: 'System Health', icon: 'chart' }
  ];

  return (
    <div className={`min-h-screen ${bgPrimary} ${textPrimary} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className={`bg-gradient-to-br from-yellow-600 via-amber-700 to-orange-800 rounded-2xl p-8 mb-6 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-2">
              <FaUserShield className="text-4xl text-yellow-200" />
              <div>
                <h2 className="text-3xl font-bold text-white">Super Admin Panel</h2>
                <p className="text-white/80 text-sm">Full system control & monitoring</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-200 dark:bg-gray-700 p-1 rounded-xl">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <FieldIcon name={tab.icon} className="text-base" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'users' && <UsersTab api={api} user={user} isDark={isDark} bgPrimary={bgPrimary} cardBg={cardBg} textPrimary={textPrimary} textSecondary={textSecondary} borderColor={borderColor} inputBg={inputBg} />}
        {activeTab === 'activity' && <ActivityTab api={api} isDark={isDark} cardBg={cardBg} textPrimary={textPrimary} textSecondary={textSecondary} borderColor={borderColor} />}
        {activeTab === 'health' && <HealthTab api={api} isDark={isDark} cardBg={cardBg} textPrimary={textPrimary} textSecondary={textSecondary} borderColor={borderColor} />}

      </div>
    </div>
  );
}

function UsersTab({ api, user, isDark, bgPrimary, cardBg, textPrimary, textSecondary, borderColor, inputBg }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [stats, setStats] = useState({});
  const [detailUser, setDetailUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/superadmin/users', { params });
      setUsers(res.data.users || []);
      setTotalPages(res.data.pages || 1);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  }, [page, search, roleFilter, statusFilter]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/superadmin/stats');
      setStats(res.data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { fetchStats(); }, []);

  const handleRoleChange = async (id, role) => {
    try { const res = await api.put(`/superadmin/users/${id}/role`, { role }); setUsers(users.map(u => u._id === id ? res.data : u)); }
    catch (err) { console.log(err); }
  };

  const handleToggle = async (id) => {
    try { const res = await api.put(`/superadmin/users/${id}/toggle`); setUsers(users.map(u => u._id === id ? res.data : u)); }
    catch (err) { console.log(err); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    try { await api.delete(`/superadmin/users/${id}`); setUsers(users.filter(u => u._id !== id)); }
    catch (err) { console.log(err); }
  };

  const handleEdit = (u) => {
    setEditingId(u._id);
    setEditForm({ name: u.name, email: u.email });
  };

  const handleSaveEdit = async (id) => {
    try { const res = await api.put(`/superadmin/users/${id}`, editForm); setUsers(users.map(u => u._id === id ? res.data : u)); setEditingId(null); }
    catch (err) { console.log(err); }
  };

  const handleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selected.length === users.length) setSelected([]);
    else setSelected(users.map(u => u._id));
  };

  const handleBatch = async (action) => {
    if (selected.length === 0) return;
    if (!confirm(`Apply "${action}" to ${selected.length} users?`)) return;
    try {
      await api.post('/superadmin/users/batch', { userIds: selected, action });
      setSelected([]);
      fetchUsers();
    } catch (err) { console.log(err); }
  };

  const viewDetail = async (id) => {
    try {
      const res = await api.get(`/superadmin/users/${id}/detail`);
      setDetailUser(res.data);
    } catch (err) { console.log(err); }
  };

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers || 0, icon: 'users' },
    { label: 'Admins', value: stats.totalAdmins || 0, icon: 'shield' },
    { label: 'Active', value: stats.activeUsers || 0, icon: 'check' },
    { label: 'Courses', value: stats.totalCourses || 0, icon: 'book' },
    { label: 'Fields', value: stats.totalFields || 0, icon: 'globe' },
    { label: 'Tracks', value: stats.totalTracks || 0, icon: 'layers' },
  ];

  return (
    <div>
      {/* Stats bar */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
        {statCards.map((s, i) => (
          <div key={i} className={`${cardBg} p-4 rounded-xl border ${borderColor} text-center`}>
            <FieldIcon name={s.icon} className="text-xl mb-1 text-blue-500" />
            <p className="text-lg font-bold">{s.value}</p>
            <p className={`text-[10px] ${textSecondary}`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={`${cardBg} p-4 rounded-2xl border ${borderColor} mb-4`}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-xl">
            <MdSearch className="text-gray-400" />
            <input type="text" placeholder="Search users..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="flex-1 bg-transparent focus:outline-none text-sm" />
            {search && <MdClose className="text-gray-400 cursor-pointer" onClick={() => setSearch('')} />}
          </div>
          <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
            className={`px-3 py-2 rounded-xl text-sm ${inputBg} border ${borderColor} focus:outline-none`}>
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className={`px-3 py-2 rounded-xl text-sm ${inputBg} border ${borderColor} focus:outline-none`}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>
          <button onClick={fetchUsers} className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition">
            <MdRefresh className="text-lg" />
          </button>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className={`mb-4 p-3 rounded-xl bg-blue-900/20 border border-blue-500 flex items-center gap-3 flex-wrap`}>
          <span className="text-sm font-semibold">{selected.length} selected</span>
          <button onClick={() => handleBatch('enable')} className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition flex items-center gap-1">
            <MdCheckCircle className="text-sm" /> Enable
          </button>
          <button onClick={() => handleBatch('disable')} className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition flex items-center gap-1">
            <MdBlock className="text-sm" /> Disable
          </button>
          <button onClick={() => handleBatch('makeAdmin')} className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition flex items-center gap-1">
            <FaUserCog className="text-sm" /> Make Admin
          </button>
          <button onClick={() => handleBatch('makeUser')} className="px-3 py-1.5 rounded-lg bg-gray-600 hover:bg-gray-700 text-white text-xs font-semibold transition flex items-center gap-1">
            <FaUser className="text-sm" /> Make User
          </button>
          <button onClick={() => setSelected([])} className="px-3 py-1.5 rounded-lg bg-gray-600 hover:bg-gray-700 text-white text-xs font-semibold transition ml-auto">
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className={`${cardBg} rounded-2xl border ${borderColor} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor} text-xs uppercase tracking-wider`}>
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" checked={selected.length === users.length && users.length > 0} onChange={handleSelectAll} className="accent-blue-500" />
                </th>
                <th className={`text-left px-4 py-3 ${textSecondary} font-semibold`}>User</th>
                <th className={`text-left px-4 py-3 ${textSecondary} font-semibold`}>Role</th>
                <th className={`text-left px-4 py-3 ${textSecondary} font-semibold`}>Status</th>
                <th className={`text-left px-4 py-3 ${textSecondary} font-semibold`}>Joined</th>
                <th className={`text-left px-4 py-3 ${textSecondary} font-semibold`}>Last Login</th>
                <th className={`text-right px-4 py-3 ${textSecondary} font-semibold`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className={`text-center py-20 ${textSecondary}`}>Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={7} className={`text-center py-20 ${textSecondary}`}>No users found</td></tr>
              ) : users.map((u) => (
                <tr key={u._id} className={`border-b ${borderColor} hover:bg-gray-50 dark:hover:bg-gray-750 transition`}>
                  <td className="px-4 py-3">
                    {u._id !== user._id && (
                      <input type="checkbox" checked={selected.includes(u._id)} onChange={() => handleSelect(u._id)} className="accent-blue-500" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === u._id ? (
                      <div className="flex items-center gap-1">
                        <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                          className={`w-28 px-2 py-1 rounded text-sm ${inputBg} border ${borderColor} focus:outline-none`} />
                        <input value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                          className={`w-36 px-2 py-1 rounded text-sm ${inputBg} border ${borderColor} focus:outline-none`} />
                        <button onClick={() => handleSaveEdit(u._id)} className="p-1 text-green-500 hover:text-green-400"><MdCheck /></button>
                        <button onClick={() => setEditingId(null)} className="p-1 text-red-500 hover:text-red-400"><MdClose /></button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 cursor-pointer" onClick={() => viewDetail(u._id)}>
                        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
                          {u.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className={`font-semibold text-sm ${textPrimary}`}>{u.name}</p>
                          <p className={`${textSecondary} text-[11px]`}>{u.email}</p>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {u._id === user._id ? (
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${ROLE_BADGES[u.role]} flex items-center gap-1 w-fit`}>
                        {ROLE_ICONS[u.role]} You
                      </span>
                    ) : (
                      <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className={`px-2 py-1 rounded-lg text-xs ${inputBg} ${textPrimary} border ${borderColor} focus:outline-none focus:ring-1 focus:ring-blue-500`}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {u._id === user._id ? (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-900 text-green-300">Active</span>
                    ) : (
                      <button onClick={() => handleToggle(u._id)}
                        className={`text-[11px] px-2 py-0.5 rounded-full transition ${
                          u.isActive ? 'bg-green-900 text-green-300 hover:bg-green-800' : 'bg-red-900 text-red-300 hover:bg-red-800'
                        }`}>
                        {u.isActive ? 'Active' : 'Disabled'}
                      </button>
                    )}
                  </td>
                  <td className={`px-4 py-3 ${textSecondary} text-xs`}>
                    {new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className={`px-4 py-3 ${textSecondary} text-xs`}>
                    {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Never'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {u._id !== user._id && (
                        <>
                          <button onClick={() => handleEdit(u._id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                            <MdEdit className="text-gray-400 text-sm" />
                          </button>
                          <button onClick={() => handleDelete(u._id)} className="p-1.5 rounded-lg hover:bg-red-900/20 transition">
                            <MdDelete className="text-red-400 text-sm" />
                          </button>
                          <button onClick={() => viewDetail(u._id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                            <MdVisibility className="text-gray-400 text-sm" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={`flex items-center justify-between px-4 py-3 border-t ${borderColor}`}>
            <span className={`text-xs ${textSecondary}`}>Page {page} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                className={`p-1.5 rounded-lg transition ${page <= 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <MdChevronLeft className="text-lg" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                const p = start + i;
                return p <= totalPages ? (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition ${p === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                    {p}
                  </button>
                ) : null;
              })}
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                className={`p-1.5 rounded-lg transition ${page >= totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <MdChevronRight className="text-lg" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {detailUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setDetailUser(null)}>
          <div className={`${cardBg} rounded-2xl border ${borderColor} max-w-lg w-full max-h-[80vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold text-white">
                    {detailUser.user?.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${textPrimary}`}>{detailUser.user?.name}</h3>
                    <p className={`text-sm ${textSecondary}`}>{detailUser.user?.email}</p>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${ROLE_BADGES[detailUser.user?.role]} mt-1 inline-flex items-center gap-1`}>
                      {ROLE_ICONS[detailUser.user?.role]} {detailUser.user?.role}
                    </span>
                  </div>
                </div>
                <button onClick={() => setDetailUser(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                  <MdClose className="text-xl" />
                </button>
              </div>

              {detailUser.activityLogs?.length > 0 && (
                <div className="mb-4">
                  <h4 className={`font-semibold text-sm mb-3 flex items-center gap-1 ${textPrimary}`}>
                    <MdTimeline className="text-blue-400" /> Recent Activity
                  </h4>
                  <div className="space-y-2">
                    {detailUser.activityLogs.slice(0, 10).map((log, i) => {
                      const actionDef = ACTION_LABELS[log.action] || { icon: <MdMoreVert className="text-gray-400" />, label: log.action };
                      return (
                        <div key={i} className={`flex items-center gap-3 p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <div className="w-7 h-7 rounded-full flex items-center justify-center">{actionDef.icon}</div>
                          <div className="flex-1">
                            <p className="text-xs font-medium">{actionDef.label}</p>
                            <p className={`text-[10px] ${textSecondary}`}>{new Date(log.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {detailUser.enrollments?.length > 0 && (
                <div className="mb-4">
                  <h4 className={`font-semibold text-sm mb-2 ${textPrimary}`}>Enrolled Courses</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {detailUser.enrollments.map((c, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-300">{c.title}</span>
                    ))}
                  </div>
                </div>
              )}

              {detailUser.certificates?.length > 0 && (
                <div>
                  <h4 className={`font-semibold text-sm mb-2 ${textPrimary}`}>Certificates</h4>
                  <div className="space-y-1">
                    {detailUser.certificates.map((c, i) => (
                      <div key={i} className={`text-xs ${textSecondary}`}>
                        {c.certificateId || `#${i + 1}`} — {new Date(c.createdAt).toLocaleDateString()}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActivityTab({ api, isDark, cardBg, textPrimary, textSecondary, borderColor }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 30 };
      if (actionFilter) params.action = actionFilter;
      const res = await api.get('/superadmin/activity', { params });
      setLogs(res.data.logs || []);
      setTotalPages(res.data.pages || 1);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  }, [page, actionFilter]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return (
    <div className={`${cardBg} rounded-2xl border ${borderColor} p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`font-bold text-lg flex items-center gap-2 ${textPrimary}`}>
          <MdTimeline className="text-blue-500" /> System Activity
        </h3>
        <select value={actionFilter} onChange={e => { setActionFilter(e.target.value); setPage(1); }}
          className={`px-3 py-2 rounded-xl text-sm ${isDark ? 'bg-gray-700' : 'bg-gray-100'} border ${borderColor} focus:outline-none`}>
          <option value="">All Actions</option>
          {Object.entries(ACTION_LABELS).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className={`text-center py-16 ${textSecondary}`}>Loading activity...</div>
      ) : logs.length === 0 ? (
        <div className={`text-center py-16 ${textSecondary}`}>No activity found</div>
      ) : (
        <div className="space-y-2">
          {logs.map((log, i) => {
            const actionDef = ACTION_LABELS[log.action] || { icon: <MdMoreVert className="text-gray-400" />, label: log.action };
            return (
              <div key={log._id || i} className={`flex items-center gap-4 p-3 rounded-xl ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition border-b ${borderColor}`}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0">
                  {actionDef.icon}
                </div>
                <div className="flex items-center gap-3 w-40 shrink-0">
                  {log.userId && (
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                        {log.userId.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs font-medium truncate max-w-[100px]">{log.userId.name}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium">{actionDef.label}</span>
                  {log.metadata?.newRole && <span className="text-[11px] text-gray-500 ml-2">→ {log.metadata.newRole}</span>}
                  {log.metadata?.count && <span className="text-[11px] text-gray-500 ml-2">({log.metadata.count} users)</span>}
                </div>
                <span className={`text-[11px] ${textSecondary} shrink-0`}>
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <span className={`text-xs ${textSecondary}`}>Page {page} of {totalPages}</span>
          <div className="flex gap-1">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
              className={`p-1.5 rounded-lg ${page <= 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
              <MdChevronLeft className="text-lg" />
            </button>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
              className={`p-1.5 rounded-lg ${page >= totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
              <MdChevronRight className="text-lg" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function HealthTab({ api, isDark, cardBg, textPrimary, textSecondary, borderColor }) {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await api.get('/superadmin/health');
        setHealth(res.data);
      } catch (err) { console.log(err); }
      finally { setLoading(false); }
    };
    fetchHealth();
  }, []);

  if (loading) return <div className={`text-center py-20 ${textSecondary}`}>Loading health data...</div>;

  const metrics = [
    { label: 'New Users (24h)', value: health?.newUsers24h || 0, icon: 'users', color: 'text-blue-500' },
    { label: 'New Users (7d)', value: health?.newUsers7d || 0, icon: 'users', color: 'text-green-500' },
    { label: 'New Users (30d)', value: health?.newUsers30d || 0, icon: 'users', color: 'text-purple-500' },
    { label: 'Active Today', value: health?.activeUsers24h || 0, icon: 'check', color: 'text-green-500' },
    { label: 'Logins (24h)', value: health?.recentLogins || 0, icon: 'login', color: 'text-blue-500' },
    { label: 'Total Logins', value: health?.totalLogins || 0, icon: 'timeline', color: 'text-yellow-500' },
    { label: 'Courses Completed', value: health?.completedCourses || 0, icon: 'book', color: 'text-green-500' },
    { label: 'Certificates (30d)', value: health?.issuedCertificates || 0, icon: 'star', color: 'text-amber-500' },
  ];

  return (
    <div className="space-y-6">
      <div className={`${cardBg} rounded-2xl border ${borderColor} p-6`}>
        <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${textPrimary}`}>
          <FaChartLine className="text-blue-500" /> System Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <div key={i} className={`p-4 rounded-xl border ${borderColor} ${isDark ? 'bg-gray-750' : 'bg-gray-50'}`}>
              <FieldIcon name={m.icon} className={`text-2xl mb-2 ${m.color}`} />
              <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
              <p className={`text-xs ${textSecondary}`}>{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={`${cardBg} rounded-2xl border ${borderColor} p-6`}>
        <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${textPrimary}`}>
          <FaRocket className="text-purple-500" /> Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button onClick={() => window.open('/api/superadmin/users?limit=9999')}
            className="p-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-left transition">
            <p className="font-semibold text-sm">Export Users</p>
            <p className="text-xs text-white/70 mt-1">Download full user list</p>
          </button>
          <button
            className="p-4 rounded-xl bg-green-600 hover:bg-green-700 text-white text-left transition opacity-60 cursor-not-allowed">
            <p className="font-semibold text-sm">System Backup</p>
            <p className="text-xs text-white/70 mt-1">Coming soon</p>
          </button>
          <button
            className="p-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-left transition opacity-60 cursor-not-allowed">
            <p className="font-semibold text-sm">Clear Cache</p>
            <p className="text-xs text-white/70 mt-1">Coming soon</p>
          </button>
        </div>
      </div>

      <div className={`${cardBg} rounded-2xl border ${borderColor} p-6`}>
        <h3 className={`font-bold text-lg mb-2 ${textPrimary}`}>Server Info</h3>
        <div className={`text-xs ${textSecondary} space-y-1`}>
          <p>Node.js + Express + MongoDB</p>
          <p>Last checked: {health?.timestamp ? new Date(health.timestamp).toLocaleString() : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminPanel;
