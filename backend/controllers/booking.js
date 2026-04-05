const Booking = require("../models/booking");
const Listing = require("../models/listing");
const ApiError = require("../utils/ApiError");
const wrapAsync = require("../utils/wrapAsync");

// Get all bookings for a listing
exports.index = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const bookings = await Booking.find({ listing: id }).populate("user");
  res.status(200).json(bookings);
});

// Create Booking
exports.createBooking = wrapAsync(async (req, res) => {
  const { id } = req.params; // listing id
  const { checkIn, checkOut, guests, rooms } = req.body;

  const listing = await Listing.findById(id);

  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }

  // 0. Prevent owner from booking their own listing
  if (listing.owner.toString() === req.user.id) {
    throw new ApiError(400, "You cannot book your own listing");
  }

  // 1. Check Availability (Overbooking check with Overlapping Ranges)
  // Fetch all confirmed bookings for this listing that overlap with the requested range
  const overlappingBookings = await Booking.find({
    listing: id,
    status: "confirmed",
    $or: [
      { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } }
    ]
  });

  // Calculate peak occupancy for each day in the requested range
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    let roomsOccupiedOnThisDay = 0;
    
    overlappingBookings.forEach(b => {
      const bStart = new Date(b.checkIn);
      const bEnd = new Date(b.checkOut);
      // Check if this date 'd' falls within booking 'b' range [bStart, bEnd)
      if (d >= bStart && d < bEnd) {
        roomsOccupiedOnThisDay += (b.rooms || 1);
      }
    });

    if (roomsOccupiedOnThisDay + rooms > listing.totalRooms) {
      throw new ApiError(400, `No more rooms available for the date: ${d.toDateString()}. (Only ${listing.totalRooms - roomsOccupiedOnThisDay} rooms left)`);
    }
  }

  // 💰 2. Calculate total price
  const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));

  if (days <= 0) {
    throw new ApiError(400, "Invalid booking dates");
  }

  const totalPrice = days * listing.price * rooms;

  // 3. Save Booking
  const booking = new Booking({
    listing: id,
    user: req.user.id,
    checkIn,
    checkOut,
    guests,
    rooms,
    totalPrice,
    status: "confirmed",
  });

  // console.log(booking);
  // console.log(days, listing.price);
  await booking.save();

  res.status(201).json({
    message: "Booking successful",
    booking,
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