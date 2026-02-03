// backend/tests/product_upload.test.js
const request = require("supertest");
const express = require("express");
const productController = require("../controllers/productController");

// === 1. MOCK DATABASE ===
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
  // LOGIC BARU: Cek Environment Variable langsung, bukan property req
  const isProduction = process.env.NODE_ENV === "production";

  // Inject file palsu
  req.files = [
    {
      fieldname: "images",
      originalname: "test-sticker.jpg",
      encoding: "7bit",
      mimetype: "image/jpeg",
      destination: "public/uploads",
      filename: "test-sticker-123.jpg",
      // Jika ENV production, kita kasih URL Cloudinary. Jika tidak, kasih path lokal.
      path: isProduction
        ? "https://res.cloudinary.com/demo/image/upload/sample.jpg"
        : "public/uploads/test-sticker-123.jpg",
      size: 1024,
    },
  ];
  next();
};

app.post("/api/products", mockUploadMiddleware, productController.createProduct);

describe("POST /api/products - Upload Logic", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env = { ...OLD_ENV }; // Reset env bersih setiap test
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test("Should create product with CLOUDINARY URL in PRODUCTION", async () => {
    // 1. Set Environment ke Production
    process.env.NODE_ENV = "production";

    // 2. Mock DB response
    db.query.mockResolvedValue([{ insertId: 100 }]);

    // 3. Request
    const res = await request(app)
      .post("/api/products")
      .send({
        name: "Stiker Production",
        price: 50000,
        description: "Deskripsi Pro",
        image_labels: JSON.stringify(["Tampak Depan"]),
      });
    // Catatan: Kita tidak butuh .use() lagi karena middleware sudah pintar baca ENV

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);

    const savedImage = res.body.data.images[0];

    // Debugging (opsional, bisa dihapus)
    // console.log("Output URL di Test:", savedImage.url);

    expect(savedImage.url).toContain("https://res.cloudinary.com");
  });

  test("Should create product with LOCALHOST URL in DEVELOPMENT", async () => {
    // 1. Set Environment ke Development
    process.env.NODE_ENV = "development";
    process.env.API_BASE_URL = "http://localhost:3000"; // Paksa Base URL statis

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
      });

    expect(res.statusCode).toBe(201);

    const savedImage = res.body.data.images[0];
    // Controller akan menggabungkan API_BASE_URL + path lokal dari middleware
    expect(savedImage.url).toBe("http://localhost:3000/uploads/test-sticker-123.jpg");
  });

  test("Should fail if required fields are missing", async () => {
    const res = await request(app).post("/api/products").send({
      price: 15000, // Nama hilang
      description: "Tanpa Nama",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("wajib diisi");
  });
});
