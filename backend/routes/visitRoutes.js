// backend/routes/visitRoutes.js
const express = require("express");
const router = express.Router();
const visitController = require("../controllers/visitController");

// Route untuk dicatat (Public, dipanggil di Homepage)
router.post("/", visitController.recordVisit);

// Route untuk melihat data (Admin only)
router.get("/stats", visitController.getStats);

module.exports = router;
