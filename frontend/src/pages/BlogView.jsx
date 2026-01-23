import { useState } from "react"

function BlogView() {
  const [slug, setSlug] = useState("")
  const [blog, setBlog] = useState(null)
  const [error, setError] = useState("")

  const fetchBlog = async () => {
    if (!slug) return

    // Simulating API call
    if (slug === "test-blog") {
      setBlog({
        title: "Test Blog Title",
        content: "This is a fake blog used for testing the view page UI. It demonstrates the typography, spacing, and readability of the new dark theme. \n\nThe glassmorphism effect provides a clean, modern container for your content while the deep background keeps the focus on the text."
      })
      setError("")
    } else {
      setError("Blog not found. Try entering 'test-blog'.")
      setBlog(null)
    }
  }

  return (
    // MAIN CONTAINER: Deep Dark Gradient matching other pages
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-black flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* CARD: Glassmorphism Container */}
      <div className="w-full max-w-3xl bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 md:p-10 relative z-10">

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            View Blog
          </span>
        </h1>

        {/* Slug Input Section */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Enter blog slug (e.g., test-blog)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="flex-1 bg-slate-950/50 text-white placeholder-slate-500
                       border border-white/10 rounded-xl px-5 py-4
                       focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                       transition-all duration-300"
          />

          <button
            onClick={fetchBlog}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl 
                       transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)] 
                       hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] active:scale-95"
          >
            View
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 mb-6 text-center">
             <p className="text-rose-400 font-medium"> {error} </p>
          </div>
        )}

        {/* Blog Content */}
        {blog && (
          <div className="border-t border-white/10 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white leading-tight">
              {blog.title}
            </h2>

            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                {blog.content}
              </p>
            </div>
            
            {/* Optional: Mock Meta Data */}
            <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
                <span>By Admin</span>
                <span>•</span>
                <span>Just now</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogView