



import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const googleButtonRef = useRef(null);
  const navigate = useNavigate();

  const handleGoogleResponse = async (response) => {
    console.log("response token", response);
    try {
      const res = await API.post("/auth/google", {
        idToken: response.credential,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login Successful");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Google login failed");
    }
  };

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    // console.log(clientId, window.google, googleButtonRef.current);
    // console.log(window.location.origin);
    if (!clientId || !window.google || !googleButtonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleResponse,
    });

    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: "outline",
      size: "large",
      type: "standard",
      shape: "pill",
      text: "continue_with",
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login Successful");

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <form className="auth-form" onSubmit={handleLogin}>
          <h2>Welcome back</h2>
          <p>Sign in to your account</p>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>

          <div className="auth-link">
            <span>Don't have an account?</span>
            <Link to="/signup">Sign up</Link>
          </div>

          <div ref={googleButtonRef} style={{ marginTop: "1rem" }} />
        </form>
      </div>
    </div>
  );
}

export default Login;


