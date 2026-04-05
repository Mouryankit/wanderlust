// const Listing = require("../models/listing");

// // Index - Get all listings
// module.exports.index = async (req, res) => {
//     try {
//         const allListings = await Listing.find({}).populate("owner");
//         res.status(200).json(allListings);
//     } catch (err) {
//         res.status(500).json({ message: "Error fetching listings", error: err.message });
//     }
// };

// // Show - Get single listing
// module.exports.showListing = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const listing = await Listing.findById(id).populate("owner").populate("reviews");
//         if (!listing) {
//             return res.status(404).json({ message: "Listing not found" });
//         }
//         res.status(200).json(listing);
//     } catch (err) {
//         res.status(500).json({ message: "Error fetching listing", error: err.message });
//     }
// };

// // Create - Save new listing
// module.exports.createListing = async (req, res) => {
//     // console.log("Received data for new listing:", req.body);
//     try {
//         const newListing = new Listing(req.body);
//         console.log("Creating listing with data:", req.body);
//         // Assuming user is authenticated and owner is in req.user
//         // if(req.user) newListing.owner = req.user._id; 
//         // await newListing.save();
//         res.status(201).json({ message: "Listing created successfully", listing: newListing });
//     } catch (err) {
//         res.status(400).json({ message: "Error creating listing", error: err.message });
//     }
// };

// // Update - Edit listing
// module.exports.updateListing = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const listing = await Listing.findByIdAndUpdate(id, { ...req.body }, { new: true });
//         if (!listing) {
//             return res.status(404).json({ message: "Listing not found" });
//         }
//         res.status(200).json({ message: "Listing updated successfully", listing });
//     } catch (err) {
//         res.status(400).json({ message: "Error updating listing", error: err.message });
//     }
// };

// // Delete - Destroy listing
// module.exports.destroyListing = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const deletedListing = await Listing.findByIdAndDelete(id);
//         if (!deletedListing) {
//             return res.status(404).json({ message: "Listing not found" });
//         }
//         res.status(200).json({ message: "Listing deleted successfully", listing: deletedListing });
//     } catch (err) {
//         res.status(500).json({ message: "Error deleting listing", error: err.message });
//     }
// };



const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ApiError = require("../utils/ApiError");

const Booking = require("../models/booking");

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
      { "location.name": { $regex: location, $options: "i" } },
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
  const listing = await Listing.findById(id)
    .populate({ path: "owner", select: "username email" })
    .populate({
      path: "reviews",
      populate: { path: "author", select: "username" }
    });
  // .populate({ path "author"});
  // console.log(listing);
  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }

  res.status(200).json(listing);
});


// creae listing
module.exports.createListing = wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body);

  //   console.log("Creating listing with data:", req.body);

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

  // Handle location object from flat fields
  if (req.body.locationName) {
    newListing.location = {
      name: req.body.locationName
    };
  }
  console.log(req.file);
  console.log(req.body);

  await newListing.save();

  res.status(201).json({
    message: "Listing created successfully",
    listing: newListing,
  });
});


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

  // Handle location object from flat fields
  if (req.body.locationName) {
    listing.location = {
      name: req.body.locationName
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


// destroy listing
module.exports.destroyListing = wrapAsync(async (req, res, next) => {
  // OLD LOGIC (Before Optimization):
  // const deletedListing = await Listing.findByIdAndDelete(id);

  /**
   * OPTIMIZATION 2:
   * Same as update—we reuse 'req.listing' which was pre-fetched in the middleware,
   * completely avoiding an extra database query.
   */
  const publicId = req.listing.image?.filename;
  await req.listing.deleteOne();

  // Store the public ID for the middleware to handle Cloudinary cleanup
  req.publicId = publicId;

  res.locals.response = {
    message: "Listing deleted successfully",
    listing: req.listing,
  };
  next();
});