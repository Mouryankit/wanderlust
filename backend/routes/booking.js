const express = require("express");
const router = express.Router({ mergeParams: true });
const { createBooking, destroyBooking, index, verifyBooking } = require("../controllers/booking");
const protect = require("../middleware/auth");
const { isBookingOwner } = require("../middleware/bookingAuth");
const { verifyAvailability } = require("../middleware/bookingValidation");
const { validateBooking } = require("../middleware/validation");

// Route to get all bookings for a listing
router.get("/", index);

// Route to verify if a booking is available
router.post("/verify", protect, validateBooking, verifyAvailability, verifyBooking);

// Route to create a booking
router.post("/", protect, validateBooking, verifyAvailability, createBooking);

// Route to cancel a booking
router.delete("/:bookingId", protect, isBookingOwner, destroyBooking);

module.exports = router;