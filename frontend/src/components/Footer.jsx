import React from "react";
import { Link } from "react-router-dom";
import "../styles/components/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Support */}
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><Link to="#">Help Center</Link></li>
            <li><Link to="#">AirCover</Link></li>
            <li><Link to="#">Anti-discrimination</Link></li>
            <li><Link to="#">Disability support</Link></li>
            <li><Link to="#">Cancellation options</Link></li>
            <li><Link to="#">Report neighborhood concern</Link></li>
          </ul>
        </div>

        {/* Hosting */}
        <div className="footer-section">
          <h4>Hosting</h4>
          <ul>
            <li><Link to="#">Airbnb your home</Link></li>
            <li><Link to="#">AirCover for Hosts</Link></li>
            <li><Link to="#">Hosting resources</Link></li>
            <li><Link to="#">Community forum</Link></li>
            <li><Link to="#">Hosting responsibly</Link></li>
            <li><Link to="#">Airbnb-friendly apartments</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div className="footer-section">
          <h4>Wanderlust</h4>
          <ul>
            <li><Link to="#">Newsroom</Link></li>
            <li><Link to="#">New features</Link></li>
            <li><Link to="#">Careers</Link></li>
            <li><Link to="#">Investors</Link></li>
            <li><Link to="#">Gift cards</Link></li>
            <li><Link to="#">Emergency stays</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-left">
          <p>© {new Date().getFullYear()} Wanderlust, Inc.</p>
          <span className="dot">·</span>
          <Link to="#">Terms</Link>
          <span className="dot">·</span>
          <Link to="#">Sitemap</Link>
          <span className="dot">·</span>
          <Link to="#">Privacy</Link>
          <span className="dot">·</span>
          <Link to="#">Your Privacy Choices</Link>
        </div>

        <div className="footer-bottom-right">
          <div className="social-options">
            <Link to="#" className="text-icon">
              <span>🌐</span> English (US)
            </Link>
            <Link to="#" className="text-icon">
              <span>$</span> USD
            </Link>
          </div>

          <div className="social-icons">
            <Link to="#" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '18px', width: '18px', fill: 'currentColor' }}><path d="M28 0H4C1.8 0 0 1.8 0 4v24c0 2.2 1.8 4 4 4h13V20h-3v-4h3v-3c0-4 2.5-6.2 6-6.2 1.7 0 3.2.1 3.6.2v4.2h-2.5c-1.9 0-2.3.9-2.3 2.3v3h4.6l-.6 4h-4v12h7c2.2 0 4-1.8 4-4V4c0-2.2-1.8-4-4-4z"></path></svg>
            </Link>
            <Link to="#" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '18px', width: '18px', fill: 'currentColor' }}><path d="M32 6.1c-1.2.5-2.4.9-3.8 1 1.4-.8 2.4-2.1 2.9-3.6-1.3.8-2.7 1.3-4.2 1.6C25.7 3.8 24 3 22.2 3c-3.6 0-6.6 2.9-6.6 6.6 0 .5.1 1 .2 1.5-5.5-.3-10.3-2.9-13.6-6.9-.6 1-.9 2.1-.9 3.3 0 2.3 1.2 4.3 2.9 5.5-1.1 0-2.1-.3-3-.8v.1c0 3.2 2.3 5.8 5.3 6.4-.6.1-1.1.2-1.7.2-.4 0-.8 0-1.2-.1.8 2.6 3.3 4.5 6.1 4.6-2.2 1.8-5.1 2.8-8.2 2.8-.5 0-1.1 0-1.6-.1 2.9 1.9 6.4 2.9 10.1 2.9 12.1 0 18.7-10 18.7-18.7v-.8c1.3-.9 2.4-2 3.3-3.3z"></path></svg>
            </Link>
            <Link to="#" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '18px', width: '18px', fill: 'currentColor' }}><path d="M16 2.9c4.3 0 4.8 0 6.5.1 1.6.1 2.4.3 3 .6.8.3 1.3.7 1.8 1.2.5.5.9 1 1.2 1.8.3.6.5 1.4.6 3 .1 1.7.1 2.2.1 6.5s0 4.8-.1 6.5c-.1 1.6-.3 2.4-.6 3-.3.8-.7 1.3-1.2 1.8-.5.5-1 1.2-1.8 1.2-.6.3-1.4.5-3 .6-1.7.1-2.2.1-6.5.1s-4.8 0-6.5-.1c-1.6-.1-2.4-.3-3-.6-.8-.3-1.3-.7-1.8-1.2-.5-.5-.9-1-1.2-1.8-.3-.6-.5-1.4-.6-3-.1-1.7-.1-2.2-.1-6.5s0-4.8.1-6.5c.1-1.6.3-2.4.6-3 .3-.8.7-1.3 1.2-1.8.5-.5 1-1.2 1.8-1.2.6-.3 1.4-.5 3-.6 1.7-.1 2.2-.1 6.5-.1M16 0c-4.3 0-4.9 0-6.6.1-1.7.1-2.9.4-4 .8-1.1.4-2 1-2.8 1.8C1.8 3.5 1.2 4.4.8 5.5c-.4 1.1-.7 2.3-.8 4C0 11.1 0 11.7 0 16s0 4.9.1 6.6c.1 1.7.4 2.9.8 4 1.1 2.8 3.3 5 6.1 6.1 1.1.4 2.3.7 4 .8 1.7.1 2.3.1 6.6.1s4.9 0 6.6-.1c1.7-.1 2.9-.4 4-.8 2.8-1.1 5-3.3 6.1-6.1.4-1.1.7-2.3.8-4C32 20.9 32 20.3 32 16s0-4.9-.1-6.6c-.1-1.7-.4-2.9-.8-4-1.1-2.8-3.3-5-6.1-6.1-1.1-.4-2.3-.7-4-.8C20.9 0 20.3 0 16 0zm0 7.8c-4.5 0-8.2 3.7-8.2 8.2s3.7 8.2 8.2 8.2 8.2-3.7 8.2-8.2-3.7-8.2-8.2-8.2zm0 13.5c-2.9 0-5.3-2.4-5.3-5.3s2.4-5.3 5.3-5.3 5.3 2.4 5.3 5.3-2.4 5.3-5.3 5.3zm8.5-12.8c-1.1 0-1.9-.9-1.9-1.9 0-1.1.9-1.9 1.9-1.9 1.1 0 1.9.9 1.9 1.9 0 1.1-.9 1.9-1.9 1.9z"></path></svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;