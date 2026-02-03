import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { bulkDeleteProducts, getAllProducts, productDelete } from "../../../lib/api/ProductApi";
import { Trash2, CheckSquare, Square, RefreshCw, X, ChevronLeft, ChevronRight } from "lucide-react";
import { alertConfirm, alertError, alertSuccess } from "../../../lib/alert";
import AdminProductCard from "../Card/AdminProductCard";
import { useLocalStorage } from "react-use";
import EditProductModal from "./EditProductModal";

export default function ProductList() {
  const [token, _] = useLocalStorage("token", "");
  const [products, setProducts] = useState([]);
  const [search, _setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // --- LOGIC MODAL & CAROUSEL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- LOGIC SWIPE (Touch) ---
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [reload, setReload] = useState(false);

  //Edit
  const [editingProduct, setEditingProduct] = useState(null);

  //bulkDelete
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) handleNextImage();
    if (distance < -minSwipeDistance) handlePrevImage();
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await getAllProducts();
      const res = await response.json();
      if (res.success) setProducts(res.data);
      else setProducts([]);
    } catch (error) {
      console.error("Gagal ambil produk", error);
      alertError("Gagal mengambil data produk");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleBulkDelete = async () => {
    if (!(await alertConfirm(`Hapus ${selectedIds.length} produk sekaligus?`))) return;
    setIsLoading(true);
    try {
      const response = await bulkDeleteProducts(token, selectedIds);
      const responseBody = await response.json();
      if (response.ok) {
        await alertSuccess(responseBody.message);
        setSelectedIds([]);
        setIsSelectionMode(false);
        setReload(!reload);
      }
    } catch (error) {
      console.log(error);
      alertError("Gagal menghapus produk");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelectionMode = () => {
    if (isSelectionMode) setSelectedIds([]);
    setIsSelectionMode(!isSelectionMode);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    await fetchProducts();
    await alertSuccess("Data berhasil diperbarui!");
    setIsLoading(false);
  };

  const handleViewImage = (product) => {
    let images = [];

    // Cek apakah product.images ada dan valid
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      images = product.images.map((img) => {
        // [FIX] Jika img adalah object (format baru), ambil property .url
        if (typeof img === "object" && img !== null) {
          return img.url;
        }
        // Jika string (format lama), kembalikan langsung
        return img;
      });
    } else if (product.image_url) {
      images = [product.image_url];
    }

    setCurrentImages(images);
    setCurrentIndex(0);
    setIsModalOpen(true);
  };

  const handleNextImage = () => setCurrentIndex((prev) => (prev + 1) % currentImages.length);
  const handlePrevImage = () => setCurrentIndex((prev) => (prev === 0 ? currentImages.length - 1 : prev - 1));

  const onNextClick = (e) => {
    e.stopPropagation();
    handleNextImage();
  };
  const onPrevClick = (e) => {
    e.stopPropagation();
    handlePrevImage();
  };

  const handleEdit = (product) => setEditingProduct(product);
  const handleEditSuccess = () => setReload(!reload);

  async function handleDelete(id) {
    if (!(await alertConfirm("Apakah kamu yakin mau menghapus produk ini?"))) return;
    try {
      const response = await productDelete(token, id);
      const responseBody = await response.json();

      if (response.ok) {
        // Logic pesan sekarang dinamis sesuai respon cerdas dari backend tadi
        // Kalo bersih: "Produk berhasil dihapus!"
        // Kalo soft delete: "Produk diarsipkan..."
        await alertSuccess(responseBody.message);
        setReload(!reload);
      } else {
        alertError(responseBody.message || "Terjadi kesalahan saat menghapus.");
      }
    } catch (error) {
      console.error(error);
      alertError("Gagal menghubungi server.");
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [reload]);

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto animate-slide-up relative px-4 pb-32">
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#3e362e]">Daftar Produk</h1>
          <p className="text-[#8c8478]">Kelola semua stiker yang sudah diupload.</p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={toggleSelectionMode}
            className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap border-2 ${
              isSelectionMode
                ? "bg-[#3e362e] border-[#3e362e] text-white"
                : "bg-white border-[#E5E0D8] text-[#3e362e] hover:bg-[#f3f0e9]"
            }`}>
            {isSelectionMode ? "Batal" : "Pilih Produk"}
          </button>

          <button onClick={handleRefresh} className="p-2 bg-[#f3f0e9] rounded-lg hover:bg-[#e5e0d8] ml-auto shrink-0">
            <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </header>

      {/* Grid Content */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <AdminProductCard
              key={product.id}
              product={product}
              isSelectionMode={isSelectionMode}
              isSelected={selectedIds.includes(product.id)}
              onSelect={() => toggleSelect(product.id)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewImage={handleViewImage}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#f3f0e9]/50 rounded-3xl border-2 border-dashed border-[#E5E0D8]">
          <p className="text-[#8c8478]">Tidak ada produk ditemukan.</p>
        </div>
      )}

      {/* --- FLOATING ACTION BAR: Glassmorphism Effect & Lower Position --- */}
      {isSelectionMode && (
        <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-lg bg-[#3e362e]/90 backdrop-blur-xl text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between animate-slide-up border border-white/20 ring-1 ring-white/10">
          <div className="flex flex-col pl-2">
            <span className="text-[10px] uppercase tracking-widest text-gray-300 font-bold">Terpilih</span>
            <span className="text-lg font-black leading-none">
              {selectedIds.length} <span className="text-xs font-normal text-gray-200 ml-1">Item</span>
            </span>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={handleSelectAll}
              className="p-3 hover:bg-white/10 rounded-xl transition-colors text-white active:scale-90"
              title="Pilih Semua">
              {selectedIds.length === filteredProducts.length && filteredProducts.length > 0 ? (
                <CheckSquare size={22} className="text-[#8da399]" />
              ) : (
                <Square size={22} />
              )}
            </button>

            <button
              onClick={handleBulkDelete}
              disabled={selectedIds.length === 0}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all active:scale-95 ${
                selectedIds.length > 0
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-lg"
                  : "bg-white/10 text-white/30 cursor-not-allowed"
              }`}>
              <Trash2 size={18} />
              <span className="text-sm font-bold">Hapus</span>
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL LIGHTBOX UPDATE --- */}
      {isModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-0 md:p-4 backdrop-blur-sm animate-fade-in touch-none"
            onClick={() => setIsModalOpen(false)}>
            <div
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center pointer-events-none"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}>
              <div className="relative pointer-events-auto w-full flex justify-center">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute -top-16 right-4 md:-right-12 text-white/80 hover:text-white transition p-2 z-50 bg-black/20 rounded-full md:bg-transparent">
                  <X size={32} />
                </button>
                <img
                  src={currentImages[currentIndex]}
                  alt={`Preview ${currentIndex}`}
                  className="max-h-[85vh] w-full md:w-auto object-contain md:rounded-lg shadow-2xl transition-all duration-300"
                  onClick={(e) => e.stopPropagation()}
                />
                {currentImages.length > 1 && (
                  <>
                    <button
                      onClick={onPrevClick}
                      className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white border border-white/20 p-3 rounded-full transition-all duration-200 hover:scale-110 backdrop-blur-sm group">
                      <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={onNextClick}
                      className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white border border-white/20 p-3 rounded-full transition-all duration-200 hover:scale-110 backdrop-blur-sm group">
                      <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                      {currentImages.map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? "bg-white w-4" : "bg-white/40"}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              <p className="text-white/40 mt-12 text-xs md:text-sm pointer-events-auto absolute bottom-8 md:static">
                {currentImages.length > 1 ? "Geser untuk melihat foto lain" : ""}
              </p>
            </div>
          </div>,
          document.body,
        )}

      {editingProduct && (
        <EditProductModal
          key={editingProduct.id}
          isOpen={true}
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
