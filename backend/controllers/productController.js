const db = require("../config/database");
const { cloudinary } = require("../middleware/uploadMiddleware");
const fs = require("fs");
const path = require("path");

// Helper Parse JSON
const safeParseJSON = (jsonString, fallback = []) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return fallback;
  }
};

// === HELPER: Dynamic Base URL Generator (Lebih Robust) ===
const getBaseUrl = (req) => {
  // 1. Prioritaskan Environment Variable (Penting untuk Production/Deployment)
  if (process.env.API_BASE_URL) {
    return process.env.API_BASE_URL;
  }
  // 2. Fallback ke Request Host (Untuk Localhost)
  const protocol = req.protocol;
  const host = req.get("host");
  return `${protocol}://${host}`;
};

// === HELPER UTAMA: Ekstrak Public ID Cloudinary dengan Regex ===
// Ini jauh lebih aman daripada split string manual
const getCloudinaryPublicId = (url) => {
  try {
    // Regex untuk menangkap teks setelah '/upload/' (dan versi v123..) sampai sebelum extension
    // Contoh: .../upload/v12345/lumastore_products/sepatu.jpg -> lumastore_products/sepatu
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.error("Gagal ekstrak public ID:", error);
    return null;
  }
};

// === HELPER: Hapus File (Updated untuk Robustness) ===
const deleteFile = async (fileUrl) => {
  if (!fileUrl) return;

  try {
    // A. Jika file Cloudinary
    if (fileUrl.includes("cloudinary.com")) {
      const publicId = getCloudinaryPublicId(fileUrl);
      if (publicId) {
        // await di sini penting agar kita yakin Cloudinary menerima request hapus
        await cloudinary.uploader.destroy(publicId);
        console.log(`[Cloudinary] Deleted: ${publicId}`);
      } else {
        console.warn(`[Cloudinary] Skip delete, public ID not found for: ${fileUrl}`);
      }
    }
    // B. Jika file Local
    else {
      let filename;
      if (fileUrl.startsWith("http")) {
        filename = fileUrl.split("/").pop();
      } else {
        filename = path.basename(fileUrl);
      }

      // Sanitasi path untuk mencegah traversal directory (Security Best Practice)
      const safeFilename = path.basename(filename);
      const filePath = path.join(__dirname, "../public/uploads", safeFilename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`[Local] Deleted: ${filePath}`);
      }
    }
  } catch (error) {
    // Kita gunakan console.error tapi TIDAK melempar error ulang (throw)
    // Agar jika 1 gambar gagal dihapus, proses hapus data produk di DB tetap jalan.
    console.error(`Gagal menghapus file fisik (${fileUrl}):`, error.message);
  }
};

