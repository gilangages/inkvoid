// backend/tests/delete_logic.test.js

// 1. MOCK DATABASE & CLOUDINARY
jest.mock("../config/database", () => ({
  query: jest.fn(),
  end: jest.fn(),
}));

jest.mock("../middleware/uploadMiddleware", () => ({
  cloudinary: {
    uploader: {
      destroy: jest.fn().mockResolvedValue({ result: "ok" }),
    },
  },
  upload: {},
}));

const { deleteProduct } = require("../controllers/productController");
const db = require("../config/database");
const { cloudinary } = require("../middleware/uploadMiddleware");

// Mock Response
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Product Deletion Logic", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Harus sukses menghapus berbagai format URL (Normal, Folder, & Transformasi)", async () => {
    // KASUS PENTING: Simulasi URL Cloudinary dengan Transformasi (w_1000)
    // Inilah penyebab bug "sisa 2" foto kamu sebelumnya.
    const complexImages = JSON.stringify([
      { url: "https://res.cloudinary.com/demo/image/upload/v12345/lumastore/sepatu-keren.jpg" }, // Normal
      { url: "https://res.cloudinary.com/demo/image/upload/c_limit,f_auto,h_1000,q_auto,w_1000/v98765/lumastore/baju-baru.png" }, // Punya Transformasi Optimasi
    ]);

    const mockProduct = {
      id: 99,
      // Main image juga punya folder
      image_url: "https://res.cloudinary.com/demo/image/upload/v11111/folder/subfolder/topi.jpg",
      images: complexImages,
    };

    // Setup DB Mock
    db.query.mockResolvedValueOnce([[mockProduct]]); // Select
    db.query.mockResolvedValueOnce([{ affectedRows: 1 }]); // Delete

    const req = { params: { id: 99 } };
    const res = mockRes();

    // Execute
    await deleteProduct(req, res);

    // ASSERTIONS
    expect(res.status).toHaveBeenCalledWith(200);

    // Cek Cloudinary Destroy dipanggil 3 kali
    expect(cloudinary.uploader.destroy).toHaveBeenCalledTimes(3);

    // Cek apakah Public ID yang diekstrak BENAR (tanpa ekstensi, tanpa v123, tanpa w_1000)

    // 1. Cek Image Normal
    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith("lumastore/sepatu-keren");

    // 2. Cek Image dengan Transformasi (Ini tes paling penting!)
    // Parser harus pintar membuang 'w_1000,c_fill/v98765/' dan hanya ambil ID
    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith("lumastore/baju-baru");

    // 3. Cek Image dengan Folder Bertingkat
    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith("folder/subfolder/topi");
  });
});
