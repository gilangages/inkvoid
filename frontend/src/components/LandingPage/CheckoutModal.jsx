import { X, Lock, ChevronLeft, ChevronRight, Image as ImageIcon, Mail, Check, MessageCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";

export const CheckoutModal = ({ isOpen, onClose, product, onSubmit }) => {
  // --- STATE BARU: Email ---
  const [email, setEmail] = useState("");

  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // --- NORMALISASI DATA IMAGES (TIDAK DIUBAH) ---
  const getNormalizedImages = () => {
    if (!product) return [];

    let rawImages = [];
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      rawImages = product.images;
    } else if (product.image_url) {
      rawImages = [product.image_url];
    }

    return rawImages.map((img) => {
      if (typeof img === "object" && img !== null) {
        return { url: img.url, label: img.label || "" };
      }
      return { url: img, label: "" };
    });
  };

  const images = getNormalizedImages();
  const currentImage = images[currentImgIdx];

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
    if (isOpen) {
      window.history.pushState({ modalOpen: true }, "", window.location.href);
      const handlePopState = (event) => {
        console.log(event);
        onClose();
      };
      window.addEventListener("popstate", handlePopState);
      return () => {
        window.removeEventListener("popstate", handlePopState);
        if (window.history.state?.modalOpen) {
          window.history.back();
        }
      };
    }
  }, [isOpen]);

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
    if (!isAgreed || !email) return; // Validasi email wajib diisi

    // LOGIC UPDATE: Mengirim object product yang digabung dengan email pembeli
    // Parent component (onSubmit) nanti tinggal ambil: data.buyerEmail
    onSubmit({ ...product, buyerEmail: email });
  };

  return (
    <>
      <div className="fixed inset-0 z-51 flex items-end md:items-center justify-center bg-[#3E362E]/60 backdrop-blur-sm p-0 md:p-4 animate-fadeIn">
        <div className="bg-[#FDFCF8] w-full md:max-w-4xl rounded-t-[32px] md:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh] md:max-h-[640px] relative border-t-4 md:border-4 border-[#3E362E]">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-30 bg-white/90 backdrop-blur-md border-2 border-[#3E362E] p-2 rounded-full hover:bg-red-50 transition-all shadow-[2px_2px_0px_0px_rgba(62,54,46,1)] active:translate-y-[2px] active:shadow-none">
            <X size={18} color="#3E362E" strokeWidth={3} />
          </button>

          {/* KOLOM KIRI (FOTO - TIDAK DIUBAH) */}
          <div
            className="w-full md:w-1/2 bg-[#EAE7DF] relative overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}>
            <div
              className="relative w-full h-full aspect-4/5 md:aspect-auto md:h-full overflow-hidden bg-white group cursor-zoom-in"
              onClick={() => setIsZoomOpen(true)}>
              <img
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                src={currentImage?.url}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-110"
                onError={(e) => (e.target.src = "https://placehold.co/600x600?text=No+Image")}
              />

              {currentImage?.label && (
                <div className="absolute top-4 left-4 z-20">
                  <div className="px-3 py-1.5 bg-white/90 backdrop-blur border border-[#3E362E]/10 rounded-full shadow-sm">
                    <p className="text-[10px] font-bold text-[#3E362E] uppercase tracking-wider">
                      {currentImage.label}
                    </p>
                  </div>
                </div>
              )}

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

            {images.length > 1 && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
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

          {/* KOLOM KANAN (FORM) */}
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto bg-[#FDFCF8]">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#3E362E]/5 rounded-lg mb-4 border border-[#3E362E]/10">
                <ImageIcon size={12} className="text-[#3E362E]" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#3E362E]">Karya Digital</span>
              </div>

              <h2 className="text-3xl font-black text-[#3E362E] mb-4 leading-[1.1] uppercase italic tracking-tight">
                {product.name}
              </h2>

              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3E362E]/10 rounded-full" />
                <p className="pl-5 text-sm md:text-base text-[#6B5E51] leading-relaxed italic font-medium whitespace-pre-line">
                  "{product.description || "Koleksi aset digital eksklusif untuk kebutuhan kreatifmu."}"
                </p>
              </div>
            </div>

            {/* FORM AREA */}
            <form onSubmit={handleSubmit} className="space-y-4 flex-grow flex flex-col justify-end">
              {/* --- INPUT EMAIL BARU --- */}
              <div className="bg-white p-1 rounded-xl border-2 border-[#E5E0D8] focus-within:border-[#3E362E] transition-colors relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3E362E]/40 group-focus-within:text-[#3E362E]">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Masukkan Email Gmail (Wajib)"
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-[#3E362E] font-medium outline-none placeholder:text-[#3E362E]/30 text-sm md:text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <p className="text-[10px] text-[#6B5E51]/80 px-1 -mt-2 mb-2 italic">
                *Email digunakan untuk memberi akses file di Google Drive.
              </p>

              {/* INSTRUKSI LANGKAH SELANJUTNYA */}
              <div className="bg-[#F3F0E9] p-4 rounded-xl border border-[#E5E0D8] space-y-2">
                <div className="flex items-center gap-2">
                  <div className="bg-[#3E362E] text-white p-1 rounded-full">
                    <MessageCircle size={12} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#3E362E]">Info Pengiriman</p>
                </div>

                <ul className="space-y-1 text-xs text-[#6B5E51] font-medium leading-relaxed list-disc pl-4">
                  <li>
                    Lanjutkan ke <strong>WhatsApp</strong> untuk pembayaran.
                  </li>
                  <li>Link Google Drive akan dikirim/diaktifkan ke email di atas setelah bukti transfer diterima.</li>
                </ul>
              </div>

              <div className="pt-2">
                <div
                  className="flex items-start gap-3 group cursor-pointer select-none"
                  onClick={() => setIsAgreed(!isAgreed)}>
                  <div
                    className={`w-5 h-5 mt-0.5 shrink-0 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                      isAgreed
                        ? "bg-[#3E362E] border-[#3E362E]"
                        : "bg-white border-[#E5E0D8] group-hover:border-[#8DA399]"
                    }`}>
                    {isAgreed && <Check size={14} className="text-[#FDFCF8]" strokeWidth={4} />}
                  </div>

                  <p className="text-xs text-[#6B5E51] font-medium leading-snug">
                    Saya menyetujui{" "}
                    <Link to="/terms" className="underline decoration-dotted hover:text-[#3E362E] transition-colors">
                      Syarat & Ketentuan
                    </Link>{" "}
                    serta{" "}
                    <Link to="/privacy" className="underline decoration-dotted hover:text-[#3E362E] transition-colors">
                      Kebijakan Privasi
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t-2 border-dashed border-[#E5E0D8]">
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
                    disabled={!isAgreed || !email}
                    className={
                      isAgreed && email
                        ? "w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black py-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(32,189,90,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all flex justify-center items-center gap-3 uppercase tracking-widest text-sm group border-2 border-[#25D366]"
                        : "w-full bg-[#E5E0D8] text-[#3E362E]/40 font-black py-4 rounded-xl flex justify-center items-center gap-3 uppercase tracking-widest text-sm border-2 border-[#E5E0D8] cursor-not-allowed"
                    }>
                    <MessageCircle
                      size={20}
                      className={isAgreed && email ? "group-hover:-rotate-12 transition-transform" : ""}
                      fill="white"
                    />
                    Bungkus via WhatsApp
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* --- LIGHTBOX ZOOM FULLSCREEN (TIDAK DIUBAH) --- */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-[100] bg-[#3E362E]/95 flex items-center justify-center animate-fadeIn"
          onClick={() => setIsZoomOpen(false)}>
          <button className="absolute top-6 right-6 text-white bg-white/10 p-3 rounded-full border border-white/20 hover:bg-white/20 transition-all z-[110]">
            <X size={32} />
          </button>

          {currentImage?.label && (
            <div className="absolute top-6 left-6 z-[110]">
              <div className="bg-black/60 backdrop-blur px-5 py-2.5 rounded-full border border-white/20">
                <p className="text-white text-sm font-bold tracking-wider uppercase">{currentImage.label}</p>
              </div>
            </div>
          )}

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
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              src={currentImage?.url}
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
