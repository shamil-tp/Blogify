import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from '../api/axios'
import { useNavigate } from "react-router-dom";

const DeleteConfirmationModal = ({ show, onClose, onConfirm, postTitle }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-sm transform transition-all duration-300 scale-95">
        <h2 className="text-xl font-['Outfit',_sans-serif] font-bold mb-4 text-slate-900 dark:text-slate-100">
          Confirm Deletion
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
          Are you sure you want to delete the post: **{postTitle}**? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
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

   const navigate = useNavigate();

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
    <div className="min-h-screen transition-colors duration-500 font-['Inter',_sans-serif]
      bg-slate-50 text-slate-800 dark:bg-[#0f172a] dark:text-slate-400">

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Outfit:wght@700;800&display=swap');
          @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css");

          a { text-decoration: none !important; }
        `}
      </style>

      {/* --- MINIMAL NAVIGATION --- */}
      <nav className="max-w-5xl mx-auto px-6 py-8 flex justify-between items-center">
        <h2 className="font-['Outfit',_sans-serif] text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          ogDoc
        </h2>
        <div className="flex items-center gap-6">
          <Link to="/create" className="px-5 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-slate-50 dark:text-slate-900 text-xs uppercase tracking-widest font-bold hover:opacity-80 transition-all active:scale-95">
            Write
          </Link>
          <button
            onClick={() => setIsDark(!isDark)}
            className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            {isDark ? <i className="bi bi-sun h3"></i> : <i className="bi bi-moon h3"></i>}
          </button>
        </div>
      </nav>

      {/* --- FEED SECTION --- */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-12 border-b border-slate-200 dark:border-slate-800/60 pb-8">
          <h1 className="font-['Outfit',_sans-serif] text-sm uppercase tracking-[0.3em] text-slate-400 mb-2">
            Recent Stories
          </h1>
          <p className="text-slate-500 text-sm">
            Curated thoughts on development and design.
          </p>
        </header>

        <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-1">
          {posts.map((post) => (
            <a
              key={post._id}
              href={`https://shamil-tp.github.io/blog-Rendering-Library/?slug=${post.slug}`}
              className="group block relative p-3 rounded-[1rem] border border-slate-200/60 dark:border-slate-800/50 
                         bg-slate-100/50 dark:bg-[#1e293b]/30 hover:bg-white dark:hover:bg-[#1e293b]/60
                         transition-all duration-300 w-[300px] mb-3 sm:w-full"
            >
              <div className="flex flex-col gap-2">

                <div className="absolute top-4 right-4 flex gap-3 text-sm">
                  {/* Edit Icon */}
                  <i
                    className="bi bi-pencil-square hover:text-blue-500 transition-colors cursor-pointer text-slate-400 dark:text-slate-500"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      editPost(post._id);
                    }}
                    title="Edit Post"
                  ></i>

                  {/* Delete Icon */}
                  <i
                    className="bi bi-trash3 hover:text-red-500 transition-colors cursor-pointer text-slate-400 dark:text-slate-500"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      deletePost(post._id, post.title); 
                    }}
                    title="Delete Post"
                  ></i>
                </div>

                {/* Main content area */}
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-3 flex-grow min-w-0">
                    <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-tighter italic truncate">
                      /{post.slug}
                    </p>
                    <h3 className="font-['Outfit',_sans-serif] text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                      {post.title}
                    </h3>
                  </div>

                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <div className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest pt-5">
                      {new Date(post.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </div>
                  </div>
                </div>

                {/* Author and Date Row */}
                <div className="flex items-center gap-4 text-xs font-medium text-slate-400 uppercase tracking-wider mt-4">
                  <span className="text-slate-600 dark:text-slate-500">{post.author.name}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                  <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  }).toUpperCase()}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>

      <DeleteConfirmationModal
        show={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        postTitle={postToDeleteTitle}
      />

      <footer className="max-w-5xl mx-auto px-6 py-20 text-center">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-8 inline-block px-10">
          &copy; 2026 ogDoc Engine</p></footer></div>
  );
}
