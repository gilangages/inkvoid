const db = require("../config/database");

// Helper untuk parsing JSON dengan aman (menghindari crash jika JSON rusak)
const safeParseJSON = (jsonString, fallback = []) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return fallback;
  }
};

// 1. Get All Products (Dengan Auto-Label untuk data lama)
const getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products WHERE is_deleted = 0 ORDER BY id DESC");

    const products = rows.map((product) => {
      let images = [];

      // Parsing kolom images (bisa berupa string JSON, null, atau sudah object)
      if (typeof product.images === "string") {
        images = safeParseJSON(product.images, []);
      } else if (Array.isArray(product.images)) {
        images = product.images;
      } else if (product.image_url) {
        // Fallback untuk data legacy yang cuma punya 1 image_url
        images = [product.image_url];
      }

      // [FEATURE] Normalisasi Data Gambar
      // Memastikan semua formatnya seragam: { url: "...", label: "..." }
      const normalizedImages = images.map((img) => {
        // Jika data masih berupa string URL polos
        if (typeof img === "string") {
          const filename = img.split("/").pop(); // Ambil nama file dari URL
          return {
            url: img,
            label: filename, // Label otomatis dari nama file
          };
        }

        // Jika sudah object tapi label kosong/undefined
        return {
          ...img,
          label: img.label || img.url.split("/").pop(), // Label otomatis jika kosong
        };
      });

      return {
        ...product,
        images: normalizedImages,
      };
    });

    res.status(200).json({
      success: true,
      message: "List Data Produk",
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Create Product (Dengan Default Label = Nama File)
const createProduct = async (req, res) => {
  try {
    const { name, price, description, file_url, image_labels } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "Minimal upload 1 gambar produk!" });
    }

    const protocol = req.protocol;
    const host = req.get("host");

    // Parse labels dari frontend
    const labels = safeParseJSON(image_labels);

    // Map files ke struktur object baru
    const imageObjects = req.files.map((file, index) => ({
      url: `${protocol}://${host}/uploads/${file.filename}`,
      // [LOGIC] Jika label dari frontend kosong, pakai nama file asli (tanpa ekstensi)
      label: labels[index] || file.originalname.split(".")[0],
      order: index,
    }));

    // Gambar utama adalah index ke-0 (urutan pertama)
    const mainImage = imageObjects[0].url;

    // Simpan sebagai JSON string
    const imagesJson = JSON.stringify(imageObjects);

    const query =
      "INSERT INTO products (name, price, description, image_url, images, file_url) VALUES (?, ?, ?, ?, ?, ?)";
    const [result] = await db.query(query, [name, price, description, mainImage, imagesJson, file_url || null]);

    res.status(201).json({
      success: true,
      message: "Produk berhasil ditambahkan",
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error("Error createProduct:", error);
    res.status(500).json({ success: false, message: "Gagal menambahkan produk" });
  }
};

// 3. Delete Product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const [check] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    if (check.length === 0) return res.status(404).json({ message: "Produk tidak ditemukan" });

    // [FIX] Lakukan Soft Delete
    await db.query("UPDATE products SET is_deleted = 1 WHERE id = ?", [id]);

    res.status(200).json({ success: true, message: "Produk berhasil dihapus (soft delete)" });
  } catch (error) {
    console.error("Error delete product:", error);

    // [FIX] Tangani error Foreign Key Constraint (Produk sudah pernah dibeli)
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        success: false,
        message:
          "Produk tidak dapat dihapus karena sudah memiliki riwayat transaksi. Sebaiknya nonaktifkan produk saja.",
      });
    }
    res.status(500).json({ success: false, message: "Gagal menghapus produk", error: error.message });
  }
};

// 4. Update Product (Support Reorder & Metadata)
const updateProduct = async (req, res) => {
  const { id } = req.params;
  // Kita menerima 'images_metadata' yang berisi urutan baru
  const { name, price, description, images_metadata } = req.body;

  try {
    // 1. Cek produk lama
    const [existing] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });
    }

    let finalImages = [];

    // 2. Logic Baru: Menggunakan Metadata Urutan dari Frontend
    if (images_metadata) {
      const metadata = safeParseJSON(images_metadata);
      const protocol = req.protocol;
      const host = req.get("host");

      // Pointer untuk mengambil file baru dari req.files secara berurutan
      let newFileIndex = 0;

      // Map metadata untuk menyusun array finalImages sesuai urutan yang diinginkan user
      finalImages = metadata
        .map((item) => {
          if (item.type === "existing") {
            // Jika gambar lama: pertahankan URL dan update labelnya
            return {
              url: item.url,
              label: item.label,
              order: item.order,
            };
          } else if (item.type === "new") {
            // Jika gambar baru: ambil file fisik dari req.files
            if (req.files && req.files[newFileIndex]) {
              const file = req.files[newFileIndex];
              newFileIndex++; // Geser pointer ke file berikutnya

              return {
                url: `${protocol}://${host}/uploads/${file.filename}`,
                // Pakai label dari input user, atau fallback ke nama asli file
                label: item.label || file.originalname.split(".")[0],
                order: item.order,
              };
            }
          }
          return null;
        })
        .filter(Boolean); // Hapus item null (jika ada error index)
    } else {
      // 3. Fallback Logic (Jika frontend belum kirim metadata) - Backward Compatibility
      const oldData = existing[0];
      let currentImages = typeof oldData.images === "string" ? JSON.parse(oldData.images) : oldData.images || [];

      // Jika format lama string URL, ubah ke object
      currentImages = currentImages.map((img) => (typeof img === "string" ? { url: img, label: "" } : img));

      // Append gambar baru (jika ada) di akhir
      if (req.files && req.files.length > 0) {
        const protocol = req.protocol;
        const host = req.get("host");
        const newImages = req.files.map((file) => ({
          url: `${protocol}://${host}/uploads/${file.filename}`,
          label: file.originalname.split(".")[0],
          order: 99,
        }));
        currentImages = [...currentImages, ...newImages];
      }
      finalImages = currentImages;
    }

    // 4. Update Database
    // Gambar pertama di array hasil reorder akan jadi Main Image (Thumbnail)
    const finalMainImage = finalImages.length > 0 ? finalImages[0].url : null;
    const finalImagesJson = JSON.stringify(finalImages);

    const query = `
      UPDATE products
      SET name = ?, price = ?, description = ?, image_url = ?, images = ?
      WHERE id = ?
    `;

    await db.query(query, [name, price, description, finalMainImage, finalImagesJson, id]);

    res.status(200).json({
      success: true,
      message: "Produk berhasil diupdate!",
      data: {
        images: finalImages,
      },
    });
  } catch (error) {
    console.error("Error update product:", error);
    res.status(500).json({ success: false, message: "Gagal update produk", error: error.message });
  }
};

// 5. Bulk Delete
const bulkDeleteProducts = async (req, res) => {
  const { ids } = req.body;

  try {
    if (!ids || ids.length === 0) {
      return res.status(400).json({ success: false, message: "Tidak ada ID yang dipilih" });
    }

    const query = "DELETE FROM products WHERE id IN (?)";
    await db.query(query, [ids]);

    res.status(200).json({ success: true, message: `${ids.length} produk berhasil dihapus` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllProducts, createProduct, deleteProduct, updateProduct, bulkDeleteProducts };
