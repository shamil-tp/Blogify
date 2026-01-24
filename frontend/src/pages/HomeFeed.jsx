import { Link } from "react-router-dom";

// 1. Mock Data
const dummyPosts = [
  {
    id: 1,
    title: "Understanding React Router Data API",
    excerpt:
      "Why use useEffect when you can use Loaders? Let's dive into the new way of fetching data.",
    author: "Shamil",
    date: "Jan 22, 2026",
    category: "Development",
  },
  {
    id: 2,
    title: "Tailwind CSS vs Bootstrap",
    excerpt:
      "Utility classes offer more freedom than pre-built components. Here is why I switched.",
    author: "Sinan",
    date: "Jan 21, 2026",
    category: "Design",
  },
  {
    id: 3,
    title: "Building the Blogify Engine",
    excerpt:
      "How we parsed JSON into HTML for our custom blog platform.",
    author: "Ranfees",
    date: "Jan 20, 2026",
    category: "Engineering",
  },
];

export default function HomeFeed() {
  const posts = dummyPosts;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-black text-slate-300 relative overflow-hidden">
      
      {/* Ambient Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* --- HERO SECTION --- */}
      <div className="relative border-b border-white/10 bg-slate-900/40 backdrop-blur-xl z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            Welcome to{" "}
            <span className="font-serif text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400">
              Blogify
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            A modern, collaborative space where ideas turn into code.
            Read, write, and share your journey.
          </p>

          <Link
            to="/create"
            className="inline-flex items-center justify-center px-9 py-3.5 rounded-full 
            text-white font-semibold text-lg bg-indigo-600 hover:bg-indigo-500 
            transition-all shadow-[0_0_25px_rgba(79,70,229,0.45)] 
            hover:shadow-[0_0_40px_rgba(79,70,229,0.7)]"
          >
            Start Writing
          </Link>
        </div>
      </div>

      {/* --- BLOG GRID --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          {posts.map((post) => (
            <article
              key={post.id}
              className="group bg-slate-900/60 backdrop-blur-xl rounded-3xl overflow-hidden 
              border border-white/10 hover:border-indigo-400/40 
              transition-all duration-300 
              hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20
              flex flex-col"
            >
              {/* Card Header */}
              <div className="h-52 bg-gradient-to-br from-slate-800 via-slate-900 to-black 
              flex items-center justify-center relative overflow-hidden">
                
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                <span className="relative z-10 text-slate-500 text-xs tracking-widest uppercase">
                  Featured Article
                </span>
              </div>

              {/* Card Body */}
              <div className="p-7 flex-1 flex flex-col">
                
                {/* Category + Date */}
                <div className="flex items-center justify-between text-xs mb-4">
                  <span className="uppercase tracking-wider bg-indigo-500/10 text-indigo-300 
                  border border-indigo-500/20 px-3 py-1 rounded-full font-semibold">
                    {post.category}
                  </span>
                  <span className="text-slate-500">{post.date}</span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-2xl font-semibold text-white mb-3 leading-snug 
                line-clamp-2 group-hover:text-indigo-400 transition-colors">
                  <Link to="/viewPost">{post.title}</Link>
                </h3>

                {/* Excerpt */}
                <p className="text-slate-400 mb-6 line-clamp-3 flex-1 text-sm leading-relaxed tracking-wide">
                  {post.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto border-t border-white/10 pt-5">
                  
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 
                    flex items-center justify-center text-sm font-bold text-white">
                      {post.author[0]}
                    </div>
                    <span className="text-sm font-medium text-slate-300">
                      {post.author}
                    </span>
                  </div>

                  <Link
                    to="/viewPost"
                    className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold 
                    flex items-center gap-1 transition-all group-hover:gap-2"
                  >
                    Read article →
                  </Link>

                </div>
              </div>
            </article>
          ))}

        </div>
      </div>
    </div>
  );
}
