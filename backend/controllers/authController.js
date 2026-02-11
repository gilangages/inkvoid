const jwt = require("jsonwebtoken");

// LOGIC HARDCODE ADMIN
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASS = process.env.ADMIN_PASS;

exports.loginAdmin = (req, res) => {
  const { email, password } = req.body;

  // 1. Cek Email & Password (Sederhana)
  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    // 2. Jika benar, buatkan Token (Tiket Masuk)
    const token = jwt.sign(
      { role: "admin", email: email },
      process.env.JWT_SECRET || "rahasia_negara_luma",
      { expiresIn: "12h" }, // Token berlaku 12 jam
    );

    return res.status(200).json({
      success: true,
      message: "Login berhasil! Selamat datang Admin.",
      token: token, // Frontend harus simpan ini di localStorage
    });
  }

  // 3. Jika salah
  return res.status(401).json({
    success: false,
    message: "Email atau Password salah!",
  });
};

exports.logoutAdmin = (req, res) => {
  // Pada JWT stateless, logout sebenarnya cukup dilakukan di Frontend (hapus token).
  // Endpoint ini hanya respon formalitas.
  res.status(200).json({ success: true, message: "Logout berhasil." });
};
