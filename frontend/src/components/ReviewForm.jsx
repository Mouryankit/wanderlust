import React, { useState } from "react";
import API from "../api/axios";
import { getToken } from "../utils/token";
import toast from "react-hot-toast";
import "../styles/components/Reviews.css";

const ReviewForm = ({ listingId, onReviewAdded }) => {
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAuthenticated = !!getToken();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // console.log(rating, comment);
      await API.post(`/listings/${listingId}/reviews`, { rating, comment });
      toast.success("Review posted!");
      setComment("");
      setRating(5);
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      console.error("Review Error:", err);
      toast.error(err.response?.data?.message || "Failed to post review");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="review-form-container">
      <h3 className="section-header">Leave a Review</h3>
      <form onSubmit={handleSubmit} className="review-form">
        <div className="rating-select">
          {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              className={`star-select ${rating >= num ? "active" : ""}`}
              onClick={() => setRating(num)}
            >
              &#9733;
              {/* star entity code */}
            </span>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this place..."
          required
        />
        <button type="submit" disabled={isSubmitting} className="submit-review-btn">
          {isSubmitting ? "Posting..." : "Post Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
