const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewController = require("../controllers/review");
const protect = require("../middleware/auth");
const { isReviewAuthor } = require("../middleware/authorization");
const { validateReview } = require("../middleware/validation");

// Nested Routes for Reviews
router
    .route("/")
    .get(reviewController.index)          // Index - Get all reviews for a listing
    .post(
        protect,
        validateReview,
        reviewController.createReview
    ); // Create - Add a review to a listing

router
    .route("/:reviewId")
    .put(
        protect,
        isReviewAuthor,
        validateReview,
        reviewController.updateReview
    )     // Update - Modify an existing review
    .delete(
        protect,
        isReviewAuthor,
        reviewController.destroyReview
    ); // Delete - Destroy a review

module.exports = router;
