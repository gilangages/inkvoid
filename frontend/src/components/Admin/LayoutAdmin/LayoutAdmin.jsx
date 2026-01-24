import { useState } from "react";
import { Outlet, Link, NavLink } from "react-router";
import {
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
  LogOut,
  Menu,
  X,
  FileText,
  Scissors,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

export default function LayoutAdmin() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);

  // Kita buat satu variabel untuk style dasar agar tidak ngetik berulang kali
  const baseStyle = "flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 mb-1";

  // Fungsi helper untuk class NavLink
  const navLinkClass = ({ isActive }) =>
    `${baseStyle} ${
      isActive
        ? "bg-[#8da399] text-[#fdfcf8] font-bold shadow-md" // Style saat Aktif
        : "text-[#fdfcf8] hover:bg-[#5a4e44] hover:pl-6" // Style saat Tidak Aktif (Gunakan warna krem/putih)
    }`;

  return (
    <div className="flex min-h-screen bg-[#fdfcf8] relative">
      {/* === MOBILE HEADER === */}
      <div className="md:hidden fixed top-0 w-full bg-[#3e362e] text-white p-4 z-50 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-[#8da399] p-1 rounded">
            <Scissors size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg">LumaAdmin</span>
        </div>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)}>
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* === OVERLAY MOBILE === */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* === SIDEBAR === */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[#3e362e] text-[#fdfcf8] p-6 z-50 transition-transform duration-300 ease-in-out border-r border-[#50463b]
        ${/* Logic Mobile */ isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        ${/* Logic Desktop */ isDesktopOpen ? "md:translate-x-0" : "md:-translate-x-full"}
        `}>
        {/* LOGO AREA */}
        <div className="mb-10 mt-12 md:mt-2 flex justify-between items-start">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="bg-[#fdfcf8] text-[#3e362e] p-2 rounded-lg rotate-[-6deg] group-hover:rotate-0 transition-transform duration-300 shadow-[2px_2px_0px_0px_rgba(214,140,118,1)]">
              <Scissors size={20} />
            </div>
            <span className="font-black text-xl text-[#fdfcf8] tracking-tight">
              Luma<span className="text-[#8DA399]">Sticker</span>.
            </span>
          </div>

          {/* Tombol Tutup Sidebar di Desktop (Posisi di dalam sidebar) */}
          <button
            onClick={() => setIsDesktopOpen(false)}
            className="hidden md:block text-gray-400 hover:text-white transition"
            title="Tutup Sidebar">
            <PanelLeftClose size={20} />
          </button>
        </div>

        {/* MENU */}
        <nav className="space-y-2">
          <p className="text-xs text-gray-500 uppercase font-bold mb-2 mt-4 px-4 tracking-widest">Menu Utama</p>

          <NavLink to="/admin/dashboard" className={navLinkClass} onClick={() => setIsMobileOpen(false)}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>

          <NavLink to="/admin/products" className={navLinkClass} onClick={() => setIsMobileOpen(false)}>
            <ShoppingBag size={20} /> Daftar Produk
          </NavLink>

          <NavLink to="/admin/upload" className={navLinkClass} onClick={() => setIsMobileOpen(false)}>
            <PlusCircle size={20} /> Upload Produk
          </NavLink>

          <p className="text-xs text-gray-500 uppercase font-bold mb-2 mt-6 px-4 tracking-widest">Transaksi</p>

          <NavLink to="/admin/orders" className={navLinkClass} onClick={() => setIsMobileOpen(false)}>
            <FileText size={20} /> Riwayat Pesanan
          </NavLink>

          <div className="mt-12 border-t border-gray-700 pt-4">
            <Link
              to="/admin/logout"
              className="flex items-center gap-3 py-3 px-4 text-[#d68c76] hover:bg-[#50463b] rounded-lg transition-all">
              <LogOut size={20} /> Logout
            </Link>
          </div>
        </nav>
      </aside>

      {/* === MAIN CONTENT === */}
      {/* Margin kiri berubah tergantung sidebar buka/tutup di desktop */}
      <main
        className={`flex-1 p-4 md:p-8 mt-16 md:mt-0 transition-all duration-300 ${isDesktopOpen ? "md:ml-64" : "md:ml-0"}`}>
        {/* Tombol Buka Sidebar (Hanya muncul jika sidebar tertutup di Desktop) */}
        {!isDesktopOpen && (
          <button
            onClick={() => setIsDesktopOpen(true)}
            className="hidden md:flex items-center gap-2 mb-4 text-[#3e362e] hover:text-[#8da399] transition font-bold">
            <PanelLeftOpen size={24} /> Buka Menu
          </button>
        )}

        <Outlet />

        {/* FOOTER SIMPLE (Opsional) */}
        <footer className="mt-12 pt-6 border-t border-[#e5e0d8] text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} LumaStore Admin Panel. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
