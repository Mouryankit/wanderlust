const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ApiError = require("../utils/ApiError");
const Booking = require("../models/booking");
const Review = require("../models/review");
// Get all listings with search and availability logic
module.exports.index = wrapAsync(async (req, res) => {
  const { location, rooms, startDate, endDate, category } = req.query;
  const query = {};

  // 1. Filter by Category (if provided)
  if (category && category !== "All") {
    query.category = category;
  }

  // 2. Filter by Location/Country
  if (location) {
    query.$or = [
      { location: { $regex: location, $options: "i" } },
      { country: { $regex: location, $options: "i" } }
    ];
  }

  // 3. Filter by Rooms (Minimum required)
  if (rooms) {
    query.totalRooms = { $gte: parseInt(rooms) };
  }

  // 4. Fetch initial listings
  let listings = await Listing.find(query)
    .populate({ path: "owner", select: "username email" })
    .populate({ path: "reviews", select: "rating" });

  // 5. Availability Check (Overlap calculation)
  // If dates are provided, we must ensure the listing has enough rooms available
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const requestedRooms = parseInt(rooms) || 1;

    // Fetch all confirmed bookings that overlap with the searched range
    const overlappingBookings = await Booking.find({
      status: "confirmed",
      $or: [
        { checkIn: { $lt: end }, checkOut: { $gt: start } }
      ]
    });

    // Filter listings based on daily capacity
    listings = listings.filter(listing => {
      // For each day in the requested range, calculate occupied rooms
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        let occupiedOnThisDay = 0;

        overlappingBookings.forEach(b => {
          if (b.listing.toString() === listing._id.toString()) {
            const bStart = new Date(b.checkIn);
            const bEnd = new Date(b.checkOut);
            if (d >= bStart && d < bEnd) {
              occupiedOnThisDay += (b.rooms || 1);
            }
          }
        });

        if (occupiedOnThisDay + requestedRooms > listing.totalRooms) {
          return false; // Not enough rooms on this specific day
        }
      }
      return true;
    });
  }

  res.status(200).json(listings);
});

// Get single listing
module.exports.showListing = wrapAsync(async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  // console.log(req.params); 
  const listing = await Listing.findById(id)
    .populate({ path: "owner", select: "username email" })
    .populate({
      path: "reviews",
      populate: { path: "author", select: "username" }
    });
  // .populate({ path "author"});
  // console.log('how many'); 
  // console.log(listing);
  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }

  res.status(200).json(listing);
});


// creae listing
module.exports.createListing = wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body);

  // console.log("Creating listing with data:", req.body);

  // OLD LOGIC (Before Optimization):
  // if (req.user) {
  //   newListing.owner = req.user.id;
  // }

  /**
   * OPTIMIZATION 1:
   * Since the create route is already protected via the 'protect' middleware, 
   * we can strictly and directly assign the current user as the owner.
   */
  newListing.owner = req.user.id;

  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }
  // console.log("testing1");

  // console.log("testing2");
  // console.log(req.file);
  // console.log(req.body);
  // console.log(newListing);
  await newListing.save();

  res.status(201).json({
    message: "Listing created successfully",
    listing: newListing,
  });
});

module.exports.verify = (req, res) => {
  // console.log("BODY:", req.body); // text fields
  // console.log("FILE:", req.file); // file info
  // console.log(req.body.contactNo);
}
// ************************
// ***********************************
// edit listing

module.exports.updateListing = wrapAsync(async (req, res, next) => {
  // OLD LOGIC (Before Optimization):
  // const listing = await Listing.findByIdAndUpdate(id, { ...req.body }, { new: true });

  /**
   * OPTIMIZATION 2:
   * Instead of fetching the listing again, we reuse 'req.listing' which was 
   * already fetched and attached by the 'isOwner' middleware.
   */
  const listing = req.listing;
  const oldPublicId = listing.image?.filename;

  Object.assign(listing, req.body);

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }



  await listing.save();

  // If a new file was uploaded, store the old public ID for the middleware
  if (req.file && oldPublicId) {
    req.oldPublicId = oldPublicId;
  }

  res.locals.response = {
    message: "Listing updated successfully",
    listing,
  };
  next();
});


// // destroy listing
// module.exports.destroyListing = wrapAsync(async (req, res, next) => {
//   // OLD LOGIC (Before Optimization):
//   // const deletedListing = await Listing.findByIdAndDelete(id);

//   /**
//    * OPTIMIZATION 2:
//    * Same as update—we reuse 'req.listing' which was pre-fetched in the middleware,
//    * completely avoiding an extra database query.
//    */
//   const publicId = req.listing.image?.filename;
//   await req.listing.deleteOne();

//   // Store the public ID for the middleware to handle Cloudinary cleanup
//   req.publicId = publicId;

//   res.locals.response = {
//     message: "Listing deleted successfully",
//     listing: req.listing,
//   };
//   next();
// });


// destroy listing route 
module.exports.destroyListing = wrapAsync(async (req, res, next) => {
  const listing = req.listing;

  // Store image public id for Cloudinary deletion
  const publicId = listing.image?.filename;

  // Delete all reviews related to this listing
  await Review.deleteMany({ listing: listing._id });

  // Delete the listing itself
  await listing.deleteOne();

  // Pass image id to next middleware (for Cloudinary cleanup)
  req.publicId = publicId;

  // Prepare response
  res.locals.response = {
    message: "Listing deleted successfully",
    listing,
  };

  next();
});