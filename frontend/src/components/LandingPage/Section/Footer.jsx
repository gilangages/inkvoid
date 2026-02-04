import logoLuma from "../../../assets/luma-sticker.png";
import { Link } from "react-router";
import { Mail, ArrowRight } from "lucide-react";

export const Footer = () => {
  // Fungsi simple untuk scroll ke section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#EAE7DF] border-t-2 border-[#E5E0D8] pt-16 pb-8 mt-20 relative overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
        {/* KOLOM 1: BRAND IDENTITY (Lebar 5 kolom) */}
        <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
          <img
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            src={logoLuma}
            alt="LumaSticker Logo"
            className="h-32 md:h-24 w-auto object-contain mb-2 hover:transform hover:scale-110 transition-transform"
          />
          <div>
            <h3 className="font-black text-2xl text-[#3E362E]">
              Luma<span className="text-[#8DA399]">Sticker</span>.
            </h3>
            <p className="text-[#6B5E51] text-sm mt-3 leading-relaxed max-w-sm">
              Menyediakan stiker digital berkualitas tinggi (High-Res) yang siap cetak untuk kebutuhan jurnal, dekorasi,
              dan koleksi pribadimu.
            </p>
          </div>
        </div>

        {/* KOLOM 2: NAVIGASI / MENU (Lebar 3 kolom) */}
        <div className="md:col-span-3 flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="font-black text-[#3E362E] text-lg mb-6 uppercase tracking-wider">Menu</h4>
          <ul className="space-y-3 text-[#6B5E51] text-sm font-bold">
            <li>
              <button
                onClick={() => scrollToSection("products")}
                className="hover:text-[#8DA399] transition-colors flex items-center gap-2 group">
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                Katalog Stiker
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("creator")}
                className="hover:text-[#8DA399] transition-colors flex items-center gap-2 group">
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                Tentang Artist
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("faq")}
                className="hover:text-[#8DA399] transition-colors flex items-center gap-2 group">
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                Tanya Jawab (FAQ)
              </button>
            </li>
            <li>
              <Link to="/how-to-order" className="hover:text-[#8DA399] transition-colors flex items-center gap-2 group">
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                Cara Order
              </Link>
            </li>
          </ul>
        </div>

        {/* KOLOM 3: LEGAL & CONTACT (Lebar 4 kolom) */}
        <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="font-black text-[#3E362E] text-lg mb-6 uppercase tracking-wider">Bantuan</h4>

          <div className="space-y-3 mb-8 w-full flex flex-col items-center md:items-start">
            <a
              href="mailto:stickerluma@gmail.com"
              className="flex items-center gap-3 text-[#6B5E51] text-sm font-medium hover:text-[#3E362E] transition-colors bg-white px-4 py-2 rounded-lg border border-[#E5E0D8] shadow-sm w-full md:w-auto justify-center md:justify-start">
              <Mail size={16} />
              stickerluma@gmail.com
            </a>
          </div>

          <div className="flex flex-col gap-2 text-sm font-bold text-[#8C8478]">
            <Link to="/terms" className="hover:text-[#3E362E] transition hover:underline">
              Syarat & Ketentuan
            </Link>
            <Link to="/privacy" className="hover:text-[#3E362E] transition hover:underline">
              Kebijakan Privasi
            </Link>
          </div>
        </div>
      </div>

      {/* COPYRIGHT BAR */}
      <div className="max-w-6xl mx-auto px-6 mt-12 pt-8 border-t border-[#D6CEC3] flex flex-col md:flex-row justify-between items-center text-xs text-[#8C8478] font-medium">
        <p>&copy; {new Date().getFullYear()} LumaSticker. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Created with ♥️ in Indonesia.</p>
      </div>
    </footer>
  );
};
