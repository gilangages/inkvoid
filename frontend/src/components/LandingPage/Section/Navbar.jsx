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

  const handleNavigation = (id) => {
    setIsMobileMenuOpen(false);

    if (location.pathname === "/") {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
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
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-[#FDFCF8]/90 backdrop-blur-md shadow-sm py-3 border-b border-[#E5E0D8]" : "bg-transparent py-6"
      }`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center cursor-pointer group" onClick={handleLogoClick}>
          <img
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            src="./luma-sticker.png"
            alt=""
            className="h-12 w-auto"
          />
          <span className="font-black text-2xl text-[#3E362E] tracking-tight">
            Luma<span className="text-[#8DA399]">Sticker</span>.
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => handleNavigation("products")}
            className="text-[#6B5E51] font-bold hover:text-[#3E362E] transition">
            Koleksi
          </button>
          <button
            onClick={() => handleNavigation("howto")}
            className="text-[#6B5E51] font-bold hover:text-[#3E362E] transition">
            Cara Order
          </button>

          {/* MENU BARU: KREATOR */}
          <button
            onClick={() => handleNavigation("creator")}
            className="text-[#6B5E51] font-bold hover:text-[#3E362E] transition">
            Kreator
          </button>

          <button
            onClick={() => handleNavigation("benefits")}
            className="text-[#6B5E51] font-bold hover:text-[#3E362E] transition">
            Keunggulan
          </button>

          <button
            onClick={() => handleNavigation("faq")}
            className="text-[#6B5E51] font-bold hover:text-[#3E362E] transition">
            Tanya Dulu
          </button>
          <button
            onClick={() => handleNavigation("products")}
            className="bg-[#3E362E] text-[#FDFCF8] px-6 py-2 rounded-lg font-bold hover:bg-[#8DA399] hover:-translate-y-0.5 transition-all shadow-[3px_3px_0px_0px_rgba(141,163,153,1)]">
            Beli Stiker
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-[#3E362E] p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#FDFCF8] border-b border-[#E5E0D8] p-6 flex flex-col gap-4 shadow-xl">
          <button
            onClick={() => handleNavigation("products")}
            className="text-left text-[#3E362E] font-bold py-2 border-b border-dashed border-[#E5E0D8]">
            Koleksi
          </button>
          <button
            onClick={() => handleNavigation("howto")}
            className="text-left text-[#3E362E] font-bold py-2 border-b border-dashed border-[#E5E0D8]">
            Cara Order
          </button>

          {/* MENU BARU MOBILE */}
          <button
            onClick={() => handleNavigation("creator")}
            className="text-left text-[#3E362E] font-bold py-2 border-b border-dashed border-[#E5E0D8]">
            Kreator
          </button>

          <button
            onClick={() => handleNavigation("benefits")}
            className="text-left text-[#3E362E] font-bold py-2 border-b border-dashed border-[#E5E0D8]">
            Keunggulan
          </button>
          <button
            onClick={() => handleNavigation("faq")}
            className="text-left text-[#3E362E] font-bold py-2 border-b border-dashed border-[#E5E0D8]">
            Tanya Dulu
          </button>
        </div>
      )}
    </nav>
  );
};
