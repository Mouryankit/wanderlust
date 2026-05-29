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
  // normalize incoming dates to UTC-midnight to avoid timezone mismatches
  const normalizeDate = (date) => {
    if (!date) return null;
    if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [y, m, d] = date.split("-").map(Number);
      return new Date(Date.UTC(y, m - 1, d));
    }
    const dObj = new Date(date);
    return new Date(Date.UTC(dObj.getFullYear(), dObj.getMonth(), dObj.getDate()));
  };

  const start = normalizeDate(checkIn);
  const end = normalizeDate(checkOut);

  const overlappingBookings = await Booking.find({
    listing: id,
    status: "confirmed",
    $or: [
      { checkIn: { $lt: end }, checkOut: { $gt: start } }
    ]
  });

  for (let d = new Date(start); d < end; d.setUTCDate(d.getUTCDate() + 1)) {
    let roomsOccupiedOnThisDay = 0;

    overlappingBookings.forEach(b => {
      const bStart = new Date(Date.UTC(b.checkIn.getUTCFullYear(), b.checkIn.getUTCMonth(), b.checkIn.getUTCDate()));
      const bEnd = new Date(Date.UTC(b.checkOut.getUTCFullYear(), b.checkOut.getUTCMonth(), b.checkOut.getUTCDate()));
      if (d >= bStart && d < bEnd) {
        roomsOccupiedOnThisDay += (b.rooms || 1);
      }
    });

    if (roomsOccupiedOnThisDay + rooms > (listing.totalRooms || Infinity)) {
      throw new ApiError(400, `No more rooms available for the date: ${d.toDateString()}. (Only ${(listing.totalRooms || 1) - roomsOccupiedOnThisDay} rooms left)`);
    }
  }

  // Calculate total price
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

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
