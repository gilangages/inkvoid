import logoLuma from "../../../assets/luma-sticker.png"; // Import logo kamu

export const Footer = () => {
  return (
    <footer className="bg-[#EAE7DF] border-t-2 border-[#E5E0D8] py-12 mt-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
        {/* BAGIAN KIRI: Logo Besar & Deskripsi */}
        <div className="flex flex-col items-center md:items-start gap-3">
          {/* LOGO BESAR DISINI (Ukuran h-24 atau h-32 biar Puas!) */}
          <img
            onContextMenu={(e) => e.preventDefault()} // Mencegah klik kanan
            onDragStart={(e) => e.preventDefault()} // Mencegah gambar di-drag ke desktop
            src={logoLuma}
            alt="LumaSticker Giant Logo"
            className="h-32 w-auto object-contain  hover:scale-110 transition-all duration-500"
          />
          <div>
            <h3 className="font-black text-2xl text-[#3E362E]">LumaSticker.</h3>
            <p className="text-[#6B5E51] text-sm mt-1 max-w-xs leading-relaxed">Stiker lucu-lucuan buat jurnal kamu.</p>
          </div>
        </div>

        {/* BAGIAN KANAN: Copyright */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="text-[#6B5E51] text-xs font-medium">
            &copy; {new Date().getFullYear()} LumaSticker. All rights reserved.
          </div>
          <span className="text-[#8DA399] text-xs bg-[#FDFCF8] px-3 py-1 rounded-full shadow-sm border border-[#E5E0D8]">
            Dibuat dengan ☕ & 🎨
          </span>
        </div>
      </div>
    </footer>
  );
};
