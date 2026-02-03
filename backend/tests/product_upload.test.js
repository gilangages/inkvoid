// 1. Setup Environment Variables PALING ATAS
const path = require("path");
const dotenv = require("dotenv");

// Paksa load .env dari folder backend
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// --- SET TIMEOUT LEBIH LAMA ---
// Default Jest cuma 5 detik. Kita naikkan jadi 30 detik untuk jaga-jaga koneksi DB lambat.
jest.setTimeout(30000);

// --- MOCKING (PENTING: Harus sebelum require middleware/controller) ---
// Ini mencegah test menghubungi server Cloudinary asli
const MOCK_IMAGE_URL = "https://res.cloudinary.com/dummy/image/upload/v12345/sample.jpg";

jest.mock("cloudinary", () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn().mockResolvedValue({ secure_url: MOCK_IMAGE_URL }),
    },
  },
}));

jest.mock("multer-storage-cloudinary", () => {
  return {
    CloudinaryStorage: jest.fn().mockImplementation(() => ({
      _handleFile: (req, file, cb) => {
        // Simulasi sukses upload: langsung kembalikan path dummy tanpa delay
        cb(null, {
          path: MOCK_IMAGE_URL,
          filename: file.originalname,
        });
      },
      _removeFile: (req, file, cb) => cb(null),
    })),
  };
});

// Fallback Database Config (Biar gak error kalau env gak kebaca)
if (!process.env.DB_USER) process.env.DB_USER = "root";
if (process.env.DB_PASS === undefined) process.env.DB_PASS = "";
if (!process.env.DB_NAME) process.env.DB_NAME = "lumastore_db";

const request = require("supertest");
const express = require("express");
const db = require("../config/database");
const productController = require("../controllers/productController");
const upload = require("../middleware/uploadMiddleware");

// Setup App Khusus Testing
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- FAKE AUTH MIDDLEWARE (Bypass Login) ---
const mockAuth = (req, res, next) => {
  req.user = { id: 999, role: "admin", email: "test@admin.com" };
  next();
};

// --- RAKIT ROUTE MANUAL ---
app.post("/api/products", mockAuth, upload.array("images"), productController.createProduct);

describe("POST /api/products (Upload Feature)", () => {
  const testProductName = "Produk Test Upload " + Date.now();

  // Test Case 1: Upload Sukses
  it("should upload multiple images and save product to database", async () => {
    const res = await request(app)
      .post("/api/products")
      .field("name", testProductName)
      .field("price", 50000)
      .field("description", "Ini deskripsi test dengan gambar")
      // Simulasi upload file (membuat file palsu di memori)
      .attach("images", Buffer.from("fake image data 1"), "foto1.jpg")
      .attach("images", Buffer.from("fake image data 2"), "foto2.png");

    // Debugging jika error
    if (res.statusCode !== 201) {
      console.error("❌ Test Failed Response:", res.body);
    }

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe(testProductName);

    // Validasi apakah gambar tersimpan
    expect(Array.isArray(res.body.data.images)).toBe(true);
    expect(res.body.data.images.length).toBe(2);

    // Cek apakah URL-nya sesuai dengan Mock Cloudinary
    // Karena sekarang pakai mock, URL-nya pasti mock URL, bukan localhost/uploads
    expect(res.body.data.images[0]).toContain("https://res.cloudinary.com");
  });

  // Test Case 2: Gagal jika nama/harga kosong
  it("should fail if name or price is missing", async () => {
    const res = await request(app).post("/api/products").field("description", "Lupa nama dan harga");
    expect(res.statusCode).toEqual(400);
  });

  // Test Case 3: Gagal jika deskripsi kosong
  it("should fail if description is missing", async () => {
    const res = await request(app)
      .post("/api/products")
      .field("name", "Produk Tanpa Deskripsi")
      .field("price", 50000)
      .attach("images", Buffer.from("fake"), "foto.jpg");

    expect(res.statusCode).toEqual(400);
    // Regex /deskripsi wajib diisi/i (case insensitive) biar lebih fleksibel
    expect(res.body.message).toMatch(/deskripsi wajib diisi/i);
  });

  // Test Case 4: Gagal jika gambar kosong
  it("should fail if image is missing", async () => {
    const res = await request(app)
      .post("/api/products")
      .field("name", "Produk Tanpa Gambar")
      .field("price", 50000)
      .field("description", "Ini deskripsi ada");

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toContain("Minimal upload 1 gambar");
  });
});

afterAll(async () => {
  // Bersihkan data sampah hasil test dari database
  try {
    await db.query("DELETE FROM products WHERE name LIKE 'Produk Test Upload%'");
  } catch (err) {
    console.error("Gagal membersihkan data test:", err);
  }

  // Tutup koneksi agar Jest bisa selesai (Force Close Pool)
  if (db && db.end) {
    await db.end();
  }
});
