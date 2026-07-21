import { useState } from "react";
import { useNavigate } from "react-router";
import { useLocalStorage } from "react-use";
import { alertError } from "../../lib/alert";
import api from "../../lib/api/apiClient";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  // Simpan token (mock token)
  const [_, setToken] = useLocalStorage("token", "");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { data, error } = await api.POST("/admin/login", {
      body: { email, password },
    });

    if (error) {
      await alertError((error as any)?.message || "Gagal login");
    } else if (data) {
      setToken(data.token);
      await navigate({
        pathname: "/admin/dashboard",
      });
    }
  }

  return (
    // Tambahkan px-4 agar di HP tidak mepet pinggir layar
    <div className="min-h-screen flex items-center justify-center bg-[#fdfcf8] bg-[radial-gradient(#e5e0d8_1px,transparent_1px)] [background-size:20px_20px] px-4 sm:px-6">
      {/* w-full & max-w-md: Lebar penuh di HP, tapi dibatasi di desktop
         p-6 sm:p-8: Padding dalam lebih kecil di HP (6) dan standar di desktop (8)
      */}
      <div className="w-full max-w-md bg-white border-2 border-[#e5e0d8] rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-[8px_8px_0px_0px_rgba(141,163,153,0.5)] transition-all">
        {/* Responsive Text Size */}
        <h1 className="text-xl sm:text-2xl font-bold text-[#3e362e] mb-6 text-center">Luma Admin 🔐</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#3e362e] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // text-base: Mencegah auto-zoom di iOS saat input diklik
              className="w-full bg-[#fdfcf8] border-2 border-[#e5e0d8] rounded-lg p-3 text-sm sm:text-base focus:border-[#8da399] focus:outline-none transition-colors"
              placeholder="Masukkan email"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#3e362e] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#fdfcf8] border-2 border-[#e5e0d8] rounded-lg p-3 text-sm sm:text-base focus:border-[#8da399] focus:outline-none transition-colors"
              placeholder="Masukkan password"
            />
          </div>

          {/* active:scale-95 memberikan efek tekan yang enak di Mobile */}
          <button
            type="submit"
            className="w-full bg-[#3e362e] text-[#fdfcf8] font-bold py-3 rounded-lg hover:bg-[#8da399] active:scale-95 transition-all mt-4 text-sm sm:text-base">
            Masuk Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
