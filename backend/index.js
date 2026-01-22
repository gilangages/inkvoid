const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const productRoutes = require("./routes/productRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/openapi.json");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Supaya bisa baca JSON dari Frontend

app.use("/api/products", productRoutes); // <--- Pasang Jalurnya di sini
app.use("/api/payment", paymentRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Test Route
app.get("/", (req, res) => {
  res.send("Server Luma (MySQL Version) is Running! 🚀");
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
