import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from '../api/axios'
import { useNavigate } from "react-router-dom";

const DeleteConfirmationModal = ({ show, onClose, onConfirm, postTitle }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-sm transform transition-all duration-300 scale-95">
        <h2 className="text-xl font-['Outfit',_sans-serif] font-bold mb-4 text-slate-900 dark:text-white">
          Confirm Deletion
        </h2>
        <p className="text-slate-600 dark:text-gray-400 mb-6 text-sm">
          Are you sure you want to delete the post: **{postTitle}**? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md active:scale-95"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};


export default function HomeFeed() {


  const [posts, setPosts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDeleteId, setPostToDeleteId] = useState(null);
  const [postToDeleteTitle, setPostToDeleteTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const navigate = useNavigate();

  const startNewStory = async () => {
    if (isCreating) return;
    setIsCreating(true);
    try {
      const res = await api.post('/api/blog/create-draft');
      const newId = res.data.blog._id;
      navigate(`/create/${newId}`);
    } catch (e) {
      console.error("Error creating draft:", e);
      setIsCreating(false);
    }
  };

  const editPost = (postId) => {
    navigate(`/edit/${postId}`);
  };

  const deletePost = async (postId, postTitle) => {
    setPostToDeleteId(postId);
    setPostToDeleteTitle(postTitle);
    setShowDeleteModal(true);
  }

  const confirmDelete = async () => {
    if (!postToDeleteId) return;

    try {
      let res = await api.get(`/api/blog/deleteblog/${postToDeleteId}`)
      setPosts(posts.filter(item => item._id !== postToDeleteId));
      console.log("Post deleted.");
      setShowDeleteModal(false);
      setPostToDeleteId(null);
      setPostToDeleteTitle('');
    } catch (e) {
      console.error('error deleting post', e);
      setShowDeleteModal(false);
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setPostToDeleteId(null);
    setPostToDeleteTitle('');
  };


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/api/blog/user-blogs');
        setPosts(res.data.blogs);
      } catch (e) {
        console.error("Error fetching posts:", e);
      }
    };
    fetchPosts();
  }, []);

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" ||
        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <div className="min-h-screen transition-all duration-700 font-['Inter',_sans-serif]
      bg-slate-50 text-slate-800 dark:bg-[#030303] dark:bg-[radial-gradient(circle_at_top_right,_rgba(30,58,138,0.05),_transparent),_radial-gradient(circle_at_bottom_left,_rgba(79,70,229,0.05),_transparent)] dark:text-gray-400 selection:bg-blue-100 dark:selection:bg-blue-900/30">

      <style>
        {`
          a { text-decoration: none !important; }
          .glass-card {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.4);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          }
          .dark .glass-card {
            background: rgba(15, 15, 15, 0.4);
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            border-left: 1px solid rgba(255, 255, 255, 0.05);
            border-right: 1px solid rgba(0, 0, 0, 0.3);
            border-bottom: 1px solid rgba(0, 0, 0, 0.5);
            box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.02);
          }
          .dark .glass-card:hover {
            background: rgba(20, 20, 20, 0.6);
            border-top: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.05);
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 10px;
          }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
          }
        `}
      </style>

      {/* --- PREMIUM NAVIGATION --- */}
      <nav className="sticky top-0 z-50 w-full glass-card border-b border-slate-200/50 dark:border-white/5 mb-8">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/home')}>
            <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg dark:shadow-white/10 overflow-hidden">
              <img
                src="/images/Logo.png"
                alt="Logo"
                className="w-5 h-5 object-contain"
              />
            </div>
            <h2 className="font-['Outfit',_sans-serif] text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              ogDoc
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={startNewStory}
              disabled={isCreating}
              className={`px-6 py-2.5 rounded-full bg-slate-900 dark:bg-blue-600 text-white text-xs uppercase tracking-widest font-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-500/20 dark:shadow-blue-600/20 ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isCreating ? 'Creating...' : 'Start Writing'}
            </button>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-full bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-all shadow-sm"
            >
              {isDark ? <i className="bi bi-sun-fill text-lg"></i> : <i className="bi bi-moon-stars-fill text-lg"></i>}
            </button>
          </div>
        </div>
      </nav>

      {/* --- FEED SECTION --- */}
      <main className="max-w-6xl mx-auto px-6 py-4">
        <header className="mb-16">
          <h1 className="font-['Outfit',_sans-serif] text-xs uppercase tracking-[0.4em] text-blue-600 dark:text-blue-400 font-black mb-3">
            Workspace
          </h1>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-['Outfit',_sans-serif] font-black text-slate-900 dark:text-white leading-tight">
                Think clearly.<br />Write beautifully.
              </h2>
              <p className="text-slate-500 dark:text-gray-400 mt-4 text-lg max-w-md">
                A premium minimalist space for your most important thoughts and professional documentation.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                <span className="block text-[10px] uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">Total Stories</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">{posts.length}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* ADD NEW POST PLACEHOLDER CARD - NOW FIRST */}
          <button
            onClick={startNewStory}
            disabled={isCreating}
            className={`group relative h-full glass-card p-6 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center gap-4 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 min-h-[300px] ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-blue-900/10 flex items-center justify-center text-slate-300 dark:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-500 transition-all">
              <i className={`bi ${isCreating ? 'bi-arrow-repeat animate-spin' : 'bi-plus-lg'} text-3xl`}></i>
            </div>
            <div className="text-center">
              <span className="block text-sm font-bold text-slate-900 dark:text-slate-100">
                {isCreating ? 'Working...' : 'Create New Story'}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">Share your latest discovery</span>
            </div>
          </button>

          {posts.map((post) => (
            <div
              key={post._id}
              className="group relative"
            >
              <a
                href={`https://shamil-tp.github.io/blog-Rendering-Library/?slug=${post.slug}`}
                className="block h-full glass-card p-6 rounded-[2rem] border border-slate-200/60 dark:border-white/5 
                           hover:shadow-2xl hover:shadow-blue-500/5 dark:hover:shadow-blue-500/10
                           hover:translate-y-[-4px] transition-all duration-500"
              >
                <div className="flex flex-col h-full gap-6">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                      {post.author?._id === JSON.parse(localStorage.getItem('user'))?._id ? (
                        <span className="px-3 py-1 w-fit rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black tracking-widest uppercase border border-blue-100 dark:border-blue-900/30">
                          My Story
                        </span>
                      ) : (
                        <span className="px-3 py-1 w-fit rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-[10px] font-black tracking-widest uppercase border border-purple-100 dark:border-purple-900/30">
                          Shared
                        </span>
                      )}
                      <div className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-gray-700"></span>
                        <span>{new Date(post.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          editPost(post._id);
                        }}
                        className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-white/10 transition-all"
                        title="Edit Post"
                      >
                        <i className="bi bi-pencil-square text-lg"></i>
                      </button>
                      {post.author?._id === JSON.parse(localStorage.getItem('user'))?._id && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            deletePost(post._id, post.title);
                          }}
                          className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-white/10 transition-all"
                          title="Delete Post"
                        >
                          <i className="bi bi-trash3 text-lg"></i>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-mono text-slate-400 dark:text-gray-500 uppercase tracking-widest italic truncate">
                      /{post.slug}
                    </p>
                    <h3 className="font-['Outfit',_sans-serif] text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {post.author?.name && (
                        <>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-blue-500/20">
                            {post.author.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{post.author.name}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </main>

      <DeleteConfirmationModal
        show={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        postTitle={postToDeleteTitle}
      />

      <footer className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent mb-12"></div>
        <div className="flex flex-col items-center gap-6">
          <h2 className="font-['Outfit',_sans-serif] text-xl font-extrabold tracking-tight text-slate-400 dark:text-slate-500">
            ogDoc
          </h2>
          <p className="text-[11px] uppercase tracking-[0.3em] font-black text-slate-400 dark:text-gray-600">
            &copy; 2026 Crafted with Passion
          </p>
        </div>
      </footer>
    </div>
  );
}






