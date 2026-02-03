// backend/tests/delete_logic_robust.test.js

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

describe("Robust Delete Logic Check", () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: 101 } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("Sukses menghapus meski JSON ter-double stringify (Solusi Sisa Foto)", async () => {
    const realData = [
      { url: "https://res.cloudinary.com/demo/image/upload/v1/folder/A.jpg" },
      { url: "https://res.cloudinary.com/demo/image/upload/v1/folder/B.jpg" },
    ];
    // Simulasi Double Encoding: '"[...]"'
    const doubleStringified = JSON.stringify(JSON.stringify(realData));

    const mockProduct = {
      id: 101,
      image_url: "https://res.cloudinary.com/demo/image/upload/v1/folder/A.jpg",
      images: doubleStringified,
    };

    db.query.mockResolvedValueOnce([[mockProduct]]); // Select
    db.query.mockResolvedValueOnce([{ affectedRows: 1 }]); // Delete

    await deleteProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    // Harus hapus 2 kali (A dan B), bukan 1 kali!
    expect(cloudinary.uploader.destroy).toHaveBeenCalledTimes(2);
    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith("folder/A");
    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith("folder/B");
  });

  it("Sukses menghapus URL tanpa version (Non-Standard)", async () => {
    const mockProduct = {
      id: 102,
      image_url: "https://res.cloudinary.com/demo/image/upload/folder/produk-baru.jpg",
      images: "[]",
    };

    db.query.mockResolvedValueOnce([[mockProduct]]);
    db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

    await deleteProduct(req, res);
    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith("folder/produk-baru");
  });
});
