import { useState, useEffect } from "react";
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
  const posts = dummyPosts;

  // 2. Dark Mode Logic
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
    <div className="min-h-screen transition-colors duration-500 relative overflow-hidden
      bg-slate-50 text-slate-900 
      dark:bg-gradient-to-br dark:from-[#0f172a] dark:via-[#1e293b] dark:to-black dark:text-slate-300">
      
      {/* Ambient Glow (Hidden in Light Mode for clarity) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none hidden dark:block" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none hidden dark:block" />

      {/* --- THEME TOGGLE BUTTON --- */}
    <button
  onClick={() => setIsDark(!isDark)}
  className="fixed top-6 right-6 z-50
  text-slate-700 dark:text-yellow-400
  hover:scale-110 active:scale-95
  transition-transform duration-200"
  aria-label="Toggle Theme"
>
  {isDark ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-7 w-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707.707M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-7 w-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  )}
</button>

      {/* --- HERO SECTION --- */}
      {/* --- HERO SECTION --- */}
<section className="relative z-10 h-screen flex items-center justify-center px-4">
  <div
    className="w-full max-w-6xl rounded-[3rem] border
    bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl
    border-slate-200 dark:border-white/10
    shadow-xl dark:shadow-[0_0_60px_rgba(79,70,229,0.25)]
    px-6 sm:px-10 py-20 text-center"
  >
    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-slate-900 dark:text-white">
      Welcome to{" "}
      <span className="font-serif text-transparent bg-clip-text bg-gradient-to-r 
      from-indigo-600 via-blue-600 to-purple-600 
      dark:from-indigo-400 dark:via-blue-400 dark:to-purple-400">
        Blogify
      </span>
    </h1>

    <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed 
    text-slate-600 dark:text-slate-400">
      A modern, collaborative space where ideas turn into code.
      Read, write, and share your journey.
    </p>

    <Link
      to="/create"
      className="inline-flex items-center justify-center px-10 py-4 rounded-full
      text-white font-semibold text-lg bg-indigo-600 hover:bg-indigo-500
      transition-all shadow-lg hover:shadow-indigo-500/40 no-underline"
    >
      Start Writing
    </Link>
  </div>
</section>


      {/* --- BLOG GRID --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          {posts.map((post) => (
            <article
  key={post.id}
  className="group relative rounded-3xl overflow-hidden
  bg-white dark:bg-slate-900/70 backdrop-blur-xl
  border border-slate-200/60 dark:border-white/10
  transition-all duration-300
  hover:-translate-y-2 hover:shadow-2xl
  dark:hover:shadow-indigo-500/20"
>
  {/* Accent Glow */}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity
    bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent pointer-events-none" />

  {/* Header */}
  <div className="h-44 flex items-center justify-center
    bg-gradient-to-br from-slate-100 to-slate-200
    dark:from-slate-800 dark:to-black">
    <span className="text-xs tracking-widest uppercase text-slate-500 dark:text-slate-400">
      {post.category}
    </span>
  </div>

  {/* Body */}
  <div className="relative p-7 flex flex-col h-full">
    <span className="text-xs text-slate-500 mb-3">{post.date}</span>

    <h3 className="font-serif text-2xl font-semibold mb-4 leading-snug
      text-slate-900 dark:text-white
      group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
      <Link to="/viewPost">{post.title}</Link>
    </h3>

    <p className="text-sm leading-relaxed flex-1
      text-slate-600 dark:text-slate-400">
      {post.excerpt}
    </p>

    {/* Footer */}
    <div className="mt-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full
          bg-gradient-to-br from-indigo-500 to-purple-500
          text-white font-bold flex items-center justify-center">
          {post.author[0]}
        </div>
        <span className="text-sm text-slate-700 dark:text-slate-300">
          {post.author}
        </span>
      </div>

      <Link
        to="/viewPost"
        className="text-sm font-semibold text-indigo-600 dark:text-indigo-400
        hover:underline"
      >
        Read →
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