// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Orb from "../components/Orb/Orb";

// export default function StartPage() {
//   const navigate = useNavigate();

//   const [isDark, setIsDark] = useState(() => {
//     if (typeof window !== "undefined") {
//       const savedTheme = localStorage.getItem("theme");
//       if (savedTheme) return savedTheme === "dark";
//       return window.matchMedia("(prefers-color-scheme: dark)").matches;
//     }
//     return true;
//   });

//   useEffect(() => {
//     if (isDark) {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     }
//   }, [isDark]);

//   return (
//     <div
//      className="min-h-screen relative overflow-hidden transition-all duration-700 font-['Inter',_sans-serif] bg-white"
//     >
//       <style>
//         {`
//           .glass-card {
//             background: rgba(255, 255, 255, 0.4);
//             backdrop-filter: blur(24px);
//             -webkit-backdrop-filter: blur(24px);
//             border: 1px solid rgba(255, 255, 255, 0.5);
//             box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.1);
//             position: relative;
//             z-index: 10;
//             overflow: hidden;
//           }

//           .dark .glass-card {
//             background: #000000;
//             border: 1px solid rgba(255, 255, 255, 0.08);
//             box-shadow: 0 0 80px rgba(0, 0, 0, 0.9);
//           }
            
//           @keyframes shine {
//             from { left: -100%; }
//             to { left: 100%; }
//           }
//           .group:hover .group-hover\:animate-shine {
//             animation: shine 0.8s forwards;
//           }
//         `}
//       </style>

//       {/* Theme Toggle - Adjusted position for mobile */}
//       <button
//         onClick={() => setIsDark(!isDark)}
//         className="fixed top-6 right-6 md:top-8 md:right-8 z-50 w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-xl border border-slate-100 dark:border-gray-800 flex items-center justify-center text-slate-600 dark:text-gray-400 hover:text-blue-500 transition-all hover:rotate-12 active:scale-95"
//       >
//         {isDark ? (
//           <i className="bi bi-sun-fill text-lg md:text-xl"></i>
//         ) : (
//           <i className="bi bi-moon-stars-fill text-lg md:text-xl"></i>
//         )}
//       </button>

//       <section className="relative z-20 min-h-screen flex items-center justify-center px-4 md:px-6">
//         <div className="max-w-4xl w-full py-8 md:py-12">
//           {/* Card: Adjusted rounding and padding for mobile */}
//           <div className="glass-card rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-16 min-h-[400px] md:min-h-[420px] flex flex-col items-center justify-center text-center relative group">

//             {/* Orb Background - Adjusted scale for smaller screens */}
//             <div className="absolute inset-0 z-0 pointer-events-none opacity-90 scale-[1.5] md:scale-[2.2] flex items-center justify-center">
//               <Orb
//                 hoverIntensity={2}
//                 rotateOnHover
//                 hue={0}
//                 forceHoverState={false}
//                 backgroundColor={isDark ? "#000000" : "#ffffff"}
//               />
//             </div>

//             <div className="relative z-10 w-full">
//               {/* Responsive Heading */}
//               <h1 className="font-['Outfit',_sans-serif] text-4xl sm:text-5xl md:text-7xl font-black mb-4 md:mb-6 tracking-tighter text-slate-900 dark:text-white leading-[1.1] md:leading-[0.95]">
//                 <span className="dark:text-white">Documenting</span> <br />
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 drop-shadow-sm">
//                   your legacy.
//                 </span>
//               </h1>

//               {/* Responsive Paragraph */}
//               <p className="text-sm md:text-lg max-w-xl mx-auto mb-8 md:mb-10 leading-relaxed text-slate-600 dark:text-white font-medium font-['Inter',_sans-serif] px-2 md:px-0">
//                 A minimalist, real-time collaborative workspace designed for
//                 high-performance storytelling and digital archiving.
//               </p>

