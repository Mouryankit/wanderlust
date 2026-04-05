const express = require("express");
const router = express.Router({ mergeParams: true });

const { createBooking, destroyBooking, index } = require("../controllers/booking");
const protect = require("../middleware/auth");
const { isBookingOwner } = require("../middleware/bookingAuth");

// Route to get all bookings for a listing
router.get("/", index);

// Route to create a booking
router.post("/", protect, createBooking);

// Route to cancel a booking
router.delete("/:bookingId", protect, isBookingOwner, destroyBooking);

module.exports = router;