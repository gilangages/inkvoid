import { useState, useEffect } from "react";
import { Plus, Trash2, Link as LinkIcon, Save, Image as ImageIcon } from "lucide-react";

export default function AdminDashboard() {
  // State Form
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    images: [""], // Mulai dengan 1 input kosong
  });

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Produk saat load
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const json = await res.json();
      if (json.success) setProducts(json.data);
    } catch (err) {
      console.error("Gagal ambil produk", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle Input Biasa
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Dynamic Image URL
  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  // Submit Data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Filter URL kosong
    const cleanImages = formData.images.filter((url) => url.trim() !== "");

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, images: cleanImages }),
      });
      const json = await res.json();

      if (json.success) {
        alert("Produk Berhasil Ditambahkan! 🎉");
        setFormData({ name: "", price: "", description: "", images: [""] }); // Reset Form
        fetchProducts(); // Refresh List
      } else {
        alert("Gagal: " + json.message);
      }
    } catch (err) {
      console.log(err);
      alert("Error Server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#3e362e]">Dashboard Produk</h1>
        <p className="text-[#8c8478]">Kelola koleksi stiker LumaStore</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORM INPUT (Kiri) */}
        <div className="lg:col-span-1">
          <div className="bg-white border-2 border-[#e5e0d8] rounded-xl p-6 sticky top-6 shadow-sm">
            <h2 className="font-bold text-xl mb-4 flex items-center gap-2 text-[#8da399]">
              <Plus size={20} /> Tambah Produk
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-bold text-[#3e362e]">Nama Produk</label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border-2 border-[#e5e0d8] rounded-lg p-2 mt-1 focus:border-[#8da399] outline-none"
                  placeholder="Contoh: Stiker Kucing"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-[#3e362e]">Harga (Rp)</label>
                <input
                  required
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border-2 border-[#e5e0d8] rounded-lg p-2 mt-1 focus:border-[#8da399] outline-none"
                  placeholder="15000"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-[#3e362e]">Deskripsi</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border-2 border-[#e5e0d8] rounded-lg p-2 mt-1 focus:border-[#8da399] outline-none h-24 resize-none"
                  placeholder="Deskripsi singkat..."
                />
              </div>

              {/* Dynamic Image URLs */}
              <div>
                <label className="text-sm font-bold text-[#3e362e] flex justify-between items-center">
                  Foto Produk
                  <button
                    type="button"
                    onClick={addImageField}
                    className="text-xs text-[#d68c76] font-bold hover:underline">
                    + Tambah URL
                  </button>
                </label>
                <div className="space-y-2 mt-2">
                  {formData.images.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="relative w-full">
                        <LinkIcon size={14} className="absolute left-3 top-3 text-gray-400" />
                        <input
                          value={url}
                          onChange={(e) => handleImageChange(index, e.target.value)}
                          className="w-full border-2 border-[#e5e0d8] rounded-lg p-2 pl-9 text-sm focus:border-[#8da399] outline-none"
                          placeholder="https://..."
                        />
                      </div>
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          className="text-red-400 hover:text-red-600">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full bg-[#3e362e] text-white font-bold py-3 rounded-lg hover:bg-[#8da399] transition-all flex justify-center items-center gap-2">
                {isLoading ? (
                  "Menyimpan..."
                ) : (
                  <>
                    <Save size={18} /> Simpan Produk
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* LIST PRODUK (Kanan) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-bold text-xl text-[#3e362e]">Daftar Produk ({products.length})</h2>
          {products.length === 0 && <p className="text-gray-400 italic">Belum ada produk.</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-[#e5e0d8] rounded-lg p-3 flex gap-4 hover:shadow-md transition-shadow items-center">
                <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={product.image_url || "https://placehold.co/100"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = "https://placehold.co/100?text=No+Img")}
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-[#3e362e]">{product.name}</h3>
                  <p className="text-[#8da399] font-bold text-sm">
                    Rp {parseInt(product.price).toLocaleString("id-ID")}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{product.description}</p>
                </div>
                {/* Indikator jumlah foto */}
                {product.images && Array.isArray(product.images) && product.images.length > 1 && (
                  <span className="text-xs bg-[#f3f0e9] px-2 py-1 rounded text-[#8c8478] flex items-center gap-1">
                    <ImageIcon size={10} /> +{product.images.length - 1}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
