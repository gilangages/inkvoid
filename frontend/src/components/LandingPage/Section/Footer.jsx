// frontend/src/components/LandingPage/Section/Footer.jsx

import logoLuma from "../../../assets/luma-sticker.png";
import { Link } from "react-router";
import { Mail } from "lucide-react"; // 1. Import icon Mail dari lucide-react

export const Footer = () => {
  return (
    <footer className="bg-[#EAE7DF] border-t-2 border-[#E5E0D8] py-12 mt-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center md:items-start gap-8 text-center md:text-left">
        {/* BAGIAN KIRI */}
        <div className="flex flex-col items-center md:items-start gap-3 w-full md:w-auto">
          <img
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            src={logoLuma}
            alt="LumaSticker Giant Logo"
            className="h-32 w-auto object-contain hover:scale-110 transition-all duration-500"
          />
          <div>
            <h3 className="font-black text-2xl text-[#3E362E]">
              Luma<span className="text-[#8DA399]">Sticker</span>.
            </h3>
            <p className="text-[#6B5E51] text-sm mt-1 max-w-xs leading-relaxed mx-auto md:mx-0">
              Stiker lucu-lucuan buat jurnal digital kamu.
            </p>

            {/* UPDATE: BAGIAN CONTACT US */}
            <div className="mt-5 flex flex-col gap-2 items-center md:items-start">
              {/* Label diganti jadi Contact Us */}
              <span className="text-[#3E362E] font-black text-sm uppercase tracking-wide">Contact Us</span>

              <a
                href="mailto:stickerluma@gmail.com"
                className="group flex items-center gap-2 text-[#6B5E51] text-sm font-medium hover:text-[#8DA399] transition-colors p-2 rounded-lg hover:bg-[#FDFCF8]/50 border border-transparent hover:border-[#E5E0D8]">
                {/* Icon Mail menggantikan Emoji */}
                <div className="bg-[#3E362E] text-[#FDFCF8] p-1.5 rounded-md group-hover:bg-[#8DA399] transition-colors">
                  <Mail size={16} strokeWidth={2.5} />
                </div>
                <span>stickerluma@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* BAGIAN KANAN */}
        <div className="flex flex-col items-center md:items-end gap-4 w-full md:w-auto">
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-sm font-bold text-[#6B5E51]">
            <Link to="/terms" className="hover:text-[#3E362E] transition">
              Syarat & Ketentuan
            </Link>
            <Link to="/privacy" className="hover:text-[#3E362E] transition">
              Kebijakan Privasi
            </Link>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="text-[#6B5E51] text-xs font-medium">
              &copy; {new Date().getFullYear()} LumaSticker. All rights reserved.
            </div>
            <span className="text-[#8DA399] text-xs bg-[#FDFCF8] px-3 py-1 rounded-full shadow-sm border border-[#E5E0D8]">
              Dibuat dengan ☕ & 🎨
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
