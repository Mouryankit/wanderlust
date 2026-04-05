const { listingSchema, reviewSchema } = require("../schema");
const ApiError = require("../utils/ApiError");

// Listing Validation
exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);

  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new ApiError(400, msg);
  }

  next();
};

// Review Validation
exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new ApiError(400, msg);
  }

  next();
};