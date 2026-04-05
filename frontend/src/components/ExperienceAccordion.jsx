import React from "react";
import { Link } from "react-router-dom";
import "../styles/components/ExperienceAccordion.css";

const ExperienceAccordion = () => {
  return (
    <div className="bottom-ad-section">
      <div className="bottom-ad-header">
        <h2>Discover Experiences</h2>
        <p>Unique activities with local experts—in person or online.</p>
      </div>

      <div className="accordion-gallery">
        <div
          className="accordion-item"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?auto=format&fit=crop&q=80&w=1000')",
          }}
        >
          <div className="accordion-content">
            <h3>Nature Retreats</h3>
            <Link to="/listings">Explore Nature</Link>
          </div>
        </div>

        <div
          className="accordion-item"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1000')",
          }}
        >
          <div className="accordion-content">
            <h3>Historic Villas</h3>
            <Link to="/listings">Explore History</Link>
          </div>
        </div>

        <div
          className="accordion-item"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1000')",
          }}
        >
          <div className="accordion-content">
            <h3>Beachfront Living</h3>
            <Link to="/listings">Explore Coasts</Link>
          </div>
        </div>

        <div
          className="accordion-item"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1000')",
          }}
        >
          <div className="accordion-content">
            <h3>Urban Lofts</h3>
            <Link to="/listings">Explore Cities</Link>
          </div>
        </div>

        <div
          className="accordion-item"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1000')",
          }}
        >
          <div className="accordion-content">
            <h3>Creative Spaces</h3>
            <Link to="/listings">Explore Art</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceAccordion;
