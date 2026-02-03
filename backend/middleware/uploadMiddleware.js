const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setting Storage Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "lumastore_products", // Nama folder di Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp", "gif"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }], // Best practice: limit ukuran
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Batasi 5MB
});

module.exports = upload;
