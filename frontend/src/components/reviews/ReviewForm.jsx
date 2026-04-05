import React, { useState } from "react";
import API from "../../api/axios";
import "../../styles/components/Reviews.css";

const ReviewForm = ({ listingId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please login to submit a review");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post(`/listings/${listingId}/reviews`, {
        rating,
        comment,
      });

      alert("Review submitted!");
      setComment("");
      setRating(5);

      if (onReviewAdded) {
        onReviewAdded(); // Callback to refresh listing details
      }
    } catch (err) {
      console.error("Review Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="review-auth-prompt">
        <p>You must be logged in to leave a review.</p>
      </div>
    );
  }

  return (
    <div className="review-form-container">
      <h3>Leave a Review</h3>
      <form onSubmit={handleSubmit} className="review-form">
        <div className="rating-input">
          <label>Rating:</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                className={`star ${rating >= num ? "active" : ""}`}
                onClick={() => setRating(num)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="comment-input">
          <label>Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your thoughts about this place..."
            required
          />
        </div>

        <button type="submit" disabled={loading} className="submit-review-btn">
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
