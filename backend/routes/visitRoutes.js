// backend/routes/visitRoutes.js
const express = require("express");
const router = express.Router();
const visitController = require("../controllers/visitController");
const verifyToken = require("../middleware/authMiddleware");

// Route untuk dicatat (Public, dipanggil di Homepage)
router.post("/", visitController.recordVisit);

// Route untuk melihat data (Admin only)
router.get("/stats", verifyToken, visitController.getStats);

// Route untuk daftar pengunjung dengan pagination (Admin only)
router.get("/list", verifyToken, visitController.getVisitors);

// Route untuk hapus semua visitor (Admin only)
// PENTING: Route '/all' harus di ATAS '/:id' agar tidak bentrok
router.delete("/all", verifyToken, visitController.deleteAllVisitors);

// Route untuk hapus visitor satuan (Admin only)
router.delete("/:id", verifyToken, visitController.deleteVisitor);

module.exports = router;
