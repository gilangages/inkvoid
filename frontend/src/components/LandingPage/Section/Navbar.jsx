import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Efek Kaca saat di-scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Koleksi", href: "#products" },
    { name: "Tentang", href: "#about" },
    { name: "Testimoni", href: "#reviews" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-[#F0F7F4]/80 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      }`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="bg-emerald-600 text-white p-2 rounded-xl rotate-3 hover:rotate-6 transition duration-300">
            <ShoppingBag size={20} />
          </div>
          <span className="font-extrabold text-2xl text-teal-900 tracking-tight">
            Luma<span className="text-emerald-600">Store</span>.
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-teal-800 font-bold hover:text-emerald-600 transition relative group">
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-emerald-400 rounded-full transition-all group-hover:w-full"></span>
            </a>
          ))}
          <button className="bg-teal-800 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-teal-900/20 hover:bg-teal-900 hover:-translate-y-0.5 transition-all">
            Masuk
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-teal-900 p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-4 flex flex-col gap-4 shadow-xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-teal-800 font-bold py-2 px-4 hover:bg-emerald-50 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}>
              {link.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};
