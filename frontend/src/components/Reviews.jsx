import React from "react";
import "../styles/components/Reviews.css";

const Reviews = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return <p className="empty-message">No reviews found.</p>;
  }

  return (
    <div className="profile-grid">
      {reviews.map((review) => (
        <div key={review._id} className="review-card">
          <div className="review-header">
            <h5>{review.listing?.title || "Unknown Listing"}</h5>
            <span className="review-rating">
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </span>
          </div>
          <p className="review-text">"{review.comment || review.text}"</p>
          <div className="review-footer">
            <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
            {review.onDelete && (
              <button
                className="delete-review-btn"
                onClick={() => review.onDelete(review._id, review.listing?._id)}
              >
                Delete Review
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reviews;
