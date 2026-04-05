import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/components/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rooms, setRooms] = useState(1);

  const today = new Date().toISOString().split("T")[0];

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (endDate && newStartDate > endDate) {
      setEndDate(newStartDate);
    }
  };

  const isAuthenticated = !!localStorage.getItem("token");

  const handleLogout = async () => {
    try {
      // Import API here just for the logout, or we can use fetch/axios directly
      // Assuming axios is available, but let's use standard fetch to be safe if API isn't imported
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("http://localhost:5000/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
      setMenuOpen(false);
    }
  };

  const handleSearch = () => {
    navigate(`/listings?location=${destination}&startDate=${startDate}&endDate=${endDate}&rooms=${rooms}`);
    setMenuOpen(false); // Close menu on search
  };

  return (
    <nav className="navbar">

      {/* Logo */}
      <div className="logo">
        <Link to="/">Wanderlust</Link>
      </div>

      {/* Hamburger Toggle */}
      <div
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "\u2715" : "\u2630"}
        {/* {menuOpen ? "✕" : "☰"} */}
      </div>

      {/* Nav Menu (Search + Right Section) */}
      <div className={`nav-menu ${menuOpen ? "active" : ""}`}>

        {/* Search Bar */}
        <div className="search-bar">
          <div className="input-group">
            <label>Where</label>
            <input
              type="text"
              placeholder="Search destinations"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          <div className="nav-divider"></div>

          <div className="input-group start-date">
            <label>Check in</label>
            <div className="date-input">
              <input
                type="date"
                min={today}
                value={startDate}
                onChange={handleStartDateChange}
              />
            </div>
          </div>

          <div className="nav-divider"></div>

          <div className="input-group end-date">
            <label>Check out</label>
            <div className="date-input">
              <input
                type="date"
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="nav-divider"></div>

          <div className="input-group guests">
            <label>Rooms</label>
            <input
              type="number"
              min="1"
              placeholder="Add rooms"
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
            />
          </div>

          <button className="search-btn" onClick={handleSearch}>
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentcolor', strokeWidth: '4', overflow: 'visible' }}><g fill="none"><path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"></path></g></svg>
          </button>
        </div>

        {/* Right Section */}
        <div className="nav-right">
          <Link to="/listings" className="explore-link" onClick={() => setMenuOpen(false)}>
            Explore
          </Link>

          <button
            className="host-btn"
            onClick={() => {
              navigate("/listings/new");
              setMenuOpen(false);
            }}
          >
            Airbnb your home
          </button>

          <div className="auth-profile-group">
            {isAuthenticated ? (
              <>
                <button className="logout-btn" onClick={handleLogout} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px', color: '#222222' }}>
                  Logout
                </button>
                <div
                  className="profile"
                  onClick={() => {
                    navigate("/profile");
                    setMenuOpen(false);
                  }}
                >
                  <span>Profile</span>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="login-btn" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>

                <Link to="/signup" className="signup-btn" onClick={() => setMenuOpen(false)}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>

      </div>

    </nav>
  );
};

export default Navbar;