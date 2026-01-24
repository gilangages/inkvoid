import { useState } from "react";
import { useNavigate } from "react-router";
import { useLocalStorage } from "react-use";
import { alertError } from "../../lib/api/alert";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  // Simpan token (mock token)
  const [__token, setToken] = useLocalStorage("admin_token", "");

  const handleLogin = (e) => {
    e.preventDefault();
    // LOGIKA LOGIN SEMENTARA (Hardcode) - Ganti dengan API call nanti
    if (email === "admin@luma.com" && password === "admin123") {
      setToken("mock-token-rahasia");
      navigate("/admin/dashboard");
    } else {
      alertError("Email atau password salah!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfcf8] bg-[radial-gradient(#e5e0d8_1px,transparent_1px)] [background-size:20px_20px]">
      <div className="w-full max-w-md bg-white border-2 border-[#e5e0d8] rounded-xl p-8 shadow-lg hover:shadow-[8px_8px_0px_0px_rgba(141,163,153,0.5)] transition-all">
        <h1 className="text-2xl font-bold text-[#3e362e] mb-6 text-center">Luma Admin 🔐</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#3e362e] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#fdfcf8] border-2 border-[#e5e0d8] rounded-lg p-3 focus:border-[#8da399] focus:outline-none transition-colors"
              placeholder="admin@luma.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#3e362e] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#fdfcf8] border-2 border-[#e5e0d8] rounded-lg p-3 focus:border-[#8da399] focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#3e362e] text-[#fdfcf8] font-bold py-3 rounded-lg hover:bg-[#8da399] transition-colors mt-4">
            Masuk Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
