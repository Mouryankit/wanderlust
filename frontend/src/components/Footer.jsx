import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaBriefcase, FaLinkedin, FaCode } from "react-icons/fa";

import "../styles/components/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><Link to="/">Help Center</Link></li>
            <li><Link to="/">Cancellation Options</Link></li>
            <li><Link to="/">Safety Information</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Hosting</h4>
          <ul>
            <li><Link to="/">Wanderlust your home</Link></li>
            <li><Link to="/">Hosting Resources</Link></li>
            <li><Link to="/">Community Forum</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Wanderlust</h4>
          <ul>
            <li><Link to="/">Newsroom</Link></li>
            <li><Link to="/">New Features</Link></li>
            <li><Link to="/">Careers</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Developer</h4>

          <p className="author-name">Ankit Mourya</p>

          <div className="social-links">

            <a
              href="https://github.com/Mouryankit"
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub />
            </a>

            <a
              href="https://mouryankit.github.io/portfolio/"
              target="_blank"
              rel="noreferrer"
            >
              <FaBriefcase />
            </a>

            <a
              href="https://www.linkedin.com/in/ankit-mourya-7a3185291/"
              target="_blank"
              rel="noreferrer"
            >
              <FaLinkedin />
            </a>

            <a
              href="https://leetcode.com/u/Mouryankit/"
              target="_blank"
              rel="noreferrer"
            >
              <FaCode />
            </a>

          </div>
        </div>

      </div>

      <div className="footer-bottom">

        <div className="footer-info">
          <span>© {new Date().getFullYear()} Wanderlust, Inc.</span>
          <span className="dot">·</span>

          <Link to="/">Privacy</Link>

          <span className="dot">·</span>

          <Link to="/">Terms</Link>

          <span className="dot">·</span>

          <Link to="/">Sitemap</Link>
        </div>

        <div className="footer-social">
          <span>🌐 English (IN)</span>
          <span>₹ INR</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;