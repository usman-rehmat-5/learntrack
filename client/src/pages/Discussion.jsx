import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MdSend, MdThumbUp, MdThumbDown, MdDelete } from 'react-icons/md';
import { FaReply } from 'react-icons/fa';

function Discussion() {
  const { fieldId, trackId } = useParams();
  const navigate = useNavigate();
  const { user, token, api } = useAuth();
  const { isDark } = useTheme();

  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDark ? 'bg-gray-700' : 'bg-gray-100';
  const sectionBg = isDark ? 'bg-gray-800' : 'bg-white';
  const replyBg = isDark ? 'bg-gray-900' : 'bg-gray-100';

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [replyText, setReplyText] = useState({});
  const [showReply, setShowReply] = useState({});

  useEffect(() => {
    fetchPosts();
  }, [trackId]);

  const fetchPosts = async () => {
    try {
      const res = await api.get(`/discussion/${trackId}`);
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = async () => {
    if (!newPost.trim()) return;
    try {
      const res = await api.post(`/discussion/${trackId}`, { content: newPost });
      setPosts([res.data, ...posts]);
      setNewPost('');
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await api.put(`/discussion/${postId}/like`);
      setPosts(posts.map(p => p._id === postId ? res.data : p));
    } catch (err) {
      console.log(err);
    }
  };

  const handleDislike = async (postId) => {
    try {
      const res = await api.put(`/discussion/${postId}/dislike`);
      setPosts(posts.map(p => p._id === postId ? res.data : p));
    } catch (err) {
      console.log(err);
    }
  };

  const handleReply = async (postId) => {
    if (!replyText[postId]?.trim()) return;
    try {
      const res = await api.post(`/discussion/${postId}/reply`, {
        content: replyText[postId]
      });
      setPosts(posts.map(p => p._id === postId ? res.data : p));
      setReplyText({ ...replyText, [postId]: '' });
      setShowReply({ ...showReply, [postId]: false });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/discussion/${postId}`);
      setPosts(posts.filter(p => p._id !== postId));
    } catch (err) {
      console.log(err);
    }
  };

  const getAvatar = (name) => name?.slice(0, 2).toUpperCase() || 'AN';

  const getTime = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} minutes ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hours ago`;
    return `${Math.floor(hrs / 24)} days ago`;
  };

  return (
    <div className={`max-w-4xl mx-auto px-6 py-10 ${bgPrimary} ${textPrimary} transition-colors duration-300`}>

      {/* Back */}
      <button onClick={() => navigate(`/field/${fieldId}/track/${trackId}`)} className={`mb-6 ${textSecondary} hover:${textPrimary} flex items-center gap-2 transition`}>
        ← Back to Track
      </button>

      {/* Header */}
      <div className="mb-8">
        <h2 className={`text-3xl font-bold mb-2 ${textPrimary}`}>Discussion Forum</h2>
        <p className={textSecondary}>Ask questions, share knowledge with other students</p>
      </div>

      {/* New Post */}
      <div className={`${cardBg} p-6 rounded-2xl border ${borderColor} mb-8`}>
        <h3 className={`text-lg font-bold mb-3 ${textPrimary}`}>Ask a Question</h3>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Write your question or share something..."
          rows={3}
          className={`w-full px-4 py-3 rounded-xl ${inputBg} ${textPrimary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={handleAddPost}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition"
          >
            <MdSend /> Post
          </button>
        </div>
      </div>

      {/* Posts */}
      {loading ? (
        <div className={`text-center py-20 ${textSecondary}`}>Loading...</div>
      ) : posts.length === 0 ? (
        <div className={`text-center py-20 ${textSecondary}`}>
          <p className="text-xl">No posts yet. Be the first to ask!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post._id} className={`${cardBg} p-6 rounded-2xl border ${borderColor}`}>

              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
                    {getAvatar(post.author)}
                  </div>
                  <div>
                    <p className="font-semibold">{post.author}</p>
                    <p className={`${textSecondary} text-xs`}>{getTime(post.createdAt)}</p>
                  </div>
                </div>
                {user?._id === post.userId && (
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    <MdDelete className="text-xl" />
                  </button>
                )}
              </div>

              {/* Post Content */}
              <p className={`${isDark ? 'text-gray-200' : 'text-gray-800'} mb-4`}>{post.content}</p>

              {/* Actions */}
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => handleLike(post._id)}
                  className={`flex items-center gap-1 ${textSecondary} hover:text-green-400 transition text-sm`}
                >
                  <MdThumbUp /> {post.likes}
                </button>
                <button
                  onClick={() => handleDislike(post._id)}
                  className={`flex items-center gap-1 ${textSecondary} hover:text-red-400 transition text-sm`}
                >
                  <MdThumbDown /> {post.dislikes}
                </button>
                <button
                  onClick={() => setShowReply({ ...showReply, [post._id]: !showReply[post._id] })}
                  className={`flex items-center gap-1 ${textSecondary} hover:text-blue-400 transition text-sm`}
                >
                  <FaReply /> Reply ({post.replies.length})
                </button>
              </div>

              {/* Reply Form */}
              {showReply[post._id] && (
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    value={replyText[post._id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [post._id]: e.target.value })}
                    className={`flex-1 px-4 py-2 rounded-xl ${inputBg} ${textPrimary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                  />
                  <button
                    onClick={() => handleReply(post._id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold transition"
                  >
                    Send
                  </button>
                </div>
              )}

              {/* Replies */}
              {post.replies.length > 0 && (
                <div className={`space-y-3 border-l-2 ${borderColor} pl-4`}>
                  {post.replies.map((reply) => (
                    <div key={reply._id} className={`${replyBg} p-4 rounded-xl`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xs">
                          {getAvatar(reply.author)}
                        </div>
                        <p className={`font-semibold text-sm ${textPrimary}`}>{reply.author}</p>
                        <p className={`${textSecondary} text-xs`}>{getTime(reply.createdAt)}</p>
                      </div>
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Discussion;