// 1. Get All Products (BEST PRACTICE: Merakit URL Disini)
const getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products WHERE is_deleted = 0 ORDER BY id DESC");
    const baseUrl = getBaseUrl(req);

    const products = rows.map((product) => {
      let images = [];
      // Parsing data images
      if (typeof product.images === "string") {
        images = safeParseJSON(product.images, []);
      } else if (Array.isArray(product.images)) {
        images = product.images;
      } else if (product.image_url) {
        images = [product.image_url];
      }

      // === LOGIC UTAMA: NORMALISASI URL ===
      const normalizedImages = images.map((img) => {
        let rawUrl = typeof img === "string" ? img : img.url;
        let finalUrl = rawUrl;

        // Pastikan rawUrl valid string
        if (typeof rawUrl === "string") {
          // Cek apakah ini Full URL (Cloudinary / External)
          if (rawUrl.startsWith("http")) {
            finalUrl = rawUrl;
          }
          // Cek apakah ini File Lokal
          else {
            // Bersihkan slash ganda atau slash depan agar konsisten
            // Contoh: "/uploads/foto.jpg" atau "uploads/foto.jpg" atau "foto.jpg"

            let cleanPath = rawUrl;

            // Jika path tidak diawali 'uploads', kita asumsikan itu nama file saja dan tambahkan '/uploads/'
            if (!cleanPath.includes("uploads")) {
              cleanPath = `/uploads/${cleanPath.replace(/^\/+/, "")}`;
            }

            // Pastikan diawali slash "/" untuk digabung dengan domain
            if (!cleanPath.startsWith("/")) {
              cleanPath = `/${cleanPath}`;
            }

            // Gabungkan
            finalUrl = `${baseUrl}${cleanPath}`;
          }
        }

        // Return object standar
        if (typeof img === "string") {
          return { url: finalUrl, label: "Product Image" };
        }
        return {
          ...img,
          url: finalUrl, // URL yang sudah fix full domain
        };
      });

      // Filter gambar yang URL-nya null/undefined
      const validImages = normalizedImages.filter((img) => img.url);

      return {
        ...product,
        images: validImages,
        // Pastikan image_url legacy juga selalu terisi dengan data valid pertama
        image_url: validImages.length > 0 ? validImages[0].url : "https://placehold.co/600x400?text=No+Image",
      };
    });

    res.status(200).json({ success: true, message: "List Data Produk", data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Create Product (BEST PRACTICE: Simpan Path Relatif)
const createProduct = async (req, res) => {
  try {
    const { name, price, description, file_url, image_labels } = req.body;

    if (!name || !price || !description) {
      if (req.files) {
        /* logic cleanup temp file */
      }
      return res.status(400).json({ success: false, message: "Data wajib diisi!" });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "Minimal 1 gambar!" });
    }

    const labels = safeParseJSON(image_labels, []);
    const isProduction = process.env.NODE_ENV === "production";

    const imageObjects = req.files.map((file, index) => {
      let dbPath;

      if (isProduction) {
        dbPath = file.path; // Cloudinary (tetap full URL https)
      } else {
        // LOCAL: Simpan path relatif saja!
        // Jangan simpan http://localhost...
        dbPath = `/uploads/${file.filename}`;
      }

      return {
        url: dbPath,
        label: labels[index] || file.originalname.replace(/\.[^/.]+$/, ""),
        order: index,
      };
    });

    const mainImage = imageObjects[0].url;
    const imagesJson = JSON.stringify(imageObjects);

    const [result] = await db.query(
      "INSERT INTO products (name, price, description, image_url, images, file_url) VALUES (?, ?, ?, ?, ?, ?)",
      [name, price, description, mainImage, imagesJson, file_url || null],
    );

    // Saat response ke Frontend, kita harus tetap kasih Full URL agar bisa langsung tampil
    // Tapi di database yang tersimpan adalah path pendek.
    const baseUrl = getBaseUrl(req);
    const responseImages = imageObjects.map((img) => ({
      ...img,
      url: img.url.startsWith("/uploads") ? `${baseUrl}${img.url}` : img.url,
    }));

    res.status(201).json({
      success: true,
      message: "Produk berhasil ditambahkan",
      data: {
        id: result.insertId,
        name,
        price,
        description,
        images: responseImages,
      },
    });
  } catch (error) {
    console.error("Error createProduct:", error);
    res.status(500).json({ success: false, message: "Gagal menambahkan produk" });
  }
};

// === 3. DELETE PRODUCT (Revised & Robust) ===
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Ambil data gambar
    const [existing] = await db.query("SELECT images, image_url FROM products WHERE id = ?", [id]);

    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });
    }

    const product = existing[0];
    let imagesToDelete = [];

    // 2. Kumpulkan URL dari JSON Array 'images'
    if (product.images) {
      const parsed = safeParseJSON(product.images);
      parsed.forEach((img) => {
        const url = typeof img === "object" ? img.url : img;
        if (url) imagesToDelete.push(url);
      });
    }

    // 3. Tambahkan Main Image (legacy) jika belum ada
    if (product.image_url && !imagesToDelete.includes(product.image_url)) {
      imagesToDelete.push(product.image_url);
    }

    // 4. Hapus dari Database dulu (Supaya user tidak melihat produknya lagi)
    await db.query("DELETE FROM products WHERE id = ?", [id]);

    // 5. Hapus File di Cloudinary/Local (DENGAN AWAIT)
    if (imagesToDelete.length > 0) {
      // === KUNCI PERBAIKAN: Tambahkan 'await' di sini ===
      // Server akan diam menunggu sampai Cloudinary selesai hapus semua file.
      await Promise.allSettled(imagesToDelete.map((url) => deleteFile(url)));
      console.log(`[Cleanup] Berhasil membersihkan ${imagesToDelete.length} gambar.`);
    }

    res.status(200).json({ success: true, message: "Produk dan semua gambar berhasil dihapus tuntas!" });
  } catch (error) {
    console.error("Error deleteProduct:", error);
    // Fallback error handling (Foreign Key, dll)
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      await db.query("UPDATE products SET is_deleted = 1 WHERE id = ?", [id]);
      return res.status(200).json({ success: true, message: "Produk diarsipkan (ada riwayat order)." });
    }
    res.status(500).json({ success: false, message: "Gagal hapus produk" });
  }
};

