// backend/tests/product_upload.test.js
const request = require("supertest");
const express = require("express");
const productController = require("../controllers/productController");

// === 1. MOCK DATABASE ===
// Kita mock 'query' agar test TIDAK butuh koneksi DB asli (aman & cepat)
jest.mock("../config/database", () => ({
  query: jest.fn(),
}));
const db = require("../config/database");

// === 2. MOCK CLOUDINARY ===
jest.mock("../middleware/uploadMiddleware", () => ({
  cloudinary: {
    uploader: { destroy: jest.fn() },
  },
}));

// === 3. SETUP EXPRESS APP ===
const app = express();
app.use(express.json()); // Parsing JSON body
app.use(express.urlencoded({ extended: true }));

// === 4. MOCK MIDDLEWARE (REVISI) ===
const mockUploadMiddleware = (req, res, next) => {
  // LOGIC BARU: Cek Environment Variable langsung
  const isProduction = process.env.NODE_ENV === "production";

  // Simulasi file yang diupload
  req.files = [
    {
      fieldname: "images",
      originalname: "test-sticker.jpg",
      encoding: "7bit",
      mimetype: "image/jpeg",
      destination: "public/uploads",
      filename: "test-sticker-123.jpg",
      // Jika ENV production, mock path Cloudinary. Jika Dev, path local.
      path: isProduction
        ? "https://res.cloudinary.com/demo/image/upload/sample.jpg"
        : "public/uploads/test-sticker-123.jpg",
      size: 1024,
    },
  ];
  next();
};

// Route Test
app.post("/api/products", mockUploadMiddleware, productController.createProduct);

describe("POST /api/products - Upload Logic", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks(); // Hapus jejak panggilan fungsi sebelumnya
    jest.resetModules(); // Reset module cache agar env baru terbaca
    process.env = { ...OLD_ENV }; // Reset env bersih setiap test dimulai
  });

  afterAll(() => {
    process.env = OLD_ENV; // Kembalikan env asli setelah semua test selesai
  });

  test("Should create product with CLOUDINARY URL in PRODUCTION", async () => {
    // 1. Set Environment ke Production
    process.env.NODE_ENV = "production";
    process.env.API_BASE_URL = "https://api.lumasticker.com";

    // 2. Mock DB response (Simulasi sukses insert)
    db.query.mockResolvedValue([{ insertId: 100 }]);

    // 3. Request
    const res = await request(app)
      .post("/api/products")
      .send({
        name: "Stiker Production",
        price: 50000,
        description: "Deskripsi Pro",
        image_labels: JSON.stringify(["Tampak Depan"]),
        trakteer_link: "https://trakteer.id/inkvoid/shop/stiker-production-AbCdE",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);

    const savedImage = res.body.data.images[0];

    // Pastikan URL yang tersimpan adalah link Cloudinary
    expect(savedImage.url).toContain("https://res.cloudinary.com");

    // Pastikan trakteer_link tersimpan
    expect(res.body.data.trakteer_link).toBe("https://trakteer.id/inkvoid/shop/stiker-production-AbCdE");
  });

  test("Should create product with LOCALHOST URL in DEVELOPMENT", async () => {
    // 1. Set Environment ke Development
    process.env.NODE_ENV = "development";
    process.env.API_BASE_URL = "http://localhost:3000"; // Simulasi Base URL

    // 2. Mock DB
    db.query.mockResolvedValue([{ insertId: 101 }]);

    // 3. Request
    const res = await request(app)
      .post("/api/products")
      .send({
        name: "Stiker Local",
        price: 15000,
        description: "Deskripsi Loc",
        image_labels: JSON.stringify(["Label A"]),
        trakteer_link: "https://trakteer.id/inkvoid/shop/stiker-local-XyZwQ",
      });

    expect(res.statusCode).toBe(201);

    const savedImage = res.body.data.images[0];
    // Controller akan menggabungkan API_BASE_URL + path lokal
    // Hasil: http://localhost:3000/uploads/test-sticker-123.jpg
    expect(savedImage.url).toBe("http://localhost:3000/uploads/test-sticker-123.jpg");

    // Pastikan trakteer_link tersimpan
    expect(res.body.data.trakteer_link).toBe("https://trakteer.id/inkvoid/shop/stiker-local-XyZwQ");
  });

  test("Should create product WITHOUT trakteer_link (optional field)", async () => {
    process.env.NODE_ENV = "development";
    process.env.API_BASE_URL = "http://localhost:3000";

    db.query.mockResolvedValue([{ insertId: 102 }]);

    const res = await request(app)
      .post("/api/products")
      .send({
        name: "Stiker Tanpa Trakteer",
        price: 10000,
        description: "Produk tanpa link trakteer",
        image_labels: JSON.stringify(["Label B"]),
        // trakteer_link tidak dikirim
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.trakteer_link).toBeNull();
  });

  test("Should fail if required fields are missing", async () => {
    // Test validasi input
    const res = await request(app).post("/api/products").send({
      price: 15000,
      description: "Tanpa Nama",
      // name tidak dikirim
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("wajib diisi");
  });
});
