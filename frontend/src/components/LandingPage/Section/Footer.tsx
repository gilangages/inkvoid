// frontend/src/components/LandingPage/Section/Footer.jsx

import { Link, useNavigate, useLocation } from "react-router";
import { Mail, ArrowRight } from "lucide-react";

export const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation logic uses router state to scroll after LoadingScreen completes on HomePage
  const handleNavigation = (id: string) => {
    if (location.pathname === "/") {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { state: { targetId: id } });
    }
  };

  return (
    <footer className="bg-[#121214] border-t border-[#1F1F23] pt-16 pb-8 mt-20 relative overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 relative z-10">
        {/* KOLOM 1: BRAND IDENTITY (InkVoid Style) */}
        <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
          <div>
            <h3 className="font-black text-3xl text-[#E0D7D7] tracking-tighter">
              Ink<span className="text-[#8287ac]">Void</span>.
            </h3>
          </div>
        </div>

        {/* KOLOM 2: NAVIGASI / MENU (Diksi lebih netral) */}
        <div className="md:col-span-3 flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="font-bold text-[#E0D7D7] text-sm mb-6 uppercase tracking-[0.2em] opacity-50">Navigasi</h4>
          <ul className="space-y-4 text-[#B8B3B6] text-sm font-medium">
            <li>
              <button
                onClick={() => handleNavigation("products")}
                className="hover:text-[#8287ac] transition-colors flex items-center gap-2 group">
                <ArrowRight
                  size={14}
                  className="opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all"
                />
                Arsip Karya
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation("creator")}
                className="hover:text-[#8287ac] transition-colors flex items-center gap-2 group">
                <ArrowRight
                  size={14}
                  className="opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all"
                />
                Cerita
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation("faq")}
                className="hover:text-[#8287ac] transition-colors flex items-center gap-2 group">
                <ArrowRight
                  size={14}
                  className="opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all"
                />
                Tanya Jawab
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation("howto")}
                className="hover:text-[#8287ac] transition-colors flex items-center gap-2 group">
                <ArrowRight
                  size={14}
                  className="opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all"
                />
                Proses
              </button>
            </li>
          </ul>
        </div>

        {/* KOLOM 3: LEGAL & CONTACT */}
        <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="font-bold text-[#E0D7D7] text-sm mb-6 uppercase tracking-[0.2em] opacity-50">Kontak</h4>

          <div className="mb-8 w-full flex flex-col items-center md:items-start">
            <a
              href="mailto:stickerluma@gmail.com"
              className="flex items-center gap-3 text-[#B8B3B6] text-sm font-light hover:text-[#E0D7D7] transition-colors bg-[#1F1F23] px-5 py-3 border border-[#8287ac]/10 w-full md:w-auto justify-center md:justify-start italic">
              <Mail size={16} className="text-[#8287ac]" />
              stickerluma@gmail.com
            </a>
          </div>

          <div className="flex flex-col gap-3 text-[11px] font-mono uppercase tracking-widest text-[#B8B3B6]/40">
            <Link to="/terms" className="hover:text-[#8287ac] transition">
              Syarat & Ketentuan
            </Link>
            <Link to="/privacy" className="hover:text-[#8287ac] transition">
              Kebijakan Privasi
            </Link>
          </div>
        </div>
      </div>

      {/* COPYRIGHT BAR */}
      <div className="max-w-6xl mx-auto px-6 mt-16 pt-8 border-t border-[#1F1F23] flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-[#B8B3B6]/30 uppercase tracking-[0.2em]">
        <p>&copy; {new Date().getFullYear()} InkVoid. Segala hak dilindungi.</p>
        <p className="mt-2 md:mt-0 italic">Dibuat dalam sunyi.</p>
      </div>
    </footer>
  );
};
