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

// 1. Catat Kunjungan Baru (UPSERT: insert jika baru, update jika sudah ada)
exports.recordVisit = async (req, res) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const visitorId = (req.body && req.body.visitor_id) || null;

    // Parse device info
    const { os, browser, device_type } = parseUserAgent(userAgent);

    if (visitorId) {
      // UPSERT: Jika visitor_id sudah ada → UPDATE (waktu, IP, device info, +1 visit_count)
      // Jika belum ada → INSERT baru
      const query = `
        INSERT INTO visits (visitor_id, ip_address, user_agent, os, device_type, browser, visit_time, visit_count)
        VALUES (?, ?, ?, ?, ?, ?, NOW(), 1)
        ON DUPLICATE KEY UPDATE
          ip_address = VALUES(ip_address),
          user_agent = VALUES(user_agent),
          os = VALUES(os),
          device_type = VALUES(device_type),
          browser = VALUES(browser),
          visit_time = NOW(),
          visit_count = visit_count + 1
      `;
      await db.execute(query, [visitorId, ip, userAgent, os, device_type, browser]);
    } else {
      // Fallback: Jika visitor_id tidak dikirim (browser lama/bot), insert biasa
      const query =
        "INSERT INTO visits (ip_address, user_agent, os, device_type, browser) VALUES (?, ?, ?, ?, ?)";
      await db.execute(query, [ip, userAgent, os, device_type, browser]);
    }

    res.status(200).json({ success: true, message: "Visit recorded" });
  } catch (error) {
    console.error("Error recording visit:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 2. Ambil Statistik untuk Admin
exports.getStats = async (req, res) => {
  try {
    // Total Views = jumlah semua kunjungan (termasuk revisit)
    const [totalRows] = await db.execute(
      "SELECT COALESCE(SUM(visit_count), 0) as total FROM visits"
    );

    // Unique Visitors = jumlah baris (karena tiap visitor_id punya 1 baris)
    const [uniqueRows] = await db.execute("SELECT COUNT(*) as unique_visitors FROM visits");

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

    // Hitung total data
    const [countResult] = await db.execute("SELECT COUNT(*) as total FROM visits");
    const totalData = countResult[0].total;
    const totalPages = Math.ceil(totalData / limit);

    // Ambil data dengan pagination (terbaru duluan)
    // Note: LIMIT/OFFSET tidak support placeholder (?) di TiDB,
    // aman karena sudah di-parseInt di atas.
    const [rows] = await db.execute(
      `SELECT id, visitor_id, ip_address, user_agent, os, device_type, browser, visit_time, visit_count FROM visits ORDER BY visit_time DESC LIMIT ${limit} OFFSET ${offset}`
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
