// backend/controllers/visitController.js
const db = require("../config/database");

// 1. Catat Kunjungan Baru
exports.recordVisit = async (req, res) => {
  try {
    // Ambil IP Address (mengatasi proxy/vercel)
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];

    // Masukkan ke database
    const query = "INSERT INTO visits (ip_address, user_agent) VALUES (?, ?)";
    await db.execute(query, [ip, userAgent]);

    res.status(200).json({ success: true, message: "Visit recorded" });
  } catch (error) {
    console.error("Error recording visit:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 2. Ambil Statistik untuk Admin
exports.getStats = async (req, res) => {
  try {
    // Hitung Total Views (Semua baris)
    const [totalRows] = await db.execute("SELECT COUNT(*) as total FROM visits");

    // Hitung Unique Visitors (Berdasarkan IP yang unik)
    const [uniqueRows] = await db.execute("SELECT COUNT(DISTINCT ip_address) as unique_visitors FROM visits");

    res.status(200).json({
      success: true,
      data: {
        total_views: totalRows[0].total,
        unique_visitors: uniqueRows[0].unique_visitors,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
