import React, { useState } from 'react';
import api from '../api/axios';

const ShareModal = ({ open, onClose, docId, onlineUsers = [], currentSocketId, onKick }) => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('view');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [collaborators, setCollaborators] = useState([]);
  const [blogData, setBlogData] = useState(null);
  const [showRoleStyles, setShowRoleStyles] = useState(false);

  const currentUser = React.useMemo(() => JSON.parse(localStorage.getItem('user')), []);
  const forceRound = { borderRadius: '9999px' };

  const isAuthor = React.useMemo(() => {
    return currentUser && blogData && (blogData.author === currentUser._id || blogData.author?._id === currentUser._id);
  }, [currentUser, blogData]);

  const fetchBlogDetails = React.useCallback(async () => {
    try {
      const res = await api.get(`/api/blog/${docId}`);
      if (res.data?.blog) {
        const blog = res.data.blog;
        setBlogData(blog);
        setCollaborators(blog.collaborators || []);
      }
    } catch (err) {
      console.error("Error fetching collaborators:", err);
    }
  }, [docId]);

  React.useEffect(() => {
    if (open) fetchBlogDetails();
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
      fetchBlogDetails(); 
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Failed to send invitation', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (targetEmail) => {
    try {
      await api.post(`/api/blog/remove-collaborator/${docId}`, { email: targetEmail });
      fetchBlogDetails(); 
    } catch (error) {
      alert("Failed to remove collaborator");
    }
  };

  const shareLink = `${window.location.origin}/create/${docId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative overflow-hidden bg-white/70 dark:bg-[#0F0F0F]/80 border border-white/20 dark:border-white/10 p-5 sm:p-8 rounded-[32px] shadow-2xl w-full max-w-[95%] sm:max-w-md transform transition-all backdrop-blur-xl">
        
        {/* Decorative Glows */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-red-500/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          

          {/* Invite Form */}
          <form onSubmit={handleInvite} className="mb-6 space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Invite People</label>
            <div className="flex flex-row items-center gap-2 w-full">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={forceRound}
                className="!rounded-full flex-[2] min-w-0 bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500/50 transition-all backdrop-blur-sm"
              />
              <div className="relative flex-1 min-w-[90px]">
                <button
                  type="button"
                  onClick={() => setShowRoleStyles(!showRoleStyles)}
                  style={forceRound}
                  className="!rounded-full w-full flex items-center justify-between bg-blue-600/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 px-3 py-2 text-[10px] font-black uppercase tracking-widest outline-none backdrop-blur-md active:scale-95 transition-all"
                >
                  <span>{role}</span>
                  <span className={`material-icons-outlined text-xs transition-transform ${showRoleStyles ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                {showRoleStyles && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-[110] overflow-hidden bg-white/90 dark:bg-[#1A1A1A]/90 border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl shadow-xl animate-in zoom-in-95">
                    {['viewer', 'editor'].map((opt) => (
                      <div key={opt} onClick={() => {setRole(opt); setShowRoleStyles(false);}} className="px-4 py-2 text-[10px] font-black uppercase tracking-tight text-slate-700 dark:text-slate-300 hover:bg-blue-500/10 hover:text-blue-600 cursor-pointer transition-colors">{opt}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button type="submit" disabled={loading || !email} style={forceRound} className={`!rounded-full w-full py-2 text-[10px] uppercase tracking-[0.2em] font-black transition-all border ${loading ? 'bg-slate-200/20 text-slate-400' : 'bg-blue-600/10 border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600/20 active:scale-95'}`}>
              {loading ? 'Sending...' : 'Send Invitation'}
            </button>
            {message.text && <p className={`text-[10px] font-bold text-center uppercase tracking-wider ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>{message.text}</p>}
          </form>

          {/* PEOPLE WITH ACCESS */}
          <div className="mb-6">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block px-1">
              People with access
            </label>
            <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              
              {/* Author / Owner */}
              {blogData && (
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-[10px] font-black text-blue-600 dark:text-blue-400" style={forceRound}>
                      {blogData.author?.email?.[0].toUpperCase() || 'A'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]">Owner</p>
                      <p className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">Document Creator</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Persistent Collaborators */}
              {collaborators.map((c, i) => (
                <div key={`collab-${i}`} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-[10px] font-black text-slate-600 dark:text-slate-400" style={forceRound}>
                      {c.email[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{c.email}</p>
                      <p className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">{c.role}</p>
                    </div>
                  </div>
                  {isAuthor && (
                    <button onClick={() => handleRemove(c.email)} style={forceRound} className="w-7 h-7 flex items-center justify-center bg-red-500/10 text-red-500 border border-red-500/20 active:scale-90 transition-all">
                      <span className="material-icons-outlined text-xs">close</span>
                    </button>
                  )}
                </div>
              ))}

              {/* Online Visitors */}
              {onlineUsers.reduce((unique, u) => {
                  const isMe = u.socketId === currentSocketId;
                  const alreadyAdded = unique.some(item => item.name === u.name);
                  const isPersistent = collaborators.some(c => c.email === u.name || c.email === u.email);
                  if (!isMe && !alreadyAdded && !isPersistent) unique.push(u);
                  return unique;
                }, []).map((u, i) => (
                <div key={`online-${i}`} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-[10px] font-black text-green-600" style={forceRound}>
                      {u.name[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{u.email || u.name}</p>
                      <p className="text-[9px] text-green-500 uppercase font-bold tracking-tighter">Visitor</p>
                    </div>
                  </div>
                  {isAuthor && (
                    <button onClick={() => onKick && onKick(u.socketId)} style={forceRound} className="w-7 h-7 flex items-center justify-center bg-orange-500/10 text-orange-500 border border-orange-500/20 active:scale-90 transition-all">
                      <span className="material-icons-outlined text-xs">close</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-200/50 dark:bg-white/10 mb-6" />

          {/* Copy Link Section */}
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block px-1">General Access</label>
          <div className="relative mb-6">
            <input type="text" readOnly value={shareLink} style={forceRound} className="!rounded-full w-full bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-6 py-2.5 text-[10px] font-mono text-slate-500 outline-none backdrop-blur-sm" />
            <button 
  onClick={handleCopyLink} 
  style={forceRound} 
  className={`!rounded-full absolute inset-y-1 right-1 px-4 text-[9px] font-black uppercase tracking-widest transition-all border shadow-lg ${
    copied 
      ? 'bg-green-600 border-green-400 text-white shadow-green-500/20' // Solid green on success
      : 'bg-blue-600/40 dark:bg-blue-500/40 border-blue-500/30 text-blue-700 dark:text-blue-100 hover:bg-blue-600/60' // Reduced transparency (40% vs 10%)
  }`}
>
  {copied ? 'Copied' : 'Copy'}
</button>
          </div>

          <button onClick={onClose} style={forceRound} className="!rounded-full w-full py-2 text-[10px] uppercase tracking-[0.2em] font-black text-red-500 bg-red-500/5 border border-red-500/20 active:scale-95 transition-all">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;