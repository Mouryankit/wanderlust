const { listingSchema, reviewSchema, bookingSchema } = require("../schema");
const ApiError = require("../utils/ApiError");
const cloudinary = require("../config/cloudConfig");

// Listing Validation
exports.validateListing = async (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  // console.log("error1");
  if (error) {
    // If validation fails, delete the uploaded image from Cloudinary
    if (req.file && req.file.filename) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    // console.log("error2");
    const msg = error.details.map(el => el.message).join(", ");
    return next(new ApiError(400, msg));
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

// Booking Validation
exports.validateBooking = (req, res, next) => {
  const { error } = bookingSchema.validate(req.body);

  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new ApiError(400, msg);
  }

  next();
};