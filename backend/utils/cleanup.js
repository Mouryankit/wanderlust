const User = require("../models/user");
const Listing = require("../models/listing");
const Review = require("../models/review");
const Booking = require("../models/booking");
const cloudinary = require("../config/cloudConfig");

/**
 * Cleanup function to purge expired guest users and their associated records.
 * Ensures data integrity across MongoDB and Cloudinary.
 */
const runGuestCleanup = async () => {
  try {
    const now = new Date();
    
    // Find all expired guest users
    const expiredGuests = await User.find({
      isGuest: true,
      expiresAt: { $lt: now }
    });

    if (expiredGuests.length === 0) {
      return;
    }

    // console.log(`[Cleanup] Found ${expiredGuests.length} expired guest session(s). Starting purge...`);

    for (const guest of expiredGuests) {
      const guestId = guest._id;
      // console.log(`[Cleanup] Purging guest: ${guest.username} (${guest.email})`);

      // A. Cloudinary Cleanup for listings owned by this guest
      const listings = await Listing.find({ owner: guestId });
      for (const listing of listings) {
        if (listing.image && listing.image.filename) {
          try {
            // console.log(`[Cleanup] Deleting Cloudinary image: ${listing.image.filename} for listing: ${listing.title}`);
            await cloudinary.uploader.destroy(listing.image.filename);
          } catch (err) {
            console.error(`[Cleanup] Cloudinary image deletion failed for filename: ${listing.image.filename}`, err);
          }
        }
      }

      // B. Delete all listings owned by this guest, and their reviews/bookings
      for (const listing of listings) {
        // Delete all reviews of this listing
        await Review.deleteMany({ listing: listing._id });
        // Delete all bookings for this listing
        await Booking.deleteMany({ listing: listing._id });
        // Delete the listing
        await Listing.findByIdAndDelete(listing._id);
      }

      // C. Cleanup reviews written by this guest on other listings
      const guestReviews = await Review.find({ author: guestId });
      for (const review of guestReviews) {
        // Remove review reference from listing
        await Listing.updateOne(
          { _id: review.listing },
          { $pull: { reviews: review._id } }
        );
      }
      // Delete review documents
      await Review.deleteMany({ author: guestId });

      // D. Delete bookings created by this guest
      await Booking.deleteMany({ user: guestId });

      // E. Finally, delete the guest user document
      await User.findByIdAndDelete(guestId);

      // console.log(`[Cleanup] Successfully purged guest user: ${guest.username}`);
    }
  } catch (error) {
    console.error("[Cleanup Error] Guest cleanup failed:", error);
  }
};

module.exports = runGuestCleanup;
