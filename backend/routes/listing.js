const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listing");
const protect = require("../middleware/auth");
const { validateListing } = require("../middleware/validation");
const { isOwner } = require("../middleware/authorization");
const { uploadListingImage, deleteListingImage } = require("../middleware/upload");


const multer = require("multer");
// no storage config → files kept in memory (temporary)
const upload = multer();


// RESTful Routes for Listings
router
    .route("/")
    .get(        // Index - Get all listings
        listingController.index
    )
    .post(      // Create - Add new listing
        protect, // Protect this route, only authenticated users can create listings
        uploadListingImage,
        validateListing,
        listingController.createListing
    );

router
    .route("/:id")
    .get(listingController.showListing)     // Show - Get listing
    .put(
        protect,
        isOwner,
        uploadListingImage,
        validateListing,
        listingController.updateListing,
        deleteListingImage
    )   // Update - Edit listing
    .delete(
        protect,
        isOwner,
        listingController.destroyListing,
        deleteListingImage
    ); // Delete - Destroy listing

module.exports = router;