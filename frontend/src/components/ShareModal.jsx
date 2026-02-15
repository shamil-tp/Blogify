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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const fullUrl = `${api.defaults.baseURL}/api/blog/share-post/${docId}`;
      console.log('🚀 Calling Share API at:', fullUrl);
      const response = await api.post(`/api/blog/share-post/${docId}`, { email, role });
      setMessage({ text: response.data.message || 'Invitation sent!', type: 'success' });
      setEmail('');
    } catch (error) {
      console.error('Share error details:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data
      });
      setMessage({
        text: error.response?.data?.message || 'Failed to send invitation',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
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
        <form onSubmit={handleInvite} className="mb-8">
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
