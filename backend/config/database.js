const mysql = require("mysql2");
require("dotenv").config();

let pool;

// Cek apakah ada DATABASE_URL di .env (Prioritas untuk TiDB/Production)
if (process.env.DATABASE_URL) {
  console.log("🌐 Menggunakan koneksi Cloud (TiDB)...");

  pool = mysql.createPool({
    uri: process.env.DATABASE_URL, // Menggunakan Connection String lengkap
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // TiDB membutuhkan koneksi SSL yang aman
    ssl: {
      rejectUnauthorized: true,
      minVersion: "TLSv1.2",
    },
  });
} else {
  // Fallback ke Localhost (Jika tidak ada DATABASE_URL)
  console.log("🏠 Menggunakan koneksi Localhost...");

  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "lumastore_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

// Menggunakan Promise Wrapper
const db = pool.promise();

// Cek koneksi saat awal jalan
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Gagal Terhubung ke Database:", err.message);
  } else {
    console.log("✅ Berhasil Terhubung ke Database!");
    connection.release();
  }
});

module.exports = db;
