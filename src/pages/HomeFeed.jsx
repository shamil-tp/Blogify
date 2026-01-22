import { Link } from "react-router-dom";

// 1. Mock Data (Later this will come from your Database)
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
  // const posts = useLoaderData(); // <--- Uncomment this when your backend is ready!
  const posts = dummyPosts; 

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- Hero Section --- */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
            Welcome to <span className="text-blue-600">Blogify</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-8">
            A modern, collaborative space where ideas turn into code. 
            Read, write, and share your journey.
          </p>
          <Link
            to="/create"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg transition-colors"
          >
            Start Writing
          </Link>
        </div>
      </div>

      {/* --- Blog Grid --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {posts.map((post) => (
            <article 
              key={post.id} 
              className="bg-white rounded-xl shadow-sm hover:shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 flex flex-col"
            >
              {/* Card Header (Optional Image placeholder) */}
              <div className="h-48 bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                 <span className="text-white font-bold text-2xl opacity-25">Cover Image</span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {post.category}
                  </span>
                  <span>{post.date}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  <Link to={`/viewPost`}>
                    {post.title}
                  </Link>
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                  {post.excerpt}
                </p>

                {/* Card Footer */}
                <div className="flex items-center justify-between mt-auto border-t border-gray-100 pt-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                      {post.author[0]}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{post.author}</span>
                  </div>
                  <Link 
                    to="/viewPost" 
                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center"
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