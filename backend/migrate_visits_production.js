// backend/migrate_visits_production.js
// Script migrasi untuk PRODUCTION (TiDB Cloud)
// Menambah kolom os, device_type, browser + backfill data lama
//
// Cara pakai: node migrate_visits_production.js

const mysql = require("mysql2");
const UAParser = require("ua-parser-js");
require("dotenv").config();

async function migrate() {
  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL tidak ditemukan di .env!");
    console.error("   Pastikan sudah ada variabel DATABASE_URL di file .env");
    process.exit(1);
  }

  console.log("🌐 Menghubungkan ke TiDB Cloud (Production)...\n");

  // Buat koneksi ke TiDB menggunakan DATABASE_URL
  const connection = mysql.createConnection({
    uri: DATABASE_URL,
    charset: "utf8mb4",
    ssl: {
      rejectUnauthorized: true,
      minVersion: "TLSv1.2",
    },
  });

  const db = connection.promise();

  try {
    // Test koneksi dulu
    await db.execute("SELECT 1");
    console.log("✅ Berhasil terhubung ke TiDB Cloud!\n");

    // ===== STEP 1: Tambah kolom baru (jika belum ada) =====
    console.log("🔄 STEP 1: Menambahkan kolom baru...\n");

    const columnsToAdd = [
      { name: "os", type: "VARCHAR(50) DEFAULT NULL" },
      { name: "device_type", type: "VARCHAR(20) DEFAULT NULL" },
      { name: "browser", type: "VARCHAR(50) DEFAULT NULL" },
    ];

    for (const col of columnsToAdd) {
      try {
        await db.execute(`ALTER TABLE visits ADD COLUMN ${col.name} ${col.type}`);
        console.log(`   ✅ Kolom '${col.name}' berhasil ditambahkan.`);
      } catch (err) {
        if (err.code === "ER_DUP_FIELDNAME" || err.message.includes("Duplicate column")) {
          console.log(`   ⏭️  Kolom '${col.name}' sudah ada, skip.`);
        } else {
          throw err;
        }
      }
    }

    // ===== STEP 2: Backfill data lama dari user_agent =====
    console.log("\n🔄 STEP 2: Backfill data lama dari user_agent...\n");

    const [rows] = await db.execute(
      "SELECT id, user_agent FROM visits WHERE user_agent IS NOT NULL AND (os IS NULL OR device_type IS NULL OR browser IS NULL)"
    );

    console.log(`   📊 Ditemukan ${rows.length} baris yang perlu di-backfill.\n`);

    let updated = 0;
    for (const row of rows) {
      const parser = new UAParser(row.user_agent);
      const result = parser.getResult();

      const os = result.os.name || "Unknown";
      const browser = result.browser.name || "Unknown";
      const deviceType =
        result.device.type === "mobile" || result.device.type === "tablet"
          ? "Mobile"
          : "Desktop";

      await db.execute(
        "UPDATE visits SET os = ?, device_type = ?, browser = ? WHERE id = ?",
        [os, deviceType, browser, row.id]
      );
      updated++;
    }

    console.log(`   ✅ Berhasil backfill ${updated} baris data!\n`);

    // ===== STEP 3: Verifikasi =====
    console.log("🔄 STEP 3: Verifikasi...\n");

    const [count] = await db.execute("SELECT COUNT(*) as total FROM visits");
    console.log(`   📊 Total data di visits: ${count[0].total}`);

    const [sample] = await db.execute(
      "SELECT id, ip_address, os, device_type, browser FROM visits ORDER BY id DESC LIMIT 3"
    );
    console.log("\n   📋 Sample 3 data terbaru:");
    sample.forEach((row) => {
      console.log(`      ID:${row.id} | IP:${row.ip_address} | OS:${row.os} | Device:${row.device_type} | Browser:${row.browser}`);
    });

    console.log("\n🎉 Migrasi production selesai! Data aman, tidak ada yang dihapus.");
  } catch (error) {
    console.error("\n❌ Error saat migrasi:", error.message);
  } finally {
    connection.end();
  }
}

migrate();
