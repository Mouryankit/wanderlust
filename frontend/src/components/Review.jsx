import React from "react";
import { getUser } from "../utils/token";
import StarRating from "./StarRating";

const Review = ({ review, onDelete, showListingTitle = false }) => {
  const currentUser = getUser();

  const isAuthor = currentUser && (
    showListingTitle ||
    (review.author && (currentUser._id === review.author._id || currentUser.id === review.author._id))
  );

  const capitalize = (str) => {
    if (!str || typeof str !== "string") return str || "Anonymous";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="author-info">
          <span className="author-name">
            {showListingTitle
              ? (review.listing?.title.length > 25 ? review.listing?.title.slice(0, 25) + "..." : review.listing?.title || "Unknown Listing")
              : capitalize(review.author?.username)}
          </span>
          <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="rating-display">
          <StarRating rating={review.rating} />
        </div>
      </div>
      <p className="review-comment">{review.comment || review.text}</p>

      {isAuthor && onDelete && (
        <div className="review-footer" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button
            className="delete-review-btn"
            onClick={() => onDelete(review._id, review.listing?._id || review.listing)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Review;
