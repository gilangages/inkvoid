import { useEffect, useState } from "react";
import { getAllProducts } from "../../../lib/api/ProductApi";
// TAMBAH IMPORT ICON 'Users' DI SINI
import { ShoppingBag, DollarSign, PlusCircle, Eye, Users } from "lucide-react";
import { Link } from "react-router";
import { visitStatsAdmin } from "../../../lib/api/VisitApi";
import { useLocalStorage } from "react-use";

export default function DashboardOverview() {
  const [stats, setStats] = useState({ total: 0, totalPrice: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Inisialisasi state agar tidak crash
  const [visitStats, setVisitStats] = useState({ total_views: 0, unique_visitors: 0 });

  const [token] = useLocalStorage("token", "");

  useEffect(() => {
    // 1. Fetch Produk
    getAllProducts().then(async (response) => {
      try {
        const res = await response.json();
        if (res.success) {
          const products = res.data;
          const total = products.length;
          const totalPrice = products.reduce((acc, curr) => acc + parseInt(curr.price || 0), 0);
          setStats({ total, totalPrice });
        }
      } catch (err) {
        console.error("Gagal parse produk", err);
      }
      setIsLoading(false);
    });

    // 2. Fetch Statistik Visit
    async function fetchVisits() {
      try {
        const response = await visitStatsAdmin(token);

        if (response.ok) {
          const responseBody = await response.json();
          // Simpan data ke state
          setVisitStats(responseBody.data || responseBody);
        } else {
          console.warn("Gagal ambil stats:", response.status);
        }
      } catch (error) {
        console.error("Error koneksi stats:", error);
      }
    }

    fetchVisits();
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto animate-slide-up px-4">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#3e362e]">Ringkasan Toko</h1>
          <p className="text-[#8c8478]">Pantau performa koleksi stiker LumaStore Anda.</p>
        </div>
        <Link
          to="/admin/upload"
          className="flex items-center gap-2 bg-[#8da399] hover:bg-[#7a8e84] text-white px-5 py-2.5 rounded-xl transition-all shadow-sm w-fit">
          <PlusCircle size={20} />
          <span>Tambah Produk Baru</span>
        </Link>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Total Produk */}
        <div className="bg-white p-6 rounded-2xl border-2 border-[#e5e0d8] shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02]">
          <div className="p-4 bg-[#f3f0e9] rounded-2xl text-[#3e362e]">
            <ShoppingBag size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Produk</p>
            <h3 className="text-3xl font-black text-[#3e362e]">{isLoading ? "..." : stats.total}</h3>
          </div>
        </div>

        {/* Card 2: Aset */}
        <div className="bg-white p-6 rounded-2xl border-2 border-[#e5e0d8] shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02]">
          <div className="p-4 bg-[#e8f5e9] rounded-2xl text-[#2e7d32]">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Estimasi Aset</p>
            <h3 className="text-2xl font-black text-[#3e362e]">Rp {stats.totalPrice.toLocaleString("id-ID")}</h3>
          </div>
        </div>

        {/* Card 3: Server Status & Visits */}
        <div className="bg-[#3e362e] p-6 rounded-2xl shadow-lg text-white flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Server Status</h3>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-300 flex justify-between">
              <span>Backend:</span>
              <span className="text-green-400 font-mono">ONLINE</span>
            </p>
            <p className="text-sm text-gray-300 flex justify-between">
              <span>Environment:</span>
              <span className="italic text-yellow-200">Production</span>
            </p>

            {/* === STATISTIK KUNJUNGAN === */}
            <div className="mt-4 pt-4 border-t border-gray-600 space-y-2">
              {/* Total Views */}
              <p className="text-sm text-gray-300 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Eye size={16} className="text-blue-300" /> Total Views:
                </span>
                <span className="text-xl font-bold text-yellow-400">{visitStats?.total_views || 0}</span>
              </p>

              {/* Unique Visitors (Sudah Diaktifkan) */}
              <p className="text-sm text-gray-300 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users size={16} className="text-purple-300" /> Unique User:
                </span>
                <span className="text-lg font-bold text-white">{visitStats?.unique_visitors || 0}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
