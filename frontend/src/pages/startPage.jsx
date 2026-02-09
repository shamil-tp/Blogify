import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function StartPage() {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
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
    <div
      className="
        min-h-screen relative overflow-hidden transition-colors duration-500
        bg-slate-50 text-slate-800 font-['Inter',_sans-serif]
        dark:bg-black dark:text-black
      "
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Outfit:wght@700;800&display=swap');
          @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css");

        `}
      </style>

      <button
        onClick={() => setIsDark(!isDark)}
        className="
          fixed top-8 right-8 z-50
          text-[10px] uppercase tracking-[0.2em] font-bold
          text-slate-400 dark:text-gray-400
          transition-colors hover:text-slate-900 dark:hover:text-gray-300
        "
        aria-label="Toggle theme"
      >
        {isDark ? <i className="bi bi-sun h3"></i> : <i className="bi bi-moon h3"></i>}
      </button>

      <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div
          style={{borderRadius:"10px"}}
          className="
            relative max-w-3xl w-full p-[1px] rounded-2xl
            bg-slate-200 dark:bg-gray-800
            transition-colors duration-500
          "
        >
          <div
            style={{borderRadius:"10px"}}
            className="
              rounded-2xl px-8 sm:px-12 py-20 text-center
              shadow-2xl shadow-slate-200/50 dark:shadow-black/30
              transition-colors duration-500
              
              /* LIGHT MODE: White Card */
              
              /* DARK MODE: Gray Card */
               bg-slate-200 dark:bg-gray-300
            "
          >
            <h1 className="font-['Outfit',_sans-serif] text-5xl md:text-6xl font-extrabold mb-8 tracking-tight text-slate-900 dark:text-white">
              Welcome to{" "}
              <span className="text-slate-400 dark:text-gray-400">
                ogDoc
              </span>
            </h1>

            <p className="text-lg md:text-xl max-w-lg mx-auto mb-12 leading-relaxed text-slate-600 dark:text-gray-400">
              A minimalist space to document your journey, 
              explore new perspectives, and share stories.
            </p>

            <button
              onClick={() => navigate("/login")}
              style={{borderRadius:"10px"}}
              className="
                inline-flex items-center justify-center
                px-10 py-4 rounded-2xl
                text-sm uppercase tracking-widest font-semibold
                transition-all duration-300
                active:scale-[0.97]

                /* LIGHT MODE BUTTON: Black Background, White Text */
                bg-slate-900 text-slate-50 
                hover:bg-black

                /* DARK MODE BUTTON: Gray-300 Background, Black Text */
                dark:bg-gray-300 
                dark:bg-gray-400 dark:border dark:border-gray-300 
              "
            >
              Start Writing
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}