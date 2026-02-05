const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware"); // <--- 1. Import Middleware

const {
  createTransaction,
  handleNotification,
  getAllTransactions,
  updateTransactionStatus, // <--- Pastikan ini di-import juga
} = require("../controllers/paymentController");

// --- PUBLIC ROUTES (Siapapun boleh akses) ---
router.post("/purchase", createTransaction); // Pembeli mau beli
router.post("/notification", handleNotification); // Webhook/Notifikasi

// --- ADMIN ROUTES (Hanya Admin yang boleh akses) ---
// Tambahkan 'verifyToken' sebagai parameter kedua sebelum controller
router.get("/admin/transactions", verifyToken, getAllTransactions);
router.put("/admin/transaction/:order_id", verifyToken, updateTransactionStatus);

module.exports = router;
