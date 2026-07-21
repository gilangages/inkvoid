// frontend/src/components/LandingPage/NotFound.jsx
import { Link } from "react-router";
import { Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#121214] flex flex-col items-center justify-center p-6 text-center font-sans">
      {/* Visual Void: Menggunakan Ghost atau icon yang lebih 'sunyi' */}
      <div className="border border-[#8287ac]/20 p-8 rounded-none mb-8 opacity-30">
        <Ghost size={64} className="text-[#8287ac]" strokeWidth={1} />
      </div>

      <h1 className="text-7xl md:text-8xl font-black text-[#E0D7D7] mb-4 tracking-tighter">404</h1>

      <div className="relative mb-12">
        {/* Garis pemisah khas InkVoid */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-12 h-px bg-[#8287ac]/30"></div>
        <p className="pt-6 text-[#B8B3B6] text-sm md:text-base font-light italic opacity-70">
          Tersesat di ruang hampa. Tidak ada apa pun di sini.
        </p>
      </div>

      <Link
        to="/"
        className="px-10 py-4 border border-[#8287ac]/40 text-[#E0D7D7] rounded-none font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-[#8287ac] hover:text-[#121214] transition-all duration-500">
        Kembali ke Awal
      </Link>

      {/* Dekorasi tipis di pojok bawah */}
      <div className="absolute bottom-10 text-[#B8B3B6]/20 font-mono text-[10px] tracking-widest uppercase">
        // Page_Not_Found
      </div>
    </div>
  );
}
