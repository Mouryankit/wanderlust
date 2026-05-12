const Listing = require("../models/listing");
const Booking = require("../models/booking");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");

// Get all listings owned by current user
module.exports.getUserListings = wrapAsync(async (req, res) => {
    const listings = await Listing.find({ owner: req.user.id })
        .populate({ path: "reviews", select: "rating" });
    res.status(200).json(listings);
});

// Get all bookings made by current user
module.exports.getUserBookings = wrapAsync(async (req, res) => {
    const bookings = await Booking.find({ user: req.user.id }).populate("listing", "title");
    // console.log(bookings);
    // console.log(bookings.listing.owner);
    res.status(200).json(bookings);
});

// Get all reviews written by current user
module.exports.getUserReviews = wrapAsync(async (req, res) => {
    
    let reviews = await Review.find({ author: req.user.id }).populate("listing", "title");

    res.status(200).json(reviews);
    
});
