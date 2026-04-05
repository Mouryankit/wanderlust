const Listing = require("../models/listing");
const Booking = require("../models/booking");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");

// Get all listings owned by current user
module.exports.getUserListings = wrapAsync(async (req, res) => {
    const listings = await Listing.find({ owner: req.user.id });
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
    // 1. Fetch reviews by author
    let reviews = await Review.find({ author: req.user.id }).populate("listing", "title");

    // // 2. Robust check for legacy reviews that might not have the 'listing' field populated
    // const legacyReviews = reviews.filter(r => !r.listing);

    // if (legacyReviews.length > 0) {
    //     const legacyIds = legacyReviews.map(r => r._id);
    //     // Find all listings that contain these review IDs in their reviews array
    //     const parentListings = await Listing.find({ reviews: { $in: legacyIds } }).select("title reviews");

    //     reviews = reviews.map(r => {
    //         if (!r.listing) {
    //             const parent = parentListings.find(l => l.reviews.includes(r._id));
    //             if (parent) {
    //                 return { 
    //                     ...r.toObject(), 
    //                     listing: { _id: parent._id, title: parent.title } 
    //                 };
    //             }
    //         }
    //         return r;
    //     });
    // }

    res.status(200).json(reviews);
});
