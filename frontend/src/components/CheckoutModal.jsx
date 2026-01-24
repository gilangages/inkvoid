import { X, Lock, ChevronLeft, ChevronRight, Image as ImageIcon, ZoomIn } from "lucide-react"; // Tambah icon ZoomIn
import { useState } from "react";

export const CheckoutModal = ({ isOpen, onClose, product, onSubmit }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  // STATE BARU: Untuk menghandle buka/tutup mode zoom full screen
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  if (!isOpen || !product) return null;

  const jumlahGambar = 8;
  // Array gambar (logic lama tetap sama)
  const images = Array(jumlahGambar).fill(product.image_url);

  const nextImage = (e) => {
    if (e) e.stopPropagation(); // Biar gak ngetrigger klik parent
    setCurrentImgIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    if (e) e.stopPropagation();
    setCurrentImgIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(product, name, email);
  };

  return (
    <>
      {/* --- MODAL UTAMA (Logic Lama) --- */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3E362E]/50 backdrop-blur-sm p-4 animate-fadeIn">
        <div className="bg-[#FDFCF8] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[600px] relative border-4 border-[#3E362E]">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 bg-white border-2 border-[#3E362E] p-1 rounded-full hover:bg-red-50 transition shadow-[2px_2px_0px_0px_rgba(62,54,46,1)]">
            <X size={20} color="#3E362E" />
          </button>

          {/* KOLOM KIRI */}
          <div className="w-full md:w-1/2 bg-[#EAE7DF] relative flex flex-col justify-center items-center p-4 min-h-[300px] md:min-h-full">
            {/* Main Image Slider */}
            <div
              className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden border-2 border-[#3E362E] bg-white shadow-md group cursor-zoom-in"
              onClick={() => setIsZoomOpen(true)} // TAMBAHAN: Klik untuk zoom
            >
              <img
                src={images[currentImgIdx]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = "https://placehold.co/600x400?text=No+Image";
                }}
              />

              {/* Overlay Hint (opsional, biar user tau bisa diklik) */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <ZoomIn
                  className="text-white opacity-0 group-hover:opacity-100 drop-shadow-md transform scale-0 group-hover:scale-110 transition-all duration-300"
                  size={32}
                />
              </div>

              {/* Tombol Navigasi Slider (Tetap ada) */}
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full border border-gray-300 hover:bg-white md:opacity-0 md:group-hover:opacity-100 transition-all z-10">
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full border border-gray-300 hover:bg-white md:opacity-0 md:group-hover:opacity-100 transition-all z-10">
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Thumbnail Indicator */}
            <div className="flex gap-2 mt-4 justify-center">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImgIdx(idx)}
                  className={`w-3 h-3 rounded-full border border-[#3E362E] transition-all ${currentImgIdx === idx ? "bg-[#3E362E] scale-125" : "bg-transparent"}`}
                />
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#6B5E51] bg-white/50 px-3 py-1 rounded-full border border-[#3E362E]/20">
              <ImageIcon size={14} /> Klik gambar untuk memperbesar
            </div>
          </div>

          {/* KOLOM KANAN (Form tetap sama persis) */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-[#3E362E] mb-2 leading-tight">{product.name}</h2>
              <p className="text-sm text-[#6B5E51] leading-relaxed bg-[#F3F0E9] p-3 rounded-lg border border-[#E5E0D8]">
                {product.description || "Stiker lucu siap print. Cocok buat jurnal, laptop, atau koleksi!"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-auto">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3E362E] mb-1">
                  Nama Kamu
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-white border-2 border-[#E5E0D8] focus:border-[#8DA399] focus:outline-none focus:ring-0 transition-all text-[#3E362E]"
                  placeholder="cth: Teman Stiker"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3E362E] mb-1">
                  Email (Untuk kirim file)
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-white border-2 border-[#E5E0D8] focus:border-[#8DA399] focus:outline-none focus:ring-0 transition-all text-[#3E362E]"
                  placeholder="email@kamu.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between py-2 border-t border-dashed border-[#E5E0D8] mt-2">
                <span className="text-sm font-bold text-[#6B5E51]">Harga</span>
                <span className="text-xl font-black text-[#3E362E]">
                  Rp {parseInt(product.price).toLocaleString("id-ID")}
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#8DA399] hover:bg-[#7A9186] text-white font-bold py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(62,54,46,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(62,54,46,0.2)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all flex justify-center items-center gap-2">
                <Lock size={16} />
                Bungkus Sekarang
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* --- FITUR BARU: LIGHTBOX OVERLAY (ZOOM) --- */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-[60] bg-[#3E362E]/95 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsZoomOpen(false)} // Klik background untuk tutup
        >
          {/* Tombol Close Zoom */}
          <button
            className="absolute top-4 right-4 text-white hover:text-red-400 transition-colors bg-white/10 p-2 rounded-full"
            onClick={() => setIsZoomOpen(false)}>
            <X size={32} />
          </button>

          {/* Gambar Full Screen */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={images[currentImgIdx]}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl scale-100 animate-popIn"
              onClick={(e) => e.stopPropagation()} // Supaya klik gambar gak nutup modal
            />

            {/* Navigasi di Mode Zoom (Opsional tapi bagus) */}
            <button
              onClick={prevImage}
              className="absolute left-2 md:left-8 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition-all">
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 md:right-8 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition-all">
              <ChevronRight size={32} />
            </button>
          </div>

          <div className="absolute bottom-6 text-white/70 text-sm bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
            Gambar {currentImgIdx + 1} dari {images.length}
          </div>
        </div>
      )}
    </>
  );
};
