const request = require("supertest");
const express = require("express");
const { createTransaction, handleNotification } = require("../controllers/paymentController");

// --- MOCKING DATABASE & MIDTRANS ---
// Kita pura-pura (mock) biar ga nembak database asli & server midtrans beneran
jest.mock("../config/database", () => ({
  query: jest.fn(),
}));
jest.mock("midtrans-client", () => ({
  Snap: jest.fn().mockImplementation(() => ({
    createTransaction: jest.fn().mockResolvedValue({ token: "MOCK_TOKEN_123" }),
  })),
}));
jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue(true),
  }),
}));

const db = require("../config/database");
const app = express();
app.use(express.json());
app.post("/api/payment/purchase", createTransaction);
app.post("/api/payment/notification", handleNotification);

describe("Payment System Tests", () => {
  // TEST 1: Cek apakah Endpoint Purchase jalan?
  test("POST /purchase - Harus return token jika data benar", async () => {
    // Pura-pura database menemukan produk harga 50rb
    db.query.mockResolvedValueOnce([[{ id: 1, name: "Stiker Lucu", price: 50000 }]]);
    db.query.mockResolvedValueOnce([]); // Mock insert transaksi

    const res = await request(app).post("/api/payment/purchase").send({
      product_id: 1,
      customer_name: "Tester",
      customer_email: "test@example.com",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.token).toBe("MOCK_TOKEN_123");
  });

  // TEST 2: Cek Webhook Midtrans
  test("POST /notification - Harus update status jadi SUCCESS jika settlement", async () => {
    // Pura-pura update database sukses
    db.query.mockResolvedValueOnce({ affectedRows: 1 }); // Update status
    // Pura-pura select data untuk kirim email
    db.query.mockResolvedValueOnce([[{ customer_email: "test@mail.com", product_name: "Stiker" }]]);

    const res = await request(app).post("/api/payment/notification").send({
      order_id: "LUMA-123",
      transaction_status: "settlement",
      fraud_status: "accept",
    });

    expect(res.statusCode).toBe(200);
    // Pastikan database di-query untuk UPDATE
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE transactions SET status"),
      expect.arrayContaining(["success", "LUMA-123"]),
    );
  });
});
