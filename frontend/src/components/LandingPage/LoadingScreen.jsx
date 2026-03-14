// frontend/src/components/LandingPage/LoadingScreen.jsx
import React, { useState, useEffect } from "react";
import { AlertCircle, RefreshCw, ArrowRight } from "lucide-react";

export const LoadingScreen = ({ isLoading, isError, fetchComplete, onComplete, onContinue, onRetry }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    let interval;

    if (!fetchComplete) {
      // Simulate loading progress from 0 to 90
      interval = setInterval(() => {
        setProgress((prev) => {
          // Slows down as it gets closer to 90
          const increment = prev < 50 ? Math.random() * 5 + 2 : prev < 80 ? Math.random() * 2 + 1 : Math.random() * 0.5;
          const next = prev + increment;
          return next > 92 ? 92 : next;
        });
      }, 500);
    } else {
      // Fetch is complete, smooth transition to 100%
      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + (100 - prev) * 0.15 + 1.5; // Smoothly approach 100

          if (next >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 300); // Give a little time for the user to see 100% before firing complete
            return 100;
          }
          return next;
        });
      }, 50); // fast 50ms interval to look smooth
    }

    return () => clearInterval(interval);
  }, [isLoading, fetchComplete, onComplete]);

  if (!isLoading && !isError) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#121214] px-6 text-center font-sans text-[#E0D7D7]">
      {/* BACKGROUND PATTERN: Dark Dot Grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#8287ac 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}></div>

      <div className="relative z-10 max-w-md w-full">
        {isLoading ? (
          // --- TAMPILAN LOADING ---
          <div className="flex flex-col items-center">
            {/* Dynamic Circular Progress */}
            <div className="relative mb-8 w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#1F1F23"
                  strokeWidth="4"
                  className="opacity-50"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#8287ac"
                  strokeWidth="4"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * progress) / 100}
                  className="transition-all duration-300 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#8287ac] font-mono font-bold text-xl tracking-tighter">
                  {Math.floor(progress)}<span className="text-sm">%</span>
                </span>
              </div>
            </div>

            <h2 className="text-xl font-bold tracking-widest uppercase mb-4 text-[#8287ac]">
              {progress === 100 ? "Menyiapkan Arsip..." : "Membangunkan Server..."}
            </h2>
            <p className="text-xs text-[#B8B3B6] font-mono leading-relaxed opacity-60">
              Menunggu respon dari server. Proses ini mungkin memakan waktu lebih lama akibat keterbatasan layanan gratis.
            </p>
          </div>
        ) : (
          // --- TAMPILAN ERROR / LIMIT ---
          <div className="bg-[#1F1F23]/50 border border-[#8287ac]/20 p-8 md:p-12 rounded-none shadow-2xl animate-fade-in">
            <div className="w-16 h-16 border border-[#8287ac]/20 rounded-none flex items-center justify-center mx-auto mb-8 bg-[#121214]">
              <AlertCircle size={32} className="text-[#8287ac]/60" />
            </div>

            <h2 className="text-xl font-black text-[#E0D7D7] mb-6 tracking-tighter uppercase">Koneksi Terputus</h2>

            <div className="text-left text-sm text-[#B8B3B6] space-y-4 mb-10 leading-relaxed font-light italic">
              <p>Layanan backend sedang tidak menanggapi. Hal ini biasanya terjadi karena:</p>
              <ul className="space-y-2 border-l border-[#8287ac]/20 pl-4 not-italic">
                <li className="text-xs opacity-80">// Batas penggunaan data bulanan tercapai.</li>
                <li className="text-xs opacity-80">// Masalah pada koneksi server.</li>
              </ul>

              {/* PENYUSUNAN ULANG DIKSI: Menggunakan "Arsip Karya" */}
              <div className="bg-[#8287ac]/5 border-l-2 border-[#8287ac] p-3 not-italic">
                <p className="text-[11px] text-[#8287ac] font-medium leading-tight tracking-tight">
                  Catatan: Jika dipaksakan lanjut, arsip karya tidak akan muncul di dalam halaman.
                </p>
              </div>

              <p className="text-[10px] opacity-40 not-italic border-t border-[#8287ac]/10 pt-4">
                *Data akan kembali normal saat periode reset layanan dimulai kembali.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={onRetry}
                className="w-full py-4 border border-[#8287ac]/30 text-[#E0D7D7] font-bold text-xs tracking-[0.2em] hover:bg-[#8287ac] hover:text-[#121214] transition-all flex items-center justify-center gap-2 uppercase">
                <RefreshCw size={14} /> Muat Ulang
              </button>

              <button
                onClick={onContinue}
                className="w-full py-4 text-[#B8B3B6] text-[10px] font-mono tracking-widest hover:text-[#E0D7D7] transition-colors flex items-center justify-center gap-2 uppercase opacity-60">
                Lanjut Tanpa Data <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
