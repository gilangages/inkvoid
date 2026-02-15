// frontend/src/components/LandingPage/LoadingScreen.jsx
import React from "react";
import lumaLogo from "../../assets/luma-sticker.png"; // Pastikan path ini sesuai dengan logo kamu

export const LoadingScreen = ({ isLoading, isError, onContinue, onRetry }) => {
  if (!isLoading && !isError) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fdfcf8] px-6 text-center font-sans text-[#3E362E]">
      {/* BACKGROUND PATTERN (Sama dengan CSS global) */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#e5e0d8 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}></div>

      <div className="relative z-10 max-w-md">
        {isLoading ? (
          // --- TAMPILAN LOADING ---
          <div className="flex flex-col items-center animate-fade-in">
            {/* Logo Bouncing */}
            <div className="animate-bounce mb-6">
              <img src={lumaLogo} alt="Loading..." className="w-24 h-24 object-contain" />
            </div>
            <h2 className="text-2xl font-bold text-[#8da399] mb-2">Sedang Menyiapkan Toko...</h2>
            <p className="text-sm text-gray-500 animate-pulse">
              Membangunkan server... Mohon tunggu sebentar, proses ini bergantung pada kecepatan server gratis kami.
            </p>
          </div>
        ) : (
          // --- TAMPILAN ERROR / LIMIT ---
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border-2 border-[#d68c76] shadow-lg animate-slide-up">
            <div className="w-16 h-16 bg-[#d68c76]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🍃</span>
            </div>

            <h2 className="text-xl font-bold text-[#d68c76] mb-4">Server Sedang Istirahat</h2>

            <div className="text-left text-sm text-[#3E362E] space-y-3 mb-6 leading-relaxed">
              <p>
                <strong>Halo, Teman Luma!</strong> Mohon maaf atas ketidaknyamanan ini.
              </p>
              <p>
                Website ini dikelola menggunakan layanan hosting backend versi gratis. Jika pesan ini muncul,
                kemungkinan:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Batas penggunaan data bulanan telah tercapai.</li>
                <li>Server sedang sibuk atau mengalami kendala koneksi.</li>
              </ul>
              <p className="italic text-xs text-gray-400 mt-2 border-t pt-2">
                *Data koleksi stiker akan kembali normal secara otomatis pada periode reset bulan depan.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={onRetry}
                className="w-full py-2.5 px-4 rounded-xl bg-[#8da399] text-white font-bold hover:bg-[#7a9186] transition-all transform hover:-translate-y-0.5 shadow-md">
                Coba Muat Ulang 🔄
              </button>

              <button
                onClick={onContinue}
                className="w-full py-2.5 px-4 rounded-xl border-2 border-[#8da399] text-[#8da399] font-bold hover:bg-[#8da399]/10 transition-colors">
                Tetap Lanjut ke Website ➔
              </button>
              <p className="text-[10px] text-gray-400 text-center mt-1">
                (Koleksi stiker mungkin tidak akan tampil di dalam)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
