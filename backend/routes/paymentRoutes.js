const express = require("express");
const router = express.Router();
const { createTransaction, handleNotification, getAllTransactions } = require("../controllers/paymentController");

// Jalur: POST /api/payment/purchase
router.post("/purchase", createTransaction);
router.post("/notification", handleNotification);
// Tambahkan route ini (sebaiknya beri middleware auth admin nanti)
router.get("/admin/transactions", getAllTransactions);

module.exports = router;
