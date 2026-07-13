import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../../api/axios";
import { setToken, setUser } from "../../utils/token";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../../styles/pages/auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const googleButtonRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoogleResponse = async (response) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await API.post("/auth/google", {
        idToken: response.credential,
      });
      setToken(res.data.token);
      setUser(res.data.user);
      toast.success("Login Successful!");
      const from = location.state?.from || "/";
      navigate(from);
    } catch (error) {
      toast.error(error.response?.data?.message || "Google login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
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
      width:"100%",
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await API.post("/auth/login", { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      toast.success("Login Successful!");
      const from = location.state?.from || "/";
      navigate(from);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleGuestLogin = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await API.post("/auth/guest");
      setToken(res.data.token);
      setUser(res.data.user);
      toast.success("Welcome, logged in as Demo Recruiter!");
      const from = location.state?.from || "/";
      navigate(from);
    } catch (error) {
      toast.error(error.response?.data?.message || "Guest login failed");
    } finally {
      setIsSubmitting(false);
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

          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login"}
          </button>

          <button
            type="button"
            className="guest-login-btn"
            onClick={handleGuestLogin}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Login as Guest / Recruiter Demo"}
          </button>

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
