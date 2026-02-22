// backend/routes/visitRoutes.js
const express = require("express");
const router = express.Router();
const visitController = require("../controllers/visitController");
const verifyToken = require("../middleware/authMiddleware");

// Route untuk dicatat (Public, dipanggil di Homepage)
router.post("/", visitController.recordVisit);

// Route untuk melihat data (Admin only)
router.get("/stats", verifyToken, visitController.getStats);

module.exports = router;
