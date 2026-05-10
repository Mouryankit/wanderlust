import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavSearchBar from "./NavSearchBar";
import NavProfileSection from "./NavProfileSection";
import "../styles/components/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [menuOpen]);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Wanderlust
        </Link>
      </div>

      {/* Hamburger Toggle */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "\u2715" : "\u2630"}
      </div>

      {/* Nav Menu (Search + Right Section) */}
      <div className={`nav-menu ${menuOpen ? "active" : ""}`}>
        <NavSearchBar setMenuOpen={setMenuOpen} />
        <NavProfileSection setMenuOpen={setMenuOpen} />
      </div>
    </nav>
  );
};

export default Navbar;