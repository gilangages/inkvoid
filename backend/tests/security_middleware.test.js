const request = require("supertest");
const express = require("express");
const productController = require("../controllers/productController");
const visitController = require("../controllers/visitController"); // <--- Tambahkan import visitController
const verifyToken = require("../middleware/authMiddleware");

// === MOCK DB & DEPENDENCIES ===
jest.mock("../config/database", () => ({
  query: jest.fn(),
  execute: jest.fn(), // <--- visitController pakai execute, jadi kita mock juga
}));

jest.mock("../middleware/uploadMiddleware", () => ({
  upload: { array: () => (req, res, next) => next() }, // Bypass Multer
}));

// === SETUP APP ===
const app = express();
app.use(express.json());

// Load Routes Manual untuk Test
app.post("/api/products", verifyToken, productController.createProduct);
app.delete("/api/products/:id", verifyToken, productController.deleteProduct);

// <--- Tambahkan route test untuk visit stats
app.get("/api/visits/stats", verifyToken, visitController.getStats);

describe("Security Middleware Test (No Token & Invalid Token)", () => {
  // --- TEST PRODUK ---
  test("POST /products WITHOUT token should return 401", async () => {
    const res = await request(app)
      .post("/api/products")
      .send({ name: "Hacker Product", price: 0, description: "Hack" });

    // Expect Backend menolak
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/akses ditolak|token tidak ada/i);
  });

  test("DELETE /products/:id WITHOUT token should return 401", async () => {
    const res = await request(app).delete("/api/products/1");

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test("POST /products WITH INVALID token should return 403", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", "Bearer TOKEN_PALSU_NGASAL")
      .send({ name: "Product", price: 1000, description: "Test" });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/token tidak valid/i);
  });

  // --- TEST VISIT STATS BARU ---
  test("GET /visits/stats WITHOUT token should return 401", async () => {
    const res = await request(app).get("/api/visits/stats");

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/akses ditolak|token tidak ada/i);
  });

  test("GET /visits/stats WITH INVALID token should return 403", async () => {
    const res = await request(app).get("/api/visits/stats").set("Authorization", "Bearer TOKEN_PALSU_NGASAL");

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/token tidak valid/i);
  });
});
