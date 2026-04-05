import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/AdBanner.css';

const AdBanner = () => {
  return (
    <div className="normal-ad-banner">
      <div className="ad-banner-content">
        <h2>Become a Host</h2>
        <p>Earn extra income and unlock new opportunities by sharing your home on Wanderlust.</p>
        <Link to="/listings/new" className="ad-banner-btn">Learn more</Link>
      </div>
      <div className="ad-banner-image-container">
        <div className="ad-banner-scrolling-images">
          <img src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&q=80&w=400" alt="Host your home 1" />
          <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400" alt="Host your home 2" />
          <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400" alt="Host your home 3" />
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400" alt="Host your home 4" />
          {/* Duplicate images for seamless infinite scroll */}
          <img src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&q=80&w=400" alt="Host your home 1" />
          <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400" alt="Host your home 2" />
          <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400" alt="Host your home 3" />
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400" alt="Host your home 4" />
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
