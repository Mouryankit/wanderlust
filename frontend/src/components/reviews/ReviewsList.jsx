import React from "react";
import API from "../../api/axios";
import "../../styles/components/Reviews.css";

const ReviewsList = ({ listingId, reviews, onReviewDeleted }) => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const handleDelete = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await API.delete(`/listings/${listingId}/reviews/${reviewId}`);
        alert("Review deleted successfully!");
        if (onReviewDeleted) {
          onReviewDeleted(); // Callback to refresh listing details
        }
      } catch (err) {
        console.error("Delete Error:", err.response?.data || err.message);
        alert(err.response?.data?.message || "Failed to delete review");
      }
    }
  };

  return (
    <div className="reviews-list-container">
      <h3>Reviews ({reviews.length})</h3>
      {reviews.length === 0 ? (
        <p className="no-reviews">No reviews yet. Be the first to share your experience!</p>
      ) : (
        <div className="reviews-grid">
          {reviews.map((review) => {
            const token = localStorage.getItem("token");
            const isLoggedIn = !!currentUser && !!token;
            const isAuthor = isLoggedIn && (currentUser._id === review.author._id);
            // console.log(isLoggedIn);
            // console.log(currentUser._id, review.author._id);
            // console.log(review.author);
            return (
              <div key={review._id} className="review-item-card">
                <div className="review-header">
                  <div className="review-author-info">
                    <div className="author-name">
                      {review.author?.username || "Anonymous"}
                    </div>
                    <div className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="review-rating-stars">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>
                </div>
                <p className="review-text">{review.comment}</p>
                {isAuthor && (
                  <button
                    className="delete-review-link"
                    onClick={() => handleDelete(review._id)}
                  >
                    Delete Review
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
