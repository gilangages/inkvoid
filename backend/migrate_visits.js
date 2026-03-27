// backend/migrate_visits.js
// Migrasi: Tambah kolom visitor_id + visit_count ke tabel visits
// + backfill os/device_type/browser dari user_agent
//
// Cara pakai: node migrate_visits.js

const mysql = require("mysql2");
const UAParser = require("ua-parser-js");
require("dotenv").config();

async function migrate() {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "lumastore_db",
    charset: "utf8mb4",
  });

  const db = connection.promise();

  try {
    console.log("🔄 Memulai migrasi tabel visits...\n");

    // ===== STEP 1: Tambah kolom (jika belum ada) =====
    const columnsToAdd = [
      { name: "os", type: "VARCHAR(50) DEFAULT NULL" },
      { name: "device_type", type: "VARCHAR(20) DEFAULT NULL" },
      { name: "browser", type: "VARCHAR(50) DEFAULT NULL" },
      { name: "visitor_id", type: "VARCHAR(36) DEFAULT NULL" },
      { name: "visit_count", type: "INT DEFAULT 1" },
    ];

    for (const col of columnsToAdd) {
      try {
        await db.execute(`ALTER TABLE visits ADD COLUMN ${col.name} ${col.type}`);
        console.log(`✅ Kolom '${col.name}' berhasil ditambahkan.`);
      } catch (err) {
        if (err.code === "ER_DUP_FIELDNAME") {
          console.log(`⏭️  Kolom '${col.name}' sudah ada, skip.`);
        } else {
          throw err;
        }
      }
    }

    // ===== STEP 2: Tambah UNIQUE INDEX pada visitor_id (jika belum ada) =====
    try {
      await db.execute("ALTER TABLE visits ADD UNIQUE INDEX idx_visitor_id (visitor_id)");
      console.log("✅ UNIQUE INDEX 'idx_visitor_id' berhasil ditambahkan.");
    } catch (err) {
      if (err.code === "ER_DUP_KEYNAME" || err.message.includes("Duplicate key name")) {
        console.log("⏭️  UNIQUE INDEX 'idx_visitor_id' sudah ada, skip.");
      } else {
        throw err;
      }
    }

    // ===== STEP 3: Backfill os/device_type/browser dari user_agent =====
    console.log("\n🔄 Backfill data lama dari user_agent...\n");

    const [rows] = await db.execute(
      "SELECT id, user_agent FROM visits WHERE user_agent IS NOT NULL AND (os IS NULL OR device_type IS NULL OR browser IS NULL)"
    );

    console.log(`📊 Ditemukan ${rows.length} baris yang perlu di-backfill.\n`);

    let updated = 0;
    for (const row of rows) {
      const parser = new UAParser(row.user_agent);
      const result = parser.getResult();

      const os = result.os.name || "Unknown";
      const browser = result.browser.name || "Unknown";
      const deviceType =
        result.device.type === "mobile" || result.device.type === "tablet" ? "Mobile" : "Desktop";

      await db.execute("UPDATE visits SET os = ?, device_type = ?, browser = ? WHERE id = ?", [
        os,
        deviceType,
        browser,
        row.id,
      ]);
      updated++;
    }

    console.log(`✅ Berhasil backfill ${updated} baris data!\n`);

    // ===== STEP 4: Set visit_count = 1 untuk data lama yang NULL =====
    await db.execute("UPDATE visits SET visit_count = 1 WHERE visit_count IS NULL");
    console.log("✅ visit_count di-set ke 1 untuk data lama.\n");

    // ===== STEP 5: Verifikasi =====
    const [sample] = await db.execute(
      "SELECT id, ip_address, visitor_id, os, device_type, browser, visit_count FROM visits LIMIT 5"
    );
    console.log("📋 Sample data setelah migrasi:");
    console.table(sample);

    console.log("\n🎉 Migrasi selesai! Tidak ada data yang dihapus.");
  } catch (error) {
    console.error("❌ Error saat migrasi:", error.message);
  } finally {
    connection.end();
  }
}

migrate();
