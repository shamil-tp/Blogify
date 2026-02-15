import React, { useState } from 'react';
import api from '../api/axios';

const ShareModal = ({ open, onClose, docId }) => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('view');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  if (!open) return null;

  const shareLink = `${window.location.origin}/create/${docId}`;

  const [collaborators, setCollaborators] = useState([]);

  const isAuthor = React.useMemo(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && collaborators.find(c => c.isAuthor && c.email === user.email);
  }, [collaborators]);

  const fetchBlogDetails = React.useCallback(async () => {
    try {
      const res = await api.get(`/api/blog/${docId}`);
      if (res.data?.blog) {
        const blog = res.data.blog;
        // Transform author and collaborators into a single list for management
        const list = [
          { email: 'Author', isAuthor: true, role: 'owner', name: 'Original Author' },
          ...blog.collaborators.map(c => ({ ...c, isAuthor: false }))
        ];
        setCollaborators(list);
      }
    } catch (err) {
      console.error("Error fetching collaborators:", err);
    }
  }, [docId]);

  React.useEffect(() => {
    if (open) {
      fetchBlogDetails();
    }
  }, [open, fetchBlogDetails]);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await api.post(`/api/blog/share-post/${docId}`, { email, role });
      setMessage({ text: 'Invitation sent!', type: 'success' });
      setEmail('');
      fetchBlogDetails(); // Refresh list
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || 'Failed to send invitation',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (targetEmail) => {
    try {
      await api.post(`/api/blog/remove-collaborator/${docId}`, { email: targetEmail });
      fetchBlogDetails(); // Refresh list
    } catch (error) {
      alert("Failed to remove collaborator");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl p-8 shadow-2xl border border-slate-200 dark:border-gray-800 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Share document
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
          >
            <span className="material-icons-outlined">close</span>
          </button>
        </div>

        {/* Invite via Email Section */}
        <form onSubmit={handleInvite} className="mb-6">
          <label className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2 block">
            Invite people
          </label>
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 border border-slate-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border border-slate-300 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="view">Can view</option>
                <option value="edit">Can edit</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading || !email}
              className={`w-full py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${loading ? 'bg-slate-200 dark:bg-gray-700 text-slate-500' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30'
                }`}
            >
              {loading ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
          {message.text && (
            <p className={`text-xs mt-3 px-3 py-2 rounded-lg ${message.type === 'success'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
              {message.text}
            </p>
          )}
        </form>

        {/* PEOPLE WITH ACCESS */}
        <div className="mb-8">
          <label className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3 block">
            People with access
          </label>
          <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {collaborators.map((c, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${c.isAuthor ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                    {c.email[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[150px]">
                      {c.email}
                    </p>
                    <p className="text-[10px] text-slate-500 capitalize">{c.role}</p>
                  </div>
                </div>
                {!c.isAuthor && (
                  <button
                    onClick={() => handleRemove(c.email)}
                    className="text-[10px] font-bold text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-gray-800 mb-8" />

        {/* Share Link Section */}
        <div className="mb-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2 block">
            General access
          </label>
          <div className="flex gap-2 items-center bg-slate-50 dark:bg-gray-800 p-3 rounded-xl border border-slate-200 dark:border-gray-700">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <span className="material-icons-outlined">link</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {shareLink}
              </p>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Anyone with this link can access
              </p>
            </div>
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${copied ? 'bg-green-500 text-white' : 'bg-slate-200 hover:bg-slate-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-slate-700 dark:text-white'
                }`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
