const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");
const fs = require("fs");

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

let storage;

// LOGIC: Cek Environment
const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  // === MODE PRODUCTION (Cloudinary) ===
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "lumastore_products",
      allowed_formats: ["jpg", "png", "jpeg", "webp", "gif"],
      transformation: [{ width: 1000, height: 1000, crop: "limit" }],
    },
  });
} else {
  // === MODE LOCAL / DEVELOPMENT ===
  // Pastikan folder uploads ada
  const uploadDir = path.join(__dirname, "../public/uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      // Format: timestamp-namafile.ext (untuk menghindari nama kembar)
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
  });
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Batasi 5MB
});

module.exports = { upload, cloudinary }; // Export cloudinary untuk dipakai delete di controller
