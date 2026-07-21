// frontend/src/components/LandingPage/Section/Navbar.jsx

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (id: string) => {
    setIsMobileMenuOpen(false);

    if (location.pathname === "/") {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { state: { targetId: id } });
    }
  };

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
      window.scrollTo(0, 0);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        // Menggunakan warna Deep Void dari gambarmu (#121214) saat discroll
        isScrolled
          ? "bg-[#121214]/90 backdrop-blur-lg shadow-2xl py-3 border-b border-[#1F1F23]"
          : "bg-transparent py-6"
      }`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* LOGO: InkVoid */}
        <div className="flex items-center cursor-pointer group" onClick={handleLogoClick}>
          <span className="font-black text-2xl text-[#E0D7D7] tracking-tighter transition-all group-hover:tracking-normal">
            Ink<span className="text-[#8287ac]">Void</span>.
          </span>
        </div>

        {/* Desktop Menu: Wording yang lebih 'jujur' dan tidak memaksa */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => handleNavigation("products")}
            className="text-[#B8B3B6] text-sm font-medium hover:text-[#8287ac] transition-colors uppercase tracking-widest">
            Karya
          </button>
          <button
            onClick={() => handleNavigation("howto")}
            className="text-[#B8B3B6] text-sm font-medium hover:text-[#8287ac] transition-colors uppercase tracking-widest">
            Proses
          </button>
          <button
            onClick={() => handleNavigation("creator")}
            className="text-[#B8B3B6] text-sm font-medium hover:text-[#8287ac] transition-colors uppercase tracking-widest">
            Cerita
          </button>
          <button
            onClick={() => handleNavigation("faq")}
            className="text-[#B8B3B6] text-sm font-medium hover:text-[#8287ac] transition-colors uppercase tracking-widest">
            Tanya
          </button>

          {/* Tombol Ambil Karya: Menggunakan aksen biru pudar dari gambarmu */}
          <button
            onClick={() => handleNavigation("products")}
            className="border border-[#8287ac]/30 text-[#E0D7D7] px-6 py-2 rounded-sm text-sm font-bold hover:bg-[#8287ac] hover:text-[#121214] transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(130,135,172,0.2)] active:translate-y-1 active:shadow-none">
            Miliki
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-[#B8B3B6] p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu: Disesuaikan dengan tema gelap */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#121214] border-b border-[#1F1F23] p-8 flex flex-col gap-6 shadow-2xl animate-slide-up">
          <button
            onClick={() => handleNavigation("products")}
            className="text-left text-[#E0D7D7] text-xl font-light tracking-widest border-l-2 border-[#8287ac] pl-4">
            ARSIP KARYA
          </button>
          <button
            onClick={() => handleNavigation("howto")}
            className="text-left text-[#B8B3B6] text-xl font-light tracking-widest pl-4">
            PANDUAN
          </button>
          <button
            onClick={() => handleNavigation("creator")}
            className="text-left text-[#B8B3B6] text-xl font-light tracking-widest pl-4">
            CERITA
          </button>
          <button
            onClick={() => handleNavigation("faq")}
            className="text-left text-[#B8B3B6] text-xl font-light tracking-widest pl-4">
            TANYA
          </button>
          <button
            onClick={() => handleNavigation("products")}
            className="mt-4 bg-[#8287ac] text-[#121214] py-4 text-center font-black tracking-tighter">
            Miliki
          </button>
        </div>
      )}
    </nav>
  );
};
