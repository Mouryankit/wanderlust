import React from 'react';

const StarRating = ({ rating }) => {
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => (
        <span key={index} className="star-icon">
          {index < rating ? <span>&#9733;</span> : <span>&#9734;</span>}
        </span>
      ))}
    </div>
  );
};

export default StarRating;
