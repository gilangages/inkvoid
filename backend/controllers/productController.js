// backend/controllers/productController.js
const db = require("../config/database");

const getProducts = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products ORDER BY id DESC");
    // Parsing JSON images jika ada
    const products = rows.map((product) => ({
      ...product,
      images: typeof product.images === "string" ? JSON.parse(product.images) : product.images || [product.image_url],
    }));

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProduct = async (req, res) => {
  const { name, price, description, images } = req.body; // images adalah array URL string

  // Validasi sederhana
  if (!name || !price) {
    return res.status(400).json({ success: false, message: "Nama dan Harga wajib diisi!" });
  }

  // Ambil foto pertama sebagai thumbnail utama (image_url) untuk kompatibilitas
  const mainImage = images && images.length > 0 ? images[0] : null;
  // Simpan seluruh array foto sebagai JSON string
  const imagesJson = JSON.stringify(images || []);

  try {
    const query = "INSERT INTO products (name, price, description, image_url, images) VALUES (?, ?, ?, ?, ?)";
    const [result] = await db.query(query, [name, price, description, mainImage, imagesJson]);

    res.status(201).json({
      success: true,
      message: "Produk berhasil ditambahkan!",
      data: { id: result.insertId, name, price, description, image_url: mainImage, images },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal menyimpan produk", error: error.message });
  }
};

module.exports = { getProducts, createProduct };
