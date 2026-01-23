import { Link } from "react-router-dom";

// 1. Mock Data
const dummyPosts = [
  {
    id: 1,
    title: "Understanding React Router Data API",
    excerpt: "Why use useEffect when you can use Loaders? Let's dive into the new way of fetching data.",
    author: "Shamil",
    date: "Jan 22, 2026",
    category: "Development",
  },
  {
    id: 2,
    title: "Tailwind CSS vs Bootstrap",
    excerpt: "Utility classes offer more freedom than pre-built components. Here is why I switched.",
    author: "Sinan",
    date: "Jan 21, 2026",
    category: "Design",
  },
  {
    id: 3,
    title: "Building the Blogify Engine",
    excerpt: "How we parsed JSON into HTML for our custom blog platform.",
    author: "Ranfees",
    date: "Jan 20, 2026",
    category: "Engineering",
  },
];

export default function HomeFeed() {
  // const posts = useLoaderData(); 
  const posts = dummyPosts;

  return (
    // MAIN CONTAINER: Deep Dark Gradient matching Login page
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-black text-slate-300 relative overflow-hidden">
      
      {/* Background Ambient Glow (Optional visual flair) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* --- Hero Section --- */}
      {/* Glass Effect Header */}
      <div className="relative border-b border-white/10 bg-slate-900/30 backdrop-blur-md z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg">
            Welcome to{" "}
            {/* Gradient Text */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Blogify
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            A modern, collaborative space where ideas turn into code.
            Read, write, and share your journey.
          </p>
          
          <Link
            to="/create"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-full text-white bg-indigo-600 hover:bg-indigo-500 md:text-lg transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]"
          >
            Start Writing
          </Link>
        </div>
      </div>

      {/* --- Blog Grid --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {posts.map((post) => (
            <article
              key={post.id}
              // CARD: Dark Glass Style
              className="bg-slate-800/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-indigo-500/50 transition-all duration-300 flex flex-col hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10"
            >
              {/* Card Header (Gradient Placeholder) */}
              <div className="h-48 bg-gradient-to-r from-slate-700 to-slate-800 flex items-center justify-center border-b border-white/5 relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-slate-500 font-bold text-2xl opacity-30 group-hover:text-slate-300 transition-colors">
                  Cover Image
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between text-sm mb-3">
                  {/* Category Badge */}
                  <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-slate-500">{post.date}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 hover:text-indigo-400 transition-colors">
                  <Link to={`/viewPost`}>{post.title}</Link>
                </h3>

                <p className="text-slate-400 mb-4 line-clamp-3 flex-1 text-sm leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Card Footer */}
                <div className="flex items-center justify-between mt-auto border-t border-white/10 pt-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 border border-white/10">
                      {post.author[0]}
                    </div>
                    <span className="text-sm font-medium text-slate-300">
                      {post.author}
                    </span>
                  </div>
                  <Link
                    to="/viewPost"
                    className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold flex items-center transition-colors"
                  >
                    Read more &rarr;
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