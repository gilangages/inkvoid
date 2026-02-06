const db = require("../config/database");
const { cloudinary } = require("../middleware/uploadMiddleware");
const fs = require("fs");
const path = require("path");

// === HELPER UTAMA: Parse JSON Robust (Anti Double-Stringify) ===
// Ini memperbaiki masalah di mana JSON tersimpan sebagai string ganda di DB
const safeParseJSON = (jsonString, fallback = []) => {
  if (!jsonString) return fallback;
  try {
    let parsed = JSON.parse(jsonString);

    // TRICKY FIX: Cek apakah hasil parse masih berupa string?
    // Jika ya, berarti kena double-stringify. Kita parse sekali lagi.
    if (typeof parsed === "string") {
      try {
        const doubleParsed = JSON.parse(parsed);
        if (typeof doubleParsed === "object") return doubleParsed;
      } catch (e) {
        // Jika gagal parse kedua kali, kembalikan yang pertama
        return parsed;
      }
    }
    return parsed;
  } catch (e) {
    console.error("JSON Parse Error:", e.message);
    return fallback;
  }
};

// === HELPER: Dynamic Base URL Generator ===
const getBaseUrl = (req) => {
  if (process.env.API_BASE_URL) return process.env.API_BASE_URL;
  const protocol = req.protocol;
  const host = req.get("host");
  return `${protocol}://${host}`;
};

// === HELPER: Ekstrak Public ID Cloudinary (REVISED & ROBUST) ===
const getCloudinaryPublicId = (url) => {
  if (!url || !url.includes("cloudinary.com")) return null;
  try {
    // 1. Bersihkan Query Params & Extension
    const urlWithoutQuery = url.split("?")[0];
    const urlWithoutExt = urlWithoutQuery.replace(/\.[^/.]+$/, "");

    // 2. CARA 1: Standard Regex (Cari /v<angka>/)
    // Cloudinary standard: .../upload/v123456789/folder/namaproduk
    const versionRegex = /\/v\d+\/(.+)$/;
    const match = urlWithoutExt.match(versionRegex);
    if (match && match[1]) return match[1];

    // 3. CARA 2: Fallback (Jika tidak ada version atau format beda)
    // Ambil semua segmen setelah "/upload/"
    const parts = urlWithoutExt.split("/upload/");
    if (parts.length >= 2) {
      let pathAfterUpload = parts[1];

      // Hapus transformasi jika ada (segmen yang diawali w_, h_, c_, dpr_, dll)
      // Contoh: w_500,c_fill/folder/img -> folder/img
      const segments = pathAfterUpload.split("/");
      const cleanSegments = segments.filter((seg) => !seg.match(/^(w_|h_|c_|dpr_|q_|f_|e_|co_|b_|fl_)/));

      return cleanSegments.join("/");
    }

    return null;
  } catch (error) {
    console.error("Gagal ekstrak public ID:", error);
    return null;
  }
};

