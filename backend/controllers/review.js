const Review = require("../models/review");
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const wrapAsync = require("../utils/wrapAsync");
const ApiError = require("../utils/ApiError");

// Index - Get all reviews for a listing
module.exports.index = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        throw new ApiError(404, "Listing not found");
    }
    res.status(200).json(listing.reviews);
});

// Create - Add a review to a listing
module.exports.createReview = wrapAsync(async (req, res) => {
    const { id } = req.params;
    // console.log(req.body);
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ApiError(404, "Listing not found");
    }

    // Check if the user has booked this listing
    const hasBooked = await Booking.findOne({
        listing: id,
        user: req.user.id,
        status: "confirmed"
    });

    if (!hasBooked) {
        throw new ApiError(403, "You can only leave a review if you have booked this listing.");
    }

    const newReview = new Review(req.body);
    // console.log(newReview);
    // console.log(req.user);
    // console.log(req.user.id);
    // Attach author and listing
    if (req.user) {
        newReview.author = req.user.id;
    }
    newReview.listing = id;
    // console.log(newReview);
    listing.reviews.push(newReview);
    // console.log(listing);
    await newReview.save();
    await listing.save();

    res.status(201).json({
        message: "Review created successfully",
        review: newReview
    });
});

// Update - Modify an existing review
module.exports.updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const updatedReview = await Review.findByIdAndUpdate(reviewId, { ...req.body }, { new: true });
        if (!updatedReview) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.status(200).json({ message: "Review updated successfully", review: updatedReview });
    } catch (err) {
        res.status(400).json({ message: "Error updating review", error: err.message });
    }
};

// Delete - Destroy a review and remove from listing
module.exports.destroyReview = wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    // Pull the review from the listing's reviews array
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review itself
    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
        throw new ApiError(404, "Review not found");
    }

    res.status(200).json({
        message: "Review deleted successfully",
        review: deletedReview
    });
});
