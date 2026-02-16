import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

function Login() {
  const navigate = useNavigate();
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

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

  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialLogin,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      {
        theme: isDark ? "filled_black" : "outline",
        size: "large",
        shape: "pill",
        width: window.innerWidth < 640 ? "250" : "300", 
      }
    );
  }, [isDark]);

  const handleCredentialLogin = async (response) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await res.json();
      if (data.success) {
        secureLocalStorage.setItem("accessToken", data.accessToken);
        secureLocalStorage.setItem("refreshToken", data.refreshToken);
        navigate("/home", { replace: true });
      }
    } catch (error) {
      console.error("Login Failed", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-black transition-colors duration-500 font-['Inter',_sans-serif] overflow-x-hidden">
      
      {/* --- BRANDING SECTION (Top on Mobile, Left on Desktop) --- */}
      <div className="flex flex-1 relative items-center justify-center p-8 sm:p-12 lg:p-20 bg-slate-900 dark:bg-gray-950 overflow-hidden min-h-[40vh] md:min-h-screen">
        {/* Abstract Background Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>

        <div className="relative z-10 max-w-lg text-center md:text-left">
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-2xl mb-6 lg:mb-12 mx-auto md:mx-0 transform -rotate-12 transition-transform hover:rotate-0 duration-700 overflow-hidden">
            <img src="/images/Logo.png" alt="Logo" className="w-10 h-10 lg:w-12 lg:h-12 object-contain" />
          </div>
          <h1 className="font-['Outfit',_sans-serif] text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 lg:mb-8 tracking-tighter leading-none">
            Your journey <span className="text-blue-400">starts</span> here.
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-400 font-medium leading-relaxed max-w-sm mx-auto md:mx-0">
            Join thousands of creators documenting their growth on ogDoc. A minimalist, collaborative space for modern storytellers.
          </p>
        </div>
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>

      {/* --- LOGIN SECTION (Bottom on Mobile, Right on Desktop) --- */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-slate-50 dark:bg-black relative text-center min-h-[60vh] md:min-h-screen">
        {/* Mobile Decorative Orbs */}
        <div className="md:hidden absolute top-[-5%] right-[-5%] w-[60%] h-[40%] bg-blue-500/10 dark:bg-blue-900/10 rounded-full blur-[80px]"></div>
        
        <div className="max-w-md w-full relative z-10">
          <div className="bg-white/70 dark:bg-gray-900/40 backdrop-blur-3xl rounded-[2.5rem] md:rounded-[3rem] p-8 sm:p-10 md:p-16 text-center border border-white dark:border-gray-800 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] dark:shadow-none transition-all duration-500">

            <h1 className={`font-['Outfit',_sans-serif] text-4xl sm:text-5xl font-black mb-3 md:mb-4 tracking-tight leading-tight ${isDark ? '!text-white' : 'text-slate-900'}`}>
              Welcome Back
            </h1>

            <p className={`text-base sm:text-lg mb-8 md:mb-12 font-medium ${isDark ? '!text-white/80' : 'text-slate-500'}`}>
              Continue your journey on <span className="text-blue-600 dark:text-blue-400 font-bold">ogDoc</span>
            </p>

            <div className="flex justify-center mb-10 md:mb-12">
              <div
                id="googleSignInDiv"
                className="hover:scale-105 transition-all duration-300 shadow-xl dark:shadow-blue-500/10 rounded-full overflow-hidden"
              ></div>
            </div>

            <div className="pt-6 md:pt-8 border-t border-slate-100 dark:border-gray-800/50">
              <button
                onClick={() => navigate("/")}
                className={`group flex items-center justify-center gap-2 mx-auto text-[10px] font-black uppercase tracking-[0.3em] transition-all ${isDark ? 'text-white/50 hover:text-blue-400' : 'text-slate-400 hover:text-blue-600'}`}
              >
                <i className="bi bi-arrow-left transition-transform group-hover:-translate-x-1"></i>
                Back to Start
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;