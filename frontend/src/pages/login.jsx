import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

function Login() {
  const navigate = useNavigate();
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

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
        width: "280",
      }
    );
  }, [isDark]);

  const handleCredentialLogin = async (response) => {
    console.log(response)
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
    <div className="min-h-screen flex items-center justify-center bg-slate-300 dark:bg-black transition-colors duration-500 font-['Inter',_sans-serif]">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Outfit:wght@700;800&display=swap');
          
          /* Custom override to ensure the Google iframe aligns with our Slate theme */
          #googleSignInDiv iframe {
            border-radius: 9999px !important;
          }
        `}
      </style>

      <div className="max-w-md w-full mx-6 p-[1px] bg-slate-200 dark:bg-gray-800 rounded-2xl">
        <div className="bg-slate-200 dark:bg-gray-00 rounded-2xl p-10 py-14 shadow-2xl shadow-slate-200/50 dark:shadow-black/30 text-center">

          <h1 className="font-['Outfit',_sans-serif] text-3xl font-bold !text-slate-900 dark:!text-dark">
            Welcome Back
          </h1>

          <p className="text-slate-600 dark:text-gray-400 text-sm mb-12">
            Continue to <span className="font-semibold text-gray-500">ogDoc</span>
          </p>

          <div className="flex justify-center">
            <div
              id="googleSignInDiv"
              className="hover:opacity-90 transition-opacity"
            ></div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-gray-700/50">
            <button
              onClick={() => navigate("/")}
              className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 hover:text-slate-600 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              Back to Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;