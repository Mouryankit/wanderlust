const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const ApiError = require("../utils/ApiError");

// Listing Owner
exports.isOwner = wrapAsync(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    // throw new ApiError(404, "Listing not found");
    // res.status(404).json({ error: "Listing not found" });
    throw new ApiError(404, "Lsting not");
  }

  if (listing.owner.toString() !== req.user.id) {
    throw new ApiError(403, "Not authorized");
  }

  /**
   * OPTIMIZATION 2:
   * We attach the found 'listing' to the request object so that subsequent 
   * controllers (like update/delete) can reuse it without queried the DB again.
   * (Previous logic just called next() without passing the object).
   */
  req.listing = listing;
  next();
});

// Review Author
exports.isReviewAuthor = wrapAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);

  // console.log("requesta Accet");

  if (!review) {
    // res.status(404).json({ error: "Review not found" });
    // return;
    throw new ApiError(404, "Review not found");
  }
  // console.log("not err");
  if (review.author.toString() !== req.user.id) {
    // res.status(403).json({ error: "Not authorized" });
    // return;
    throw new ApiError(403, "Not authorized to delete this listing");
  }

  next();
});