// backend/tests/payment.test.js
const request = require("supertest");
const express = require("express");

// --- 1. MOCK DATABASE SAJA (Midtrans tidak perlu dimock lagi) ---
jest.mock("../config/database", () => ({
  query: jest.fn(),
}));

const db = require("../config/database");
const paymentRoutes = require("../routes/paymentRoutes");

const app = express();
app.use(express.json());
app.use("/api/payment", paymentRoutes);

describe("Payment Controller (WhatsApp Mode)", () => {
  beforeEach(() => {
    db.query.mockClear();
  });

  // --- TEST CASE 1: BERHASIL MEMBUAT ORDER MANUAL ---
  it("Harus berhasil membuat order manual & simpan ke DB (200 OK)", async () => {
    // Mock 1: Produk Ditemukan
    db.query.mockResolvedValueOnce([
      [
        {
          id: 1,
          name: "Stiker Luma",
          price: 15000,
        },
      ],
    ]);
    // Mock 2: Insert Transaksi Sukses
    db.query.mockResolvedValueOnce([{ insertId: 123 }]);

    // Kirim Request
    const res = await request(app).post("/api/payment/purchase").send({
      product_id: 1,
      customer_name: "Abdian",
      customer_email: "abdian@test.com",
    });

    // Verifikasi Response
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.order_id).toMatch(/LUMA-WA-/); // Pastikan format ID benar
    expect(res.body.token).toBeNull(); // Tidak boleh ada token Midtrans

    // Verifikasi Database Dipanggil
    // Panggilan pertama: Select Product
    expect(db.query).toHaveBeenNthCalledWith(1, expect.stringContaining("SELECT * FROM products"), [1]);

    // Panggilan kedua: Insert Transaction
    // Kita cek apakah status yang diinsert adalah 'pending' dan token 'whatsapp-manual'
    const insertCall = db.query.mock.calls[1];
    expect(insertCall[0]).toContain("INSERT INTO transactions");
    expect(insertCall[1]).toEqual(expect.arrayContaining(["abdian@test.com", "whatsapp-manual"]));
  });

  // --- TEST CASE 2: PRODUK TIDAK DITEMUKAN ---
  it("Harus gagal jika produk tidak valid (404)", async () => {
    // Mock: Produk Kosong
    db.query.mockResolvedValueOnce([[]]);

    const res = await request(app).post("/api/payment/purchase").send({
      product_id: 999,
      customer_name: "User Nyasar",
      customer_email: "nyasar@example.com",
    });

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toContain("tidak ditemukan");
  });
});
