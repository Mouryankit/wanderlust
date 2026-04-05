const upload = require("../config/multer");
const ApiError = require("../utils/ApiError");
const cloudinary = require("../config/cloudConfig");
const wrapAsync = require("../utils/wrapAsync");

exports.uploadListingImage = (req, res, next) => {
  console.log("Uploading image...");
  // console.log(req.file);
  // console.log(req.body);
  upload.single("image")(req, res, function (err) {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(new ApiError(400, "File too large (Max 2MB)"));
      }

      return next(new ApiError(400, err.message));
    }
    console.log("Image uploaded successfully");
    // console.log(req.file);
    // console.log(req.body);
    next();
  });
};

/**
 * Middleware: deleteListingImage
 * Handles deleting old/deleted listing images from Cloudinary storage.
 * Runs AFTER successful database update or deletion.
 */
exports.deleteListingImage = wrapAsync(async (req, res, next) => {
  const publicId = req.oldPublicId || req.publicId; // Fallback for either naming

  if (publicId) {
    console.log(`Deleting image from Cloudinary: ${publicId}`);
    try {
      await cloudinary.uploader.destroy(publicId);
      console.log("Image deleted from Cloudinary successfully");
    } catch (err) {
      console.error("Cloudinary deletion error:", err.message);
      // We don't throw here to ensure the client still gets the success response 
      // from the database operation.
    }
  }

  // Send the final response that was prepared in the controller
  if (res.locals.response) {
    return res.status(res.locals.statusCode || 200).json(res.locals.response);
  }

  // Fallback response if no data was provided by the controller
  res.status(200).json({ message: "Action completed successfully" });
});