// === HELPER: Hapus File ===
const deleteFile = async (fileUrl) => {
  if (!fileUrl) return;

  try {
    // A. Jika file Cloudinary
    if (fileUrl.includes("cloudinary.com")) {
      const publicId = getCloudinaryPublicId(fileUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
        // console.log(`[Cloudinary] Deleted: ${publicId}`);
      } else {
        console.warn(`[Cloudinary] Gagal ekstrak ID, skip: ${fileUrl}`);
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
      const safeFilename = path.basename(filename);
      const filePath = path.join(__dirname, "../public/uploads", safeFilename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (error) {
    console.error(`Error delete file (${fileUrl}):`, error.message);
  }
};

// 1. Get All Products
const getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products WHERE is_deleted = 0 AND is_active = 1 ORDER BY id DESC");
    const baseUrl = getBaseUrl(req);

    const products = rows.map((product) => {
      let images = [];
      // Gunakan safeParseJSON yang baru
      if (typeof product.images === "string") {
        images = safeParseJSON(product.images, []);
      } else if (Array.isArray(product.images)) {
        images = product.images;
      } else if (product.image_url) {
        images = [product.image_url];
      }

      if (!Array.isArray(images)) images = [];

      const normalizedImages = images.map((img) => {
        let rawUrl = typeof img === "string" ? img : img.url;
        let finalUrl = rawUrl;

        if (typeof rawUrl === "string") {
          if (rawUrl.startsWith("http")) {
            finalUrl = rawUrl;
          } else {
            let cleanPath = rawUrl;
            if (!cleanPath.includes("uploads")) {
              cleanPath = `/uploads/${cleanPath.replace(/^\/+/, "")}`;
            }
            if (!cleanPath.startsWith("/")) {
              cleanPath = `/${cleanPath}`;
            }
            finalUrl = `${baseUrl}${cleanPath}`;
          }
        }

        return typeof img === "string" ? { url: finalUrl, label: "Product Image" } : { ...img, url: finalUrl };
      });

      const validImages = normalizedImages.filter((img) => img.url);

      return {
        ...product,
        images: validImages,
        image_url: validImages.length > 0 ? validImages[0].url : "https://placehold.co/600x400?text=No+Image",
      };
    });

    res.status(200).json({ success: true, message: "List Data Produk", data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 1.1 Get Admin Products (PROTECTED - Tampilkan SEMUA)
const getAdminProducts = async (req, res) => {
  try {
    // Tampilkan semua yg belum dihapus (termasuk is_active = 0)
    const [rows] = await db.query("SELECT * FROM products WHERE is_deleted = 0 ORDER BY id DESC");
    const baseUrl = getBaseUrl(req);

    // Reuse logic mapping images (Cleanest way without creating new function to avoid changing var names globally)
    const products = rows.map((product) => {
      let images = [];
      if (typeof product.images === "string") {
        images = safeParseJSON(product.images, []);
      } else if (Array.isArray(product.images)) {
        images = product.images;
      } else if (product.image_url) {
        images = [product.image_url];
      }
      if (!Array.isArray(images)) images = [];

      const normalizedImages = images.map((img) => {
        let rawUrl = typeof img === "string" ? img : img.url;
        let finalUrl = rawUrl;
        if (typeof rawUrl === "string") {
          if (rawUrl.startsWith("http")) {
            finalUrl = rawUrl;
          } else {
            let cleanPath = rawUrl;
            if (!cleanPath.includes("uploads")) cleanPath = `/uploads/${cleanPath.replace(/^\/+/, "")}`;
            if (!cleanPath.startsWith("/")) cleanPath = `/${cleanPath}`;
            finalUrl = `${baseUrl}${cleanPath}`;
          }
        }
        return typeof img === "string" ? { url: finalUrl, label: "Product Image" } : { ...img, url: finalUrl };
      });
      const validImages = normalizedImages.filter((img) => img.url);

      return {
        ...product,
        images: validImages,
        image_url: validImages.length > 0 ? validImages[0].url : "https://placehold.co/600x400?text=No+Image",
      };
    });

    res.status(200).json({ success: true, message: "List Semua Produk (Admin)", data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Create Product
const createProduct = async (req, res) => {
  try {
    const { name, price, description, file_url, image_labels } = req.body;

    if (!name || !price || !description) {
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
        dbPath = file.path;
      } else {
        dbPath = `/uploads/${file.filename}`;
      }

      return {
        url: dbPath,
        label: labels[index] || file.originalname.replace(/\.[^/.]+$/, ""),
        order: index,
      };
    });

    const mainImage = imageObjects[0].url;
    // Stringify manual untuk memastikan format
    const imagesJson = JSON.stringify(imageObjects);

    const [result] = await db.query(
      "INSERT INTO products (name, price, description, image_url, images, file_url) VALUES (?, ?, ?, ?, ?, ?)",
      [name, price, description, mainImage, imagesJson, file_url || null],
    );

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

// === 3. DELETE PRODUCT (FIXED & ROBUST) ===
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await db.query("SELECT images, image_url FROM products WHERE id = ?", [id]);

    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });
    }

    const product = existing[0];
    const uniqueUrls = new Set();

    // 1. Ambil dari Array 'images' dengan parsing robust
    if (product.images) {
      const parsed = safeParseJSON(product.images);
      if (Array.isArray(parsed)) {
        parsed.forEach((img) => {
          const url = typeof img === "object" ? img.url : img;
          if (url) uniqueUrls.add(url);
        });
      }
    }

    // 2. Ambil dari Main Image Legacy
    if (product.image_url) {
      uniqueUrls.add(product.image_url);
    }

    const imagesToDelete = Array.from(uniqueUrls);
    console.log(`[Cleanup] Menghapus ${imagesToDelete.length} gambar unik untuk Produk ID ${id}`);

    // Hapus dari Database dulu
    await db.query("DELETE FROM products WHERE id = ?", [id]);

    // Hapus File (Promise.allSettled agar parallel & tidak stop jika 1 error)
    if (imagesToDelete.length > 0) {
      await Promise.allSettled(imagesToDelete.map((url) => deleteFile(url)));
    }

    res.status(200).json({ success: true, message: "Produk dan semua gambar berhasil dihapus!" });
  } catch (error) {
    console.error("Error deleteProduct:", error);
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      await db.query("UPDATE products SET is_deleted = 1 WHERE id = ?", [id]);
      return res.status(200).json({ success: true, message: "Produk diarsipkan (ada order terkait)." });
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
    if (!Array.isArray(oldImagesList)) oldImagesList = [];

    let oldUrls = oldImagesList.map((img) => (img.url ? img.url : img));
    let finalImages = [];

    if (images_metadata) {
      const metadata = safeParseJSON(images_metadata, []);
      const isProduction = process.env.NODE_ENV === "production";
      let newFileIndex = 0;

      finalImages = metadata
        .map((item) => {
          if (item.type === "existing") {
            // Bersihkan base URL untuk disimpan relatif/bersih
            let cleanUrl = item.url.replace(getBaseUrl(req), "");
            return { url: cleanUrl, label: item.label, order: item.order };
          } else if (item.type === "new") {
            if (req.files && req.files[newFileIndex]) {
              const file = req.files[newFileIndex];
              newFileIndex++;
              let url = isProduction ? file.path : `/uploads/${file.filename}`;
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

      // Logic Hapus Gambar Lama yang tidak terpakai lagi
      const newUrls = finalImages.map((img) => img.url);
      const urlsToDelete = oldUrls.filter((oldUrl) => !newUrls.includes(oldUrl));
      if (urlsToDelete.length > 0) {
        Promise.allSettled(urlsToDelete.map((url) => deleteFile(url)));
      }
    } else {
      finalImages = oldImagesList;
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

// 5. Bulk Delete
const bulkDeleteProducts = async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: "Tidak ada ID yang dikirim" });
  }

  let deletedCount = 0;
  let archivedCount = 0;

  try {
    for (const id of ids) {
      try {
        const [rows] = await db.query("SELECT images, image_url FROM products WHERE id = ?", [id]);

        await db.query("DELETE FROM products WHERE id = ?", [id]);

        if (rows.length > 0) {
          const product = rows[0];
          const uniqueUrls = new Set();

          if (product.images) {
            // Gunakan safeParseJSON yang baru!
            const parsed = safeParseJSON(product.images);
            if (Array.isArray(parsed)) {
              parsed.forEach((img) => {
                const url = typeof img === "object" ? img.url : img;
                if (url) uniqueUrls.add(url);
              });
            }
          }
          if (product.image_url) {
            uniqueUrls.add(product.image_url);
          }

          const imagesToDelete = Array.from(uniqueUrls);
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

// 6. Toggle Product Status (Active/Inactive)
const toggleProductStatus = async (req, res) => {
  const { id } = req.params;
  try {
    // Cek status saat ini
    const [rows] = await db.query("SELECT is_active FROM products WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });

    const currentStatus = rows[0].is_active;
    const newStatus = currentStatus === 1 ? 0 : 1; // Toggle logic

    await db.query("UPDATE products SET is_active = ? WHERE id = ?", [newStatus, id]);

    res.status(200).json({
      success: true,
      message: `Produk berhasil ${newStatus === 1 ? "diaktifkan" : "dinonaktifkan"}.`,
      data: { id, is_active: newStatus },
    });
  } catch (error) {
    console.error("Toggle status error:", error);
    res.status(500).json({ success: false, message: "Gagal mengubah status produk" });
  }
};

module.exports = {
  getAllProducts,
  getAdminProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  bulkDeleteProducts,
  toggleProductStatus,
};
