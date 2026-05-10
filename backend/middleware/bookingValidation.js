const Booking = require("../models/booking");
const Listing = require("../models/listing");
const ApiError = require("../utils/ApiError");
const wrapAsync = require("../utils/wrapAsync");

exports.verifyAvailability = wrapAsync(async (req, res, next) => {
  const { id } = req.params; // listing id
  const { checkIn, checkOut, guests, rooms } = req.body;

  if (!checkIn || !checkOut || !guests || !rooms) {
    throw new ApiError(400, "Please provide checkIn, checkOut, guests, and rooms");
  }

  const listing = await Listing.findById(id);

  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }

  // Prevent owner from booking their own listing
  if (listing.owner.toString() === req.user.id) {
    throw new ApiError(400, "You cannot book your own listing");
  }

  // Check Availability (Overbooking check with Overlapping Ranges)
  const overlappingBookings = await Booking.find({
    listing: id,
    status: "confirmed",
    $or: [
      { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } }
    ]
  });

  const start = new Date(checkIn);
  const end = new Date(checkOut);

  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    let roomsOccupiedOnThisDay = 0;

    overlappingBookings.forEach(b => {
      const bStart = new Date(b.checkIn);
      const bEnd = new Date(b.checkOut);
      if (d >= bStart && d < bEnd) {
        roomsOccupiedOnThisDay += (b.rooms || 1);
      }
    });

    if (roomsOccupiedOnThisDay + rooms > (listing.totalRooms || Infinity)) {
      throw new ApiError(400, `No more rooms available for the date: ${d.toDateString()}. (Only ${(listing.totalRooms || 1) - roomsOccupiedOnThisDay} rooms left)`);
    }
  }

  // Calculate total price
  const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));

  if (days <= 0) {
    throw new ApiError(400, "Invalid booking dates");
  }

  const totalPrice = days * listing.price * rooms;

  // Attach data to request so the next controller can use it
  req.bookingData = {
    listing,
    totalPrice,
    days
  };

  next();
});
