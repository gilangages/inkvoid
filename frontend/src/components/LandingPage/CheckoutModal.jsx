import { X, Lock, ChevronLeft, ChevronRight, Image as ImageIcon, ZoomIn, Info, Mail } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export const CheckoutModal = ({ isOpen, onClose, product, onSubmit }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const images =
    product?.images && product.images.length > 0 ? product.images : product?.image_url ? [product.image_url] : [];

  const nextImage = (e) => {
    if (e) e.stopPropagation();
    if (images.length > 0) {
      setCurrentImgIdx((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e) => {
    if (e) e.stopPropagation();
    if (images.length > 0) {
      setCurrentImgIdx((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isZoomOpen) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setIsZoomOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomOpen, currentImgIdx, images.length]);

  if (!isOpen || !product) return null;

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) nextImage();
    if (distance < -50) prevImage();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(product, name, email);
  };

  return (
    <>
      <div className="fixed inset-0 z-51 flex items-end md:items-center justify-center bg-[#3E362E]/60 backdrop-blur-sm p-0 md:p-4 animate-fadeIn">
        <div className="bg-[#FDFCF8] w-full md:max-w-4xl rounded-t-[32px] md:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh] md:max-h-[640px] relative border-t-4 md:border-4 border-[#3E362E]">
          {/* Close Button - Lebih clean */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-30 bg-white/90 backdrop-blur-md border-2 border-[#3E362E] p-2 rounded-full hover:bg-red-50 transition-all shadow-[2px_2px_0px_0px_rgba(62,54,46,1)] active:translate-y-[2px] active:shadow-none">
            <X size={18} color="#3E362E" strokeWidth={3} />
          </button>

          {/* KOLOM KIRI (FOTO) */}
          <div
            className="w-full md:w-1/2 bg-[#EAE7DF] relative overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}>
            <div
              className="relative w-full h-full aspect-[4/5] md:aspect-auto md:h-full overflow-hidden bg-white group cursor-zoom-in"
              onClick={() => setIsZoomOpen(true)}>
              <img
                src={images[currentImgIdx]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-110"
                onError={(e) => (e.target.src = "https://placehold.co/600x600?text=No+Image")}
              />

              {/* Overlay Gradient untuk Mobile agar indicator terlihat */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent md:hidden" />

              {images.length > 1 && (
                <div className="hidden md:block">
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full border-2 border-[#3E362E] hover:bg-white transition-all z-10 shadow-md">
                    <ChevronLeft size={24} color="#3E362E" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full border-2 border-[#3E362E] hover:bg-white transition-all z-10 shadow-md">
                    <ChevronRight size={24} color="#3E362E" />
                  </button>
                </div>
              )}
            </div>

            {/* Indicator Foto - Lebih Slim */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <div className="flex gap-2 px-3 py-1.5 bg-black/20 backdrop-blur-md rounded-full">
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        currentImgIdx === idx ? "w-6 bg-white" : "w-1.5 bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* KOLOM KANAN (FORM MODERN) */}
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto bg-[#FDFCF8]">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#3E362E]/5 rounded-lg mb-4 border border-[#3E362E]/10">
                <ImageIcon size={12} className="text-[#3E362E]" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#3E362E]">
                  Digital Artwork
                </span>
              </div>

              <h2 className="text-3xl font-black text-[#3E362E] mb-4 leading-[1.1] uppercase italic tracking-tight">
                {product.name}
              </h2>

              {/* Deskripsi: Bye-bye kotak coklat, Hello Editorial Style */}
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3E362E]/10 rounded-full" />
                <p className="pl-5 text-sm md:text-base text-[#6B5E51] leading-relaxed italic font-medium">
                  "{product.description || "Koleksi aset digital eksklusif untuk kebutuhan kreatifmu."}"
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Input Nama */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#3E362E]/40 ml-1">
                    Nama Kamu
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-4 rounded-2xl bg-[#F3F0E9]/30 border-2 border-[#E5E0D8] focus:border-[#3E362E] focus:bg-white outline-none transition-all text-[#3E362E] font-bold placeholder:text-[#3E362E]/20"
                    placeholder="Masukkan namamu..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Input Email */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#3E362E]/40 ml-1">
                    Email Pengiriman
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-5 py-4 rounded-2xl bg-[#F3F0E9]/30 border-2 border-[#E5E0D8] focus:border-[#3E362E] focus:bg-white outline-none transition-all text-[#3E362E] font-bold placeholder:text-[#3E362E]/20"
                    placeholder="email@kamu.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="flex gap-2 items-start mt-3 ml-1">
                    <Mail size={14} className="mt-0.5 text-[#3E362E]/30" />
                    <p className="text-[10px] font-bold text-[#3E362E]/40 leading-snug">
                      Produk akan dikirim secara instan ke email ini setelah verifikasi.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section Harga & Tombol - Lebih Impactful */}
              <div className="pt-6 mt-4 border-t-2 border-dashed border-[#E5E0D8]">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#6B5E51]">
                      Total Bayar
                    </span>
                    <span className="text-3xl font-black text-[#3E362E] tracking-tighter">
                      Rp {parseInt(product.price).toLocaleString("id-ID")}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#3E362E] hover:bg-black text-[#FDFCF8] font-black py-5 rounded-2xl shadow-[0_8px_20px_rgba(62,54,46,0.25)] active:scale-[0.97] transition-all flex justify-center items-center gap-3 uppercase tracking-[0.2em] text-sm group">
                    <Lock size={18} className="group-hover:rotate-12 transition-transform" />
                    Bungkus Sekarang
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* LIGHTBOX ZOOM */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-[100] bg-[#3E362E]/95 flex items-center justify-center animate-fadeIn"
          onClick={() => setIsZoomOpen(false)}>
          <button className="absolute top-6 right-6 text-white bg-white/10 p-3 rounded-full border border-white/20 hover:bg-white/20 transition-all z-[110]">
            <X size={32} />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 text-white bg-white/5 p-4 rounded-full border border-white/10 hover:bg-white/20 transition-all z-[110] group">
                <ChevronLeft size={48} className="group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={nextImage}
                className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 text-white bg-white/5 p-4 rounded-full border border-white/10 hover:bg-white/20 transition-all z-[110] group">
                <ChevronRight size={48} className="group-hover:scale-110 transition-transform" />
              </button>
            </>
          )}

          <div className="relative w-full h-full flex items-center justify-center p-0 md:p-20">
            <img
              src={images[currentImgIdx]}
              className="max-w-full max-h-full object-contain animate-popIn shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          </div>

          <div className="absolute bottom-10">
            <div className="text-white font-black tracking-widest text-xs bg-black/40 px-6 py-2.5 rounded-full backdrop-blur-md border border-white/10 uppercase">
              {currentImgIdx + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
