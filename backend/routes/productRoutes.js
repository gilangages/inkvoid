const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const verifyToken = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");

/// Public Route
router.get("/", productController.getAllProducts);

// Protected Routes (Hanya Admin yang punya Token yang bisa akses)
router.get("/admin/list", verifyToken, productController.getAdminProducts);
router.patch("/:id/status", verifyToken, productController.toggleProductStatus);
// // upload.array('images') membolehkan upload banyak file sekaligus
router.post("/", verifyToken, upload.array("images", 20), productController.createProduct);
router.put("/:id", verifyToken, upload.array("images", 20), productController.updateProduct);

router.delete("/:id", verifyToken, productController.deleteProduct);
router.post("/bulk-delete", verifyToken, productController.bulkDeleteProducts);

module.exports = router;
