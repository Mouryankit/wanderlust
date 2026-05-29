const Booking = require("../models/booking");
const Listing = require("../models/listing");
const ApiError = require("../utils/ApiError");
const wrapAsync = require("../utils/wrapAsync");

// Get all bookings for a listing
exports.index = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const bookings = await Booking.find({ listing: id }).populate("user", "username _id");
  // console.log(bookings);
  res.status(200).json(bookings);
});

// date normalization: produce a Date at 00:00 UTC for the provided calendar date
const normalizeDate = (date) => {
  if (!date) return null;

  // If date is a YYYY-MM-DD string (from frontend), parse as UTC
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [y, m, d] = date.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d));
  }

  // Otherwise, create a UTC date using the year/month/day of the provided Date
  const dObj = new Date(date);
  return new Date(Date.UTC(dObj.getFullYear(), dObj.getMonth(), dObj.getDate()));
};

// Create Booking
exports.createBooking = wrapAsync(async (req, res) => {
  const { id } = req.params; // listing id
  const { checkIn, checkOut, guests, rooms } = req.body;
  const { totalPrice } = req.bookingData;

  // Save Booking
  const booking = new Booking({
    listing: id,
    user: req.user.id,
    checkIn: normalizeDate(checkIn),
    checkOut: normalizeDate(checkOut),
    guests,
    rooms,
    totalPrice,
    status: "confirmed",
  });

  await booking.save();

  res.status(201).json({
    message: "Booking successful",
    booking,
  });
});

// Verify Booking Availability
exports.verifyBooking = wrapAsync(async (req, res) => {
  res.status(200).json({
    message: "Booking dates are available",
    available: true,
    totalPrice: req.bookingData.totalPrice,
  });
});

// Cancel Booking
exports.destroyBooking = wrapAsync(async (req, res) => {
  const { bookingId } = req.params;

  // Instead of deleting, we can update status to "cancelled" 
  // or truly delete based on user needs. User said "cancel booking".
  // Let's do a soft cancel first for record keeping, or hard delete if they prefer "destroy".
  // Usually "cancel" means changing status.
  const booking = await Booking.findByIdAndUpdate(bookingId, { status: "cancelled" }, { new: true });

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  res.status(200).json({
    message: "Booking cancelled successfully",
    booking
  });
});