//               <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
//                 <button
//                   onClick={() => navigate("/login")}
//                   className="group relative px-6 py-2.5 !rounded-xl !border-[1.5px] 
//                   bg-gradient-to-r from-blue-600 to-purple-600 
//                   dark:from-blue-500 dark:to-purple-500
//                   !border-white/20 dark:!border-white/10
//                   text-white text-[11px] font-bold uppercase tracking-tight
//                   shadow-lg shadow-blue-500/20 hover:shadow-purple-500/40
//                   hover:-translate-y-0.5 transition-all duration-300 active:scale-95 
//                   overflow-hidden w-full sm:w-auto font-['Inter',_sans-serif]"
//                 >
//                   <div className="relative z-10 flex items-center justify-center gap-1.5 leading-none">
//                     <span className="inline-block">Start Creating</span>
//                     <i className="bi bi-arrow-right-short text-xl flex items-center transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110"></i>
//                   </div>

//                   <div className="absolute -inset-full top-0 block duration-500 transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine" />
//                   <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Orb from "../components/Orb/Orb";

export default function StartPage() {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) return savedTheme === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
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
      // FIXED: The background now toggles between white and black globally
      className={`min-h-screen relative overflow-hidden transition-colors duration-700 font-['Inter',_sans-serif] ${
        isDark ? "bg-black" : "bg-white"
      }`}
    >
      <style>
        {`
          .glass-card {
            background: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.5);
            box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.1);
            position: relative;
            z-index: 10;
            overflow: hidden;
          }

          .dark .glass-card {
            background: rgba(0, 0, 0, 0.6); /* Semi-transparent black */
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 0 80px rgba(0, 0, 0, 0.9);
          }
            
          @keyframes shine {
            from { left: -100%; }
            to { left: 100%; }
          }
          .group:hover .group-hover\:animate-shine {
            animation: shine 0.8s forwards;
          }
        `}
      </style>

      {/* Theme Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-6 right-6 md:top-8 md:right-8 z-50 w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-xl border border-slate-100 dark:border-gray-800 flex items-center justify-center text-slate-600 dark:text-gray-400 hover:text-blue-500 transition-all hover:rotate-12 active:scale-95"
      >
        {isDark ? (
          <i className="bi bi-sun-fill text-lg md:text-xl"></i>
        ) : (
          <i className="bi bi-moon-stars-fill text-lg md:text-xl"></i>
        )}
      </button>

      <section className="relative z-20 min-h-screen flex items-center justify-center px-4 md:px-6">
        <div className="max-w-4xl w-full py-8 md:py-12">
          <div className="glass-card rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-16 min-h-[400px] md:min-h-[420px] flex flex-col items-center justify-center text-center relative group">

            {/* Orb Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-90 scale-[1.5] md:scale-[2.2] flex items-center justify-center">
              <Orb
                hoverIntensity={2}
                rotateOnHover
                hue={0}
                forceHoverState={false}
                backgroundColor={isDark ? "#000000" : "#ffffff"}
              />
            </div>

            <div className="relative z-10 w-full">
              <h1 className="font-['Outfit',_sans-serif] text-4xl sm:text-5xl md:text-7xl font-black mb-4 md:mb-6 tracking-tighter text-slate-900 dark:text-white leading-[1.1] md:leading-[0.95]">
                <span className="dark:text-white">Documenting</span> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 drop-shadow-sm">
                  your legacy.
                </span>
              </h1>

              <p className="text-sm md:text-lg max-w-xl mx-auto mb-8 md:mb-10 leading-relaxed text-slate-600 dark:text-gray-300 font-medium font-['Inter',_sans-serif] px-2 md:px-0">
                A minimalist, real-time collaborative workspace designed for
                high-performance storytelling and digital archiving.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
                <button
                  onClick={() => navigate("/login")}
                  className="group relative px-6 py-2.5 !rounded-xl !border-[1.5px] 
                  bg-gradient-to-r from-blue-600 to-purple-600 
                  dark:from-blue-500 dark:to-purple-500
                  !border-white/20 dark:!border-white/10
                  text-white text-[11px] font-bold uppercase tracking-tight
                  shadow-lg shadow-blue-500/20 hover:shadow-purple-500/40
                  hover:-translate-y-0.5 transition-all duration-300 active:scale-95 
                  overflow-hidden w-full sm:w-auto font-['Inter',_sans-serif]"
                >
                  <div className="relative z-10 flex items-center justify-center gap-1.5 leading-none">
                    <span className="inline-block">Start Creating</span>
                    <i className="bi bi-arrow-right-short text-xl flex items-center transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110"></i>
                  </div>
                  <div className="absolute -inset-full top-0 block duration-500 transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}