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

const handleNotification = async (req, res) => {
  try {
    // 1. Ambil data notifikasi (Langsung dari Body tanpa validasi ke Midtrans dulu)
    const statusResponse = req.body;

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`Laporan masuk untuk Order: ${orderId} | Status: ${transactionStatus}`);

    // 2. Tentukan Logic Status Pembayaran
    let orderStatus = "pending";

    if (transactionStatus == "capture") {
      if (fraudStatus == "challenge") {
        orderStatus = "challenge";
      } else if (fraudStatus == "accept") {
        orderStatus = "success";
      }
    } else if (transactionStatus == "settlement") {
      orderStatus = "success"; // INI YANG KITA CARI (Uang masuk)
    } else if (transactionStatus == "cancel" || transactionStatus == "deny" || transactionStatus == "expire") {
      orderStatus = "failed";
    }

    // 3. Update Status di Database
    await db.query("UPDATE transactions SET status = ? WHERE order_id = ?", [orderStatus, orderId]);

    // 4. JIKA SUKSES -> KIRIM EMAIL OTOMATIS
    if (orderStatus === "success") {
      // Ambil data customer & produk dari database untuk kirim email
      const [rows] = await db.query(
        `
                SELECT t.customer_email, t.customer_name, p.name as product_name, p.file_url
                FROM transactions t
                JOIN products p ON t.product_id = p.id
                WHERE t.order_id = ?`,
        [orderId],
      );

      if (rows.length > 0) {
        const data = rows[0];
        await sendEmail(data.customer_email, data.customer_name, data.product_name, data.file_url);
      }
    }

    res.status(200).send("OK"); // Wajib balas OK ke Midtrans biar dia gak ngirim ulang
  } catch (error) {
    console.error("Error Webhook:", error);
    res.status(500).send("Error");
  }
};

// --- FUNGSI PEMBANTU: KIRIM EMAIL ---
const sendEmail = async (email, name, productName, fileLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Luma Store" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `[Download] Aset Digital: ${productName}`,
    html: `
            <h3>Hai, ${name}!</h3>
            <p>Terima kasih sudah membeli <b>${productName}</b>.</p>
            <p>Silakan download asetmu melalui link di bawah ini:</p>
            <a href="${fileLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">DOWNLOAD SEKARANG</a>
            <p><small>Link ini aman. Jika ada kendala, balas email ini.</small></p>
        `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email berhasil dikirim ke ${email}`);
  } catch (err) {
    console.error("❌ Gagal kirim email:", err);
  }
};

module.exports = { createTransaction, handleNotification };
