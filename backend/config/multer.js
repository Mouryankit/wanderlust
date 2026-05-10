const multer = require("multer");     //multer middleware is used to handle file upload 
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
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 } // max 2MB limit allowed 
});

module.exports = upload;