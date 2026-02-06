// backend/tests/product_status.test.js
const request = require("supertest");
const express = require("express");
const productController = require("../controllers/productController");

// Mocks
jest.mock("../config/database", () => ({
  query: jest.fn(),
}));
const db = require("../config/database");

// Setup App
const app = express();
app.use(express.json());

// Mock Middleware
const mockAuth = (req, res, next) => next(); // Bypass auth for testing

// Routes
app.get("/products", productController.getAllProducts);
app.get("/products/admin/list", mockAuth, productController.getAdminProducts);
app.patch("/products/:id/status", mockAuth, productController.toggleProductStatus);

describe("Product Status & Toggle Features", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /products (Public) should ONLY query active products", async () => {
    db.query.mockResolvedValue([[]]); // Return empty array for simplicity

    await request(app).get("/products");

    // Expect query mengandung filter is_active = 1
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining("WHERE is_deleted = 0 AND is_active = 1"));
  });

  test("GET /products/admin/list (Admin) should query ALL products", async () => {
    db.query.mockResolvedValue([[]]);

    await request(app).get("/products/admin/list");

    // Expect query TIDAK mengandung is_active = 1, tapi cuma is_deleted = 0
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM products WHERE is_deleted = 0"));
  });

  test("PATCH /products/:id/status should toggle status from 1 to 0", async () => {
    // 1. Mock status saat ini = 1 (Active)
    db.query
      .mockResolvedValueOnce([[{ is_active: 1 }]]) // Select query result
      .mockResolvedValueOnce([{ affectedRows: 1 }]); // Update query result

    const res = await request(app).patch("/products/1/status");

    expect(res.statusCode).toBe(200);
    expect(res.body.data.is_active).toBe(0);
    expect(res.body.message).toContain("dinonaktifkan");

    // Pastikan query update dipanggil dengan nilai 0
    expect(db.query).toHaveBeenNthCalledWith(2, expect.stringContaining("UPDATE products SET is_active = ?"), [0, "1"]);
  });
});
