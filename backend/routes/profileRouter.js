const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileControllers");
const protect = require("../middleware/auth");

router.get("/listings", protect, profileController.getUserListings);
router.get("/bookings", protect, profileController.getUserBookings);
router.get("/reviews", protect, profileController.getUserReviews);

module.exports = router;
