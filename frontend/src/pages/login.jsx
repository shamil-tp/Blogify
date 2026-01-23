import { useEffect } from "react";
import "../css/login.css"; 

function Login() {

  useEffect(() => {
       
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "121677145173-n1fj6fanfotesci0o2ge5c4mualalkq0.apps.googleusercontent.com",
        callback: handleCredentialLogin
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { 
          theme: "filled_black",
          size: "large",
          shape: "pill",         
          width: "280"         
        } 
      );
    }
  }, []);

  const handleCredentialLogin = async (response) => {
  const res = await fetch("http://localhost:5000/api/auth/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token: response.credential
    })
  });

  const data = await res.json();

  if (data.success) {
    localStorage.setItem("token", data.jwt);
    window.location.href = "/";
  }
};

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Please sign in to continue</p>
        
        <div className="google-btn-container">
          <div id="googleSignInDiv"></div>
        </div>
      </div>
    </div>
  );
}

export default Login;