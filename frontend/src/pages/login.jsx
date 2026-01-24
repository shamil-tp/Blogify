import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";

function Login() {
  const navigate = useNavigate();

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID, // ✅ from env
      callback: handleCredentialLogin,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      {
        theme: "filled_black",
        size: "large",
        shape: "pill",
        width: "280",
      }
    );
  }, []);

  const handleCredentialLogin = async (response) => {
    const res = await fetch("http://localhost:3000/api/auth/google", {
      method: "POST",
      credentials: "include", // ✅ cookie support
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: response.credential }),
    });

    const data = await res.json();

    if (data.success) {
      navigate("/home", { replace: true });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Please sign in to continue</p>
        <div id="googleSignInDiv"></div>
      </div>
    </div>
  );
}

export default Login;
