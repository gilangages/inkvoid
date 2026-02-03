const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("../routes/authRoutes");
const productRoutes = require("../routes/productRoutes");

// Mock App untuk testing
const app = express();
app.use(bodyParser.json());
app.use("/api/admin", authRoutes);
// Kita mock product controller untuk tes proteksi
app.use("/api/products", productRoutes);

// Mock Implementation untuk Product Controller (supaya tidak perlu DB beneran saat tes auth)
jest.mock("../controllers/productController", () => ({
  getAllProducts: (req, res) => res.json([]),
  createProduct: (req, res) => res.status(201).json({ message: "Created" }),
  deleteProduct: (req, res) => res.status(200).json({ message: "Deleted" }),
  // TAMBAHKAN DUA FUNGSI INI AGAR ROUTER TIDAK CRASH:
  updateProduct: (req, res) => res.status(200).json({ message: "Updated" }),
  bulkDeleteProducts: (req, res) => res.status(200).json({ message: "Bulk Deleted" }),
}));

describe("Admin Auth & Security", () => {
  let token = "";

  // 1. Test Login Gagal
  it("should reject invalid credentials", async () => {
    const res = await request(app).post("/api/admin/login").send({ email: "salah@gmail.com", password: "ngawur" });

    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });

  // 2. Test Login Berhasil
  it("should login successfully with correct credentials", async () => {
    const res = await request(app).post("/api/admin/login").send({ email: "qbdian@gmail.com", password: "abdian123" }); // Sesuai hardcode

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token; // Simpan token untuk tes berikutnya
  });

  // 3. Test Akses Protected Route TANPA Token (Harus Gagal)
  it("should deny access to create product without token", async () => {
    const res = await request(app).post("/api/products").send({ name: "Produk Baru" });

    expect(res.statusCode).toEqual(401); // Unauthorized
  });

  // 4. Test Akses Protected Route DENGAN Token (Harus Sukses)
  it("should allow access to create product with token", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`) // Pasang token di header
      .send({ name: "Produk Baru" });

    expect(res.statusCode).toEqual(201);
  });
});
