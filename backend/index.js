const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const productRoutes = require("./routes/productRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/openapi.json");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const authRoutes = require("./routes/authRoutes");

// Izinkan Localhost DAN Domain Vercel kamu nanti
const allowedOrigins = [
  "http://localhost:5173", // Untuk development lokal
  "https://lumasticker.vercel.app", // GANTI dengan domain asli Vercel kamu nanti
];

app.use(
  cors({
    origin: function (origin, callback) {
      // (!origin) membolehkan request dari Postman/Server-to-server
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Jika pakai cookies/auth header
  }),
);

app.use(express.json()); // Supaya bisa baca JSON dari Frontend

// === PERBAIKAN UTAMA DI SINI ===
// Izinkan akses ke folder public/uploads secara statis
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use("/api/products", productRoutes); // <--- Pasang Jalurnya di sini
app.use("/api/payment", paymentRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/admin", authRoutes);
app.use(express.urlencoded({ extended: true })); // <--- Tambahkan ini untuk form-data

// Test Route
app.get("/", (req, res) => {
  res.send("Server Luma (MySQL Version) is Running! 🚀");
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
