// adding category features
const categories = [
    "Rooms",
    "Iconic Cities",
    "Mountains",
    "Castles",
    "Camping",
    "Farms",
    "Arctic",
    "Domes",
    "Boats",
    "Beach",
    "City",
    "Forest",
];


// after adding owner
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const Booking = require("./booking");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }, //per room
    location: {
        name: String, // "Manali, Himachal"
        // add in future: geometry for map integration
        // geometry: {
        //     type: {
        //         type: String,
        //         enum: ["Point"],
        //         required: true
        //     },
        //         coordinates: {
        //         type: [Number],
        //         required: true
        //     }
        // }
    },
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    category: {
        type: String,
        required: true,
        enum: categories,
    },
    totalRooms: {
        type: Number,
        required: true,
        min: 1
    }
}, { timestamps: true });

// middleware to delete all reviews and bookings associated with a listing when listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
        await Booking.deleteMany({ listing: listing._id });
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

