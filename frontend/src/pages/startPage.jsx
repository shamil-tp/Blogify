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
        dark:bg-[#0f172a] dark:text-slate-400
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
          text-slate-400 dark:text-slate-500
          transition-colors hover:text-slate-900 dark:hover:text-slate-100
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
            bg-slate-200 dark:bg-slate-700
            transition-colors duration-500
          "
        >
          <div
            style={{borderRadius:"10px"}}
            className="
              rounded-2xl px-8 sm:px-12 py-20 text-center
              shadow-2xl shadow-slate-200/50 dark:shadow-none
              transition-colors duration-500
              
              /* LIGHT MODE: White Card */
              
              /* DARK MODE: Slate 800 (Distinct from Slate 900 background) */
               bg-slate-200 dark:bg-slate-700
            "
          >
            <h1 className="font-['Outfit',_sans-serif] text-5xl md:text-6xl font-extrabold mb-8 tracking-tight text-slate-900 dark:text-slate-100">
              Welcome to{" "}
              <span className="text-slate-400 dark:text-slate-500">
                ogDoc
              </span>
            </h1>

            <p className="text-lg md:text-xl max-w-lg mx-auto mb-12 leading-relaxed text-slate-600 dark:text-slate-400">
              A dedicated workspace where multiple collaborators can make changes simultaneously, with updates reflected in real time to ensure smooth and efficient collaboration.
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

                /* DARK MODE BUTTON: Dark Gray Background, White Text */
                /* Changed from 'bg-slate-100' (White) to avoid the 'bright element' issue */
                dark:bg-slate-500 dark:text-slate-100 
                dark:hover:bg-slate-600 dark:border dark:border-slate-600
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