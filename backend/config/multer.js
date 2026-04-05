const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudConfig");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "WanderLust",
        allowed_formats: ["jpg", "png", "jpeg"],
    },
});

const upload = multer({ 
    storage,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

module.exports = upload;