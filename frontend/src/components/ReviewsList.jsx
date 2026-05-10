import React from "react";
import Review from "./Review";
import API from "../api/axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import "../styles/components/Reviews.css";

const ReviewsList = ({ reviews, onReviewDeleted, showListingTitle = false, title, listingId }) => {

  const handleDeleteReview = async (reviewId, reviewListingId) => {
    // reviewListingId comes from the Review component (if available), fallback to listingId prop
    const targetListingId = reviewListingId || listingId;

    if (!targetListingId) {
      toast.error("Error: Missing listing ID");
      return;
    }

    const result = await Swal.fire({
      title: "Delete Review?",
      text: "Are you sure you want to delete this review?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--color-danger)",
      cancelButtonColor: "var(--color-text-muted)",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/listings/${targetListingId}/reviews/${reviewId}`);
      toast.success("Review deleted");
      if (onReviewDeleted) onReviewDeleted(reviewId);
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("Failed to delete review");
    }
  };

  return (
    <div className="reviews-list-container">
      {title && <h3 className="section-header">{title} ({reviews?.length || 0})</h3>}
      {(!reviews || reviews.length === 0) ? (
        <p className="no-reviews empty-message">No reviews found.</p>
      ) : (
        <div className="reviews-grid">
          {reviews.map((review) => (
            <Review 
              key={review._id} 
              review={review} 
              onDelete={handleDeleteReview} 
              showListingTitle={showListingTitle} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
