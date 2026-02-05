const db = require("../config/database");
const nodemailer = require("nodemailer");
require("dotenv").config();

// 1. Fungsi Membuat Transaksi (Mode WhatsApp)
const createTransaction = async (req, res) => {
  const { product_id, customer_name, customer_email } = req.body;

  try {
    // --- SECURITY STEP 1: Cek Harga Asli di Database ---
    const [products] = await db.query("SELECT * FROM products WHERE id = ?", [product_id]);

    if (products.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan, Bos!" });
    }

    const product = products[0];
    const grossAmount = parseInt(product.price); // Pastikan jadi angka bulat

    // --- SETUP ORDER ID UNIK ---
    // Format: LUMA-WA-TIMESTAMP-ID (Penting untuk Unit Test yang mengecek prefix LUMA-WA-)
    const orderId = `LUMA-WA-${Date.now()}-${product_id}`;

    // --- SIMPAN KE DATABASE ---
    // [FIX] Kita gunakan tanda tanya (?) untuk snap_token agar terdeteksi oleh Unit Test
    const sql = `INSERT INTO transactions
                    (order_id, customer_name, customer_email, product_id, amount, status, snap_token)
                    VALUES (?, ?, ?, ?, ?, 'pending', ?)`;

    // [FIX] Masukkan 'whatsapp-manual' ke dalam array parameter
    await db.query(sql, [orderId, customer_name, customer_email, product_id, grossAmount, "whatsapp-manual"]);

    // --- KIRIM RESPONSE KE FRONTEND ---
    res.status(200).json({
      success: true,
      message: "Order berhasil dibuat. Silakan lanjut ke WhatsApp.",
      token: null, // Tidak ada token Midtrans
      order_id: orderId,
      product_name: product.name,
      amount: grossAmount,
    });
  } catch (error) {
    console.error("Error Transaction:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memproses order",
      error: error.message,
    });
  }
};

// 2. Webhook Handler (Dummy untuk Mode Manual)
const handleNotification = async (req, res) => {
  // Endpoint ini dibiarkan aktif hanya agar tidak error 404 jika ada yang iseng nembak.
  return res.status(200).send("OK - Manual Mode Active");
};

// 3. Fungsi Kirim Email (Opsional/Manual Trigger)
const sendEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

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

// 4. Ambil Semua Transaksi (Untuk Admin Dashboard)
const getAllTransactions = async (req, res) => {
  try {
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

// 5. Update Status Transaksi (Manual Trigger oleh Admin)
const updateTransactionStatus = async (req, res) => {
  const { order_id } = req.params;
  const { status } = req.body; // misal: 'success' atau 'failed'

  try {
    // Update status di database
    const [result] = await db.query("UPDATE transactions SET status = ? WHERE order_id = ?", [status, order_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order ID tidak ditemukan." });
    }

    // [OPSIONAL] Jika status diubah jadi success, bisa panggil fungsi kirim email otomatis di sini
    if (status === "success") {
      // Ambil data detail transaksi untuk keperluan email
      const [rows] = await db.query(
        `
        SELECT t.*, p.name as product_name, p.price
        FROM transactions t
        JOIN products p ON t.product_id = p.id
        WHERE t.order_id = ?`,
        [order_id],
      );

      if (rows.length > 0) {
        // Panggil fungsi sendEmail yang sudah kamu buat di atas
        // Pastikan sendEmail dimodifikasi sedikit agar menerima data object yang sesuai,
        // atau sesuaikan struktur data di sini.
        // await sendEmail(rows[0]);
      }
    }

    res.status(200).json({
      success: true,
      message: `Status berhasil diubah menjadi ${status}`,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Gagal mengupdate status." });
  }
};

module.exports = { createTransaction, handleNotification, getAllTransactions, updateTransactionStatus };
