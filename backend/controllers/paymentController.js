const midtransClient = require("midtrans-client");
const db = require("../config/database");
const nodemailer = require("nodemailer");
require("dotenv").config();

// 1. Konfigurasi Midtrans Snap
let snap = new midtransClient.Snap({
  isProduction: false, // Masih mode Sandbox
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// 2. Fungsi Membuat Transaksi
const createTransaction = async (req, res) => {
  const { product_id, customer_name, customer_email } = req.body;

  try {
    // --- SECURITY STEP 1: Cek Harga Asli di Database ---
    // Jangan pernah ambil 'price' mentah dari frontend, user licik bisa ubah jadi Rp 1.
    const [products] = await db.query("SELECT * FROM products WHERE id = ?", [product_id]);

    if (products.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan, Bos!" });
    }

    const product = products[0];
    const grossAmount = parseInt(product.price); // Pastikan jadi angka bulat

    // --- SETUP ORDER ID UNIK ---
    // Format: ORDER-TIMESTAMP-IDPRODUK (Contoh: LUMA-17482399-1)
    const orderId = `LUMA-${Date.now()}-${product_id}`;

    // --- MIDTRANS PARAMETER ---
    let parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: customer_name,
        email: customer_email,
      },
      item_details: [
        {
          id: product.id,
          price: grossAmount,
          quantity: 1,
          name: product.name.substring(0, 50), // Midtrans ada limit panjang karakter nama
        },
      ],
      // --- BEST PRACTICE: HEMAT BIAYA ADMIN ---
      // Paksa user cuma bisa bayar pakai QRIS / GoPay / ShopeePay
      // enabled_payments: ["gopay", "shopeepay", "other_qris"],
      callbacks: {
        finish: "http://localhost:5173", // Nanti ini URL Frontend kamu setelah bayar
      },
    };

    // 3. Minta Token ke Midtrans
    const transaction = await snap.createTransaction(parameter);
    const snapToken = transaction.token;

    // 4. Simpan Transaksi ke Database Kita (Status: Pending)
    // Kita butuh simpan snap_token biar nanti frontend bisa buka popup ulang kalau user close
    const sql = `INSERT INTO transactions
                    (order_id, customer_name, customer_email, product_id, amount, status, snap_token)
                    VALUES (?, ?, ?, ?, ?, 'pending', ?)`;

    await db.query(sql, [orderId, customer_name, customer_email, product_id, grossAmount, snapToken]);

    // 5. Kirim Token ke Frontend
    res.status(200).json({
      success: true,
      message: "Token Pembayaran Berhasil Dibuat",
      token: snapToken,
      order_id: orderId,
    });
  } catch (error) {
    console.error("Error Midtrans:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memproses pembayaran",
      error: error.message,
    });
  }
};
// ... (Bagian createTransaction biarkan sama)

const handleNotification = async (req, res) => {
  try {
    const statusResponse = req.body;
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`Laporan masuk untuk Order: ${orderId} | Status: ${transactionStatus}`);

    let orderStatus = "pending";

    if (transactionStatus == "capture") {
      if (fraudStatus == "challenge") {
        orderStatus = "challenge";
      } else if (fraudStatus == "accept") {
        orderStatus = "success";
      }
    } else if (transactionStatus == "settlement") {
      orderStatus = "success";
    } else if (transactionStatus == "cancel" || transactionStatus == "deny" || transactionStatus == "expire") {
      orderStatus = "failed";
    }

    // Update Status
    await db.query("UPDATE transactions SET status = ? WHERE order_id = ?", [orderStatus, orderId]);

    if (orderStatus === "success") {
      // AMBIL DATA PRODUK & FILE URL
      // Pastikan di tabel 'products' kolomnya bernama 'file_url' atau 'link_file' (sesuaikan dengan databasemu)
      const [rows] = await db.query(
        `SELECT t.customer_email, t.customer_name, p.name as product_name, p.image_url, p.price, p.description, p.file_url
         FROM transactions t
         JOIN products p ON t.product_id = p.id
         WHERE t.order_id = ?`,
        [orderId],
      );

      if (rows.length > 0) {
        const data = rows[0];
        // Debugging: Cek di terminal apakah file_url ada isinya
        console.log("Mengirim email ke:", data.customer_email, "Link:", data.file_url);

        await sendEmail(data);
      }
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Error Webhook:", error);
    res.status(500).send("Error");
  }
};

// --- FUNGSI KIRIM EMAIL CANTIK ---
const sendEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Format Rupiah
  const price = parseInt(data.price).toLocaleString("id-ID");

  const mailOptions = {
    from: `"Luma Store Official" <${process.env.EMAIL_USER}>`,
    to: data.customer_email,
    subject: `✨ Aset Kamu Siap! - ${data.product_name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Nunito', sans-serif; background-color: #F0F7F4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(19, 78, 74, 0.1); }
          .header { background-color: #047857; padding: 30px; text-align: center; color: white; }
          .content { padding: 40px 30px; text-align: center; color: #134e4a; }
          .btn { background-color: #059669; color: #ffffff !important; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 20px; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.3); }
          .footer { background-color: #ecfdf5; padding: 20px; text-align: center; font-size: 12px; color: #6ee7b7; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0;">Luma Store</h1>
          </div>
          <div class="content">
            <h2 style="color: #065f46;">Hai, ${data.customer_name}! 👋</h2>
            <p>Terima kasih banyak sudah mendukung kreator lokal.</p>
            <p>Pesananmu <strong>${data.product_name}</strong> seharga <strong>Rp ${price}</strong> sudah berhasil dikonfirmasi.</p>

            <div style="margin: 30px 0;">
              <p>Silakan download asetmu melalui tombol di bawah ini:</p>
              <a href="${data.file_url}" class="btn">☁️ DOWNLOAD ASET</a>
            </div>

            <p style="font-size: 14px; color: #9ca3af;">Link ini berlaku selamanya. Simpan email ini baik-baik ya!</p>
          </div>
          <div class="footer">
            &copy; 2024 Luma Store. Dibuat dengan cinta.
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email berhasil dikirim ke ${data.customer_email}`);
  } catch (err) {
    console.error("❌ Gagal kirim email:", err);
  }
};

const getAllTransactions = async (req, res) => {
  try {
    // Ambil data transaksi dan gabungkan dengan nama produk
    const [rows] = await db.query(`
      SELECT t.*, p.name as product_name
      FROM transactions t
      LEFT JOIN products p ON t.product_id = p.id
      ORDER BY t.createdAt DESC
    `);

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Gagal mengambil data riwayat." });
  }
};

module.exports = { createTransaction, handleNotification, getAllTransactions };