// 4. Update Product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, images_metadata } = req.body;

  try {
    const [existing] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: "Not Found" });

    const oldProduct = existing[0];
    let oldImagesList =
      typeof oldProduct.images === "string" ? safeParseJSON(oldProduct.images) : oldProduct.images || [];
    let oldUrls = oldImagesList.map((img) => (img.url ? img.url : img));

    let finalImages = [];

    if (images_metadata) {
      const metadata = safeParseJSON(images_metadata);
      const isProduction = process.env.NODE_ENV === "production";
      let newFileIndex = 0;

      finalImages = metadata
        .map((item) => {
          if (item.type === "existing") {
            // Keep existing path as is
            return { url: item.url.replace(getBaseUrl(req), ""), label: item.label, order: item.order };
            // Note: .replace() diatas jaga-jaga kalau frontend kirim full URL, kita potong lagi jadi relative
          } else if (item.type === "new") {
            if (req.files && req.files[newFileIndex]) {
              const file = req.files[newFileIndex];
              newFileIndex++;
              let url = isProduction ? file.path : `/uploads/${file.filename}`; // Simpan Relative
              return {
                url: url,
                label: item.label || file.originalname.split(".")[0],
                order: item.order,
              };
            }
          }
          return null;
        })
        .filter(Boolean);

      // Cleanup images logic (Simplified for brevity)
      const newUrls = finalImages.map((img) => img.url);
      const urlsToDelete = oldUrls.filter((oldUrl) => !newUrls.includes(oldUrl));
      urlsToDelete.forEach((url) => deleteFile(url));
    } else {
      finalImages = oldImagesList; // Fallback
    }

    const finalMainImage = finalImages.length > 0 ? finalImages[0].url : null;
    const finalImagesJson = JSON.stringify(finalImages);

    await db.query("UPDATE products SET name = ?, price = ?, description = ?, image_url = ?, images = ? WHERE id = ?", [
      name,
      price,
      description,
      finalMainImage,
      finalImagesJson,
      id,
    ]);

    // Construct Full URL for response
    const baseUrl = getBaseUrl(req);
    const responseImages = finalImages.map((img) => ({
      ...img,
      url: img.url.startsWith("/uploads") ? `${baseUrl}${img.url}` : img.url,
    }));

    res.status(200).json({ success: true, message: "Produk berhasil diupdate!", data: { images: responseImages } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal update produk" });
  }
};

// === 5. BULK DELETE (Revised) ===
const bulkDeleteProducts = async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: "Tidak ada ID yang dikirim" });
  }

  let deletedCount = 0;
  let archivedCount = 0;

  try {
    // Kita proses satu per satu ID agar lebih aman (sequential loop)
    // Atau bisa parallel, tapi sequential lebih mudah ditrace errornya
    for (const id of ids) {
      try {
        const [rows] = await db.query("SELECT images, image_url FROM products WHERE id = ?", [id]);

        await db.query("DELETE FROM products WHERE id = ?", [id]);

        if (rows.length > 0) {
          const product = rows[0];
          let imagesToDelete = [];

          // Collect images logic
          if (product.images) {
            safeParseJSON(product.images).forEach((img) => {
              const url = typeof img === "object" ? img.url : img;
              if (url) imagesToDelete.push(url);
            });
          }
          if (product.image_url && !imagesToDelete.includes(product.image_url)) {
            imagesToDelete.push(product.image_url);
          }

          // === FIX: Gunakan await Promise.allSettled juga di sini ===
          // Jangan pakai forEach biasa untuk async!
          if (imagesToDelete.length > 0) {
            await Promise.allSettled(imagesToDelete.map((url) => deleteFile(url)));
          }
        }
        deletedCount++;
      } catch (error) {
        if (error.code === "ER_ROW_IS_REFERENCED_2") {
          await db.query("UPDATE products SET is_deleted = 1 WHERE id = ?", [id]);
          archivedCount++;
        } else {
          console.error(`Gagal delete ID ${id}:`, error.message);
        }
      }
    }
    res.status(200).json({
      success: true,
      message: `Selesai. Terhapus: ${deletedCount}, Diarsipkan: ${archivedCount}`,
    });
  } catch (error) {
    console.error("Bulk delete error:", error);
    res.status(500).json({ success: false, message: "Server Error saat Bulk Delete" });
  }
};

module.exports = { getAllProducts, createProduct, deleteProduct, updateProduct, bulkDeleteProducts };
