// backend/controllers/visitController.js
const db = require("../config/database");
const UAParser = require("ua-parser-js");

// Helper: Parse User-Agent string
function parseUserAgent(uaString) {
  const parser = new UAParser(uaString || "");
  const result = parser.getResult();

  return {
    os: result.os.name || "Unknown",
    browser: result.browser.name || "Unknown",
    device_type:
      result.device.type === "mobile" || result.device.type === "tablet"
        ? "Mobile"
        : "Desktop",
  };
}

// 1. Catat Kunjungan Baru
exports.recordVisit = async (req, res) => {
  try {
    // Ambil IP Address (mengatasi proxy/vercel)
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];

    // Parse device info dari User-Agent
    const { os, browser, device_type } = parseUserAgent(userAgent);

    // Masukkan ke database dengan kolom baru
    const query =
      "INSERT INTO visits (ip_address, user_agent, os, device_type, browser) VALUES (?, ?, ?, ?, ?)";
    await db.execute(query, [ip, userAgent, os, device_type, browser]);

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

// 3. Ambil Daftar Pengunjung (dengan Pagination)
exports.getVisitors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Hitung total data untuk pagination info
    const [countResult] = await db.execute("SELECT COUNT(*) as total FROM visits");
    const totalData = countResult[0].total;
    const totalPages = Math.ceil(totalData / limit);

    // Ambil data dengan pagination (terbaru duluan)
    // Note: LIMIT/OFFSET tidak support placeholder (?) di TiDB/beberapa MySQL,
    // jadi kita interpolasi langsung. Aman karena sudah di-parseInt di atas.
    const [rows] = await db.execute(
      `SELECT id, ip_address, user_agent, os, device_type, browser, visit_time FROM visits ORDER BY visit_time DESC LIMIT ${limit} OFFSET ${offset}`
    );

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_data: totalData,
        per_page: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching visitors:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 4. Hapus Visitor Berdasarkan ID
exports.deleteVisitor = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah data ada
    const [existing] = await db.execute("SELECT id FROM visits WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Data visitor tidak ditemukan." });
    }

    await db.execute("DELETE FROM visits WHERE id = ?", [id]);

    res.status(200).json({ success: true, message: "Visitor berhasil dihapus." });
  } catch (error) {
    console.error("Error deleting visitor:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 5. Hapus Semua Data Visitor
exports.deleteAllVisitors = async (req, res) => {
  try {
    const [result] = await db.execute("DELETE FROM visits");

    res.status(200).json({
      success: true,
      message: `Semua data visitor berhasil dihapus (${result.affectedRows} baris).`,
    });
  } catch (error) {
    console.error("Error deleting all visitors:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Export helper untuk testing
exports._parseUserAgent = parseUserAgent;
