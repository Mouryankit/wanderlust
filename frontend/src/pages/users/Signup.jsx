import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import "../../styles/pages/auth.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await API.post("/auth/signup", { username, email, password });
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <form className="auth-form" onSubmit={handleSignup}>
          <h2>Create account</h2>
          <p>Join Wanderlust to get started</p>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

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

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Sign up"}
          </button>

          <div className="auth-link">
            <span>Already have an account?</span>
            <Link to="/login">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;