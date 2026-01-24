import { Outlet, Link, useNavigate } from "react-router";
import { useLocalStorage } from "react-use";

export default function LayoutAdmin() {
  const navigate = useNavigate();
  const [token, __setToken, removeToken] = useLocalStorage("admin_token");

  const handleLogout = () => {
    removeToken();
    navigate("/admin/login");
  };

  // Proteksi sederhana: Jika tidak ada token, redirect ke login
  // (Sebaiknya gunakan useEffect, tapi ini inline check cepat)
  if (!token && typeof window !== "undefined") {
    // navigate("/admin/login"); // Uncomment jika ingin proteksi ketat
  }

  return (
    <div className="flex min-h-screen bg-[#fdfcf8]">
      {/* Sidebar Sederhana */}
      <aside className="w-64 bg-[#3e362e] text-[#fdfcf8] p-6 hidden md:block fixed h-full">
        <h2 className="text-2xl font-bold mb-8">LumaAdmin</h2>
        <nav className="space-y-4">
          <Link to="/admin/dashboard" className="block py-2 px-4 bg-[#8da399] rounded hover:bg-[#7b9187] transition">
            Dashboard
          </Link>
          <div className="block py-2 px-4 hover:bg-[#50463b] rounded cursor-not-allowed opacity-50">Pesanan (Soon)</div>
          <button
            onClick={handleLogout}
            className="w-full text-left py-2 px-4 text-[#d68c76] hover:bg-[#50463b] rounded mt-8">
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4">
        <Outlet />
      </main>
    </div>
  );
}
