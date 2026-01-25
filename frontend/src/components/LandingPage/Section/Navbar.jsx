import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react"; // Ikon Gunting biar 'artsy'

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-[#FDFCF8]/90 backdrop-blur-md shadow-sm py-3 border-b border-[#E5E0D8]" : "bg-transparent py-6"
      }`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* LOGO BARU: Crafty Style */}
        <div
          className="flex items-center  cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <img
            onContextMenu={(e) => e.preventDefault()} // Mencegah klik kanan
            onDragStart={(e) => e.preventDefault()}
            src="./luma-sticker.png"
            alt=""
            className="h-12  w-auto"
          />
          <span className="font-black text-2xl text-[#3E362E] tracking-tight ">
            Luma<span className="text-[#8DA399]">Sticker</span>.
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("products")}
            className="text-[#6B5E51] font-bold hover:text-[#3E362E] transition">
            Koleksi
          </button>
          <button
            onClick={() => scrollToSection("benefits")}
            className="text-[#6B5E51] font-bold hover:text-[#3E362E] transition">
            Kenapa Beli?
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="text-[#6B5E51] font-bold hover:text-[#3E362E] transition">
            Tanya Dulu
          </button>

          <button
            onClick={() => scrollToSection("products")}
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
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#FDFCF8] border-b border-[#E5E0D8] p-6 flex flex-col gap-4 shadow-xl">
          {/* SAMAKAN DENGAN DESKTOP */}
          <button
            onClick={() => scrollToSection("products")}
            className="text-left text-[#3E362E] font-bold py-2 border-b border-dashed border-[#E5E0D8]">
            Koleksi
          </button>
          <button
            onClick={() => scrollToSection("benefits")}
            className="text-left text-[#3E362E] font-bold py-2 border-b border-dashed border-[#E5E0D8]">
            Kenapa Beli?
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="text-left text-[#3E362E] font-bold py-2 border-b border-dashed border-[#E5E0D8]">
            Tanya Dulu
          </button>
        </div>
      )}
    </nav>
  );
};
