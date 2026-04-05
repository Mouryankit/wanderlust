const Booking = require("../models/booking");
const wrapAsync = require("../utils/wrapAsync");
const ApiError = require("../utils/ApiError");

exports.isBookingOwner = wrapAsync(async (req, res, next) => {
  const { bookingId } = req.params;
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (booking.user.toString() !== req.user.id) {
    throw new ApiError(403, "You are not authorized to cancel this booking");
  }

  next();
});
