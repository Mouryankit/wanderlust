import React from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { getToken, clearAuth } from "../utils/token";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import "../styles/components/NavProfileSection.css";

const NavProfileSection = ({ setMenuOpen }) => {
  const navigate = useNavigate();
  const isAuthenticated = !!getToken();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Log out?",
      text: "Are you sure you want to log out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "var(--color-danger)",
      cancelButtonColor: "var(--color-text-muted)",
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Stay logged in",
    });

    if (!result.isConfirmed) return;

    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuth();
      if (setMenuOpen) setMenuOpen(false);
      navigate("/login");
      toast.success("Logged out successfully!");
    }
  };

  // Helper to navigate and close menu
  const handleNav = (path) => {
    navigate(path);
    if (setMenuOpen) setMenuOpen(false);
  };

  return (
    <div className="nav-right">
      {/* Explore Link */}
      <Link to="/listings" className="explore-link" onClick={() => setMenuOpen && setMenuOpen(false)}>
        Explore
      </Link>

      {/* Host Button */}
      <button className="host-btn" onClick={() => handleNav("/listings/new")}>
        Add your home
      </button>

      {/* Auth & Profile Group */}
      <div className="auth-profile-group">
        {isAuthenticated ? (
          <>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
            <div className="profile" onClick={() => handleNav("/profile")}>
              <span>Profile</span>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="login-btn" onClick={() => setMenuOpen && setMenuOpen(false)}>
              Login
            </Link>
            <Link to="/signup" className="signup-btn" onClick={() => setMenuOpen && setMenuOpen(false)}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default NavProfileSection;
