import {
  X,
  Lock,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Coffee,
} from "lucide-react";
import { useState, useRef, useEffect, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from "react";
import { Link } from "react-router";
import ReactMarkdown from "react-markdown";
import type { components } from "../../types/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: components["schemas"]["Product"] | null;
  onSubmit?: (product: components["schemas"]["Product"]) => Promise<void>;
}

export const CheckoutModal = ({ isOpen, onClose, product, onSubmit: _onSubmit }: Props) => {
  // --- STATE (Logic Tetap) ---
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // --- NORMALISASI DATA IMAGES (Logic Tetap) ---
  const getNormalizedImages = () => {
    if (!product) return [];
    let rawImages: any[] = [];
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

  const nextImage = (e?: ReactMouseEvent | KeyboardEvent) => {
    if (e && 'stopPropagation' in e) e.stopPropagation();
    if (images.length > 0) {
      setCurrentImgIdx((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e?: ReactMouseEvent | KeyboardEvent) => {
    if (e && 'stopPropagation' in e) e.stopPropagation();
    if (images.length > 0) {
      setCurrentImgIdx((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // --- BROWSER HISTORY LOGIC (Logic Tetap) ---
  useEffect(() => {
    if (isOpen) {
      window.history.pushState({ modalOpen: true }, "", window.location.href);
      const handlePopState = (_event: PopStateEvent) => {
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
  }, [isOpen, onClose]);

  // --- KEYBOARD NAV (Logic Tetap) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isZoomOpen) return;
      if (e.key === "ArrowRight") nextImage(e);
      if (e.key === "ArrowLeft") prevImage(e);
      if (e.key === "Escape") setIsZoomOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomOpen, currentImgIdx, images.length]);

  if (!isOpen || !product) return null;

  // --- TOUCH HANDLERS (Logic Tetap) ---
  const handleTouchStart = (e: ReactTouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e: ReactTouchEvent) => {
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

  // --- SUBMIT LOGIC ---
  // Dihapus karena fokus pembelian hanya melalui Trakteer

  const markdownComponents = {
    strong: ({ node, ...props }: any) => <span className="font-bold text-[#E0D7D7]" {...props} />,
    ul: ({ node, ...props }: any) => <ul className="list-disc pl-4 space-y-1 my-3 text-[13px]" {...props} />,
    li: ({ node, ...props }: any) => <li className="pl-1" {...props} />,
    p: ({ node, ...props }: any) => <p className="mb-3 font-light leading-relaxed" {...props} />,
  };

  return (
    <>
      {/* Backdrop: Dark Void Style */}
      <div className="fixed inset-0 z-51 flex items-end md:items-center justify-center bg-[#121214]/90 backdrop-blur-md p-0 md:p-4 animate-fadeIn">
        {/* Container Modal Utama: Sharp Corners & Dark Theme */}
        <div className="bg-[#121214] w-full md:max-w-4xl rounded-none md:rounded-none shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-[640px] relative border border-[#8287ac]/20">
          {/* Close Button: Minimalist Sharp */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-40 bg-[#121214] border border-[#8287ac]/30 p-2 text-[#8287ac] hover:bg-[#8287ac] hover:text-[#121214] transition-all">
            <X size={20} strokeWidth={2} />
          </button>

          {/* KOLOM KIRI (FOTO) */}
          <div
            className="w-full md:w-1/2 h-[35vh] md:h-full shrink-0 bg-[#1F1F23] relative overflow-hidden border-b md:border-b-0 md:border-r border-[#8287ac]/10"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}>
            <div
              className="relative w-full h-full overflow-hidden group cursor-zoom-in"
              onClick={() => setIsZoomOpen(true)}>
              <img
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                src={currentImage?.url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                onError={(e) => ((e.target as HTMLImageElement).src = "https://placehold.co/600x600?text=Fragment+Not+Found")}
              />

              {currentImage?.label && (
                <div className="absolute top-4 left-4 z-20">
                  <div className="px-2 py-1 bg-[#121214]/80 backdrop-blur border border-[#8287ac]/20">
                    <p className="text-[9px] font-mono font-bold text-[#E0D7D7] uppercase tracking-widest">
                      {currentImage.label}
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons: Preserved logic & visibility */}
              {images.length > 1 && (
                <div className="hidden md:block">
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E0D7D7] bg-[#121214]/50 p-2 hover:bg-[#8287ac]/20 transition-all z-10 border border-[#8287ac]/20">
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#E0D7D7] bg-[#121214]/50 p-2 hover:bg-[#8287ac]/20 transition-all z-10 border border-[#8287ac]/20">
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Dots Nav */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
                <div className="flex gap-1.5 px-3 py-1.5 bg-[#121214]/40 backdrop-blur-md">
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-0.5 transition-all duration-300 ${
                        currentImgIdx === idx ? "w-4 bg-[#8287ac]" : "w-2 bg-[#8287ac]/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* KOLOM KANAN (FORM & KONTEN) */}
          <div className="w-full md:w-1/2 flex flex-col flex-1 md:h-full min-h-0 bg-[#121214] overflow-hidden">
            <div className="flex flex-col h-full min-h-0">
              {/* AREA 1: SCROLLABLE CONTENT */}
              <div className="flex-grow overflow-y-auto p-6 md:p-10 custom-scrollbar">
                <div className="mb-10">
                  <div className="inline-flex items-center gap-2 px-2 py-0.5 border border-[#8287ac]/20 mb-6 bg-[#1F1F23]">
                    <ImageIcon size={12} className="text-[#8287ac]" />
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#8287ac]">Arsip_Karya</span>
                  </div>

                  <h2 className="text-3xl font-black text-[#E0D7D7] mb-6 leading-tight uppercase tracking-tighter">
                    {product.name}
                  </h2>

                  <div className="relative border-l border-[#8287ac]/20 pl-6">
                    <div className="text-[13px] md:text-sm text-[#B8B3B6] leading-relaxed italic opacity-80">
                      <ReactMarkdown components={markdownComponents}>
                        {product.description || "Goresan tanpa rencana. Hanya fragmen visual untuk ruang sunyimu."}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>

                {/* INFORMASI PEMBELIAN */}
                <div className="space-y-6">
                  <div className="bg-[#1F1F23] p-5 border border-[#8287ac]/10 space-y-3">
                    <div className="flex items-center gap-2">
                      <Lock size={12} className="text-[#8287ac]/50" />
                      <p className="text-[9px] font-mono uppercase tracking-widest text-[#8287ac]/70">Akses_Konten</p>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-[#B8B3B6] font-light leading-relaxed list-disc pl-4 opacity-80">
                      <li>
                        Pembelian dilakukan via <strong>Trakteer</strong>.
                      </li>
                      <li>Tautan unduhan (Google Drive) tersedia langsung setelah transaksi berhasil di platform Trakteer.</li>
                      <li>Pastikan Anda menyimpan file setelah mengunduhnya.</li>
                    </ul>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col">
                        <p className="text-[11px] font-light leading-snug text-[#B8B3B6]">
                          Dengan membeli, Anda menyetujui{" "}
                          <Link to="/terms" className="text-[#E0D7D7] underline hover:text-[#8287ac] transition-colors">
                            Syarat & Ketentuan
                          </Link>{" "}
                          serta{" "}
                          <Link
                            to="/privacy"
                            className="text-[#E0D7D7] underline hover:text-[#8287ac] transition-colors">
                            Kebijakan Privasi
                          </Link>
                          .
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AREA 2: FIXED FOOTER */}
              <div className="p-6 md:px-10 md:pb-10 border-t border-[#8287ac]/10 bg-[#121214] z-10 shrink-0">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#B8B3B6]/50">
                      Total_Bayar
                    </span>
                    <span className="text-3xl font-black text-[#E0D7D7] tracking-tighter">
                      Rp {(product.price ?? 0).toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="w-full">
                    {/* TOMBOL TRAKTEER */}
                    <a
                      href={product.trakteer_link || "https://trakteer.id/inkvoid/shop/lumas-daily-life-vol-1-buwG2"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full border border-[#be1e2d]/40 text-[#E0D7D7] font-bold py-3.5 hover:bg-[#be1e2d]/10 transition-all flex justify-center items-center gap-2 uppercase tracking-[0.1em] text-[10px] md:text-[11px] group px-2">
                      <Coffee
                        size={16}
                        className="text-[#be1e2d] group-hover:scale-110 transition-transform shrink-0"
                      />
                      <span>Beli via Trakteer</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- LIGHTBOX ZOOM (Logic Nav Tetap Dipertahankan) --- */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-[100] bg-[#121214]/98 flex items-center justify-center animate-fadeIn cursor-zoom-out"
          onClick={() => setIsZoomOpen(false)}>
          <button className="absolute top-6 right-6 text-[#E0D7D7] p-2 hover:text-[#8287ac] transition-all z-[110]">
            <X size={32} strokeWidth={1} />
          </button>

          {currentImage?.label && (
            <div className="absolute top-6 left-6 z-[110]">
              <div className="bg-[#1F1F23] px-4 py-2 border border-[#8287ac]/20">
                <p className="text-[#E0D7D7] text-[10px] font-mono tracking-widest uppercase">{currentImage.label}</p>
              </div>
            </div>
          )}

          {/* Nav Buttons in Zoom View: Logic & Visibility Preserved */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 text-[#E0D7D7] bg-white/5 p-4 border border-[#8287ac]/10 hover:bg-[#8287ac]/20 transition-all z-[110] group">
                <ChevronLeft size={32} className="group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={nextImage}
                className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 text-[#E0D7D7] bg-white/5 p-4 border border-[#8287ac]/10 hover:bg-[#8287ac]/20 transition-all z-[110] group">
                <ChevronRight size={32} className="group-hover:scale-110 transition-transform" />
              </button>
            </>
          )}

          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              src={currentImage?.url}
              className="max-w-full max-h-full object-contain animate-popIn"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          </div>

          <div className="absolute bottom-10">
            <div className="text-[#B8B3B6] font-mono text-[10px] tracking-widest bg-[#1F1F23] px-4 py-1.5 border border-[#8287ac]/10 uppercase">
              Fragmen {currentImgIdx + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
