import { useEffect, useState } from "react";
import api from "../../../lib/api/apiClient";
import {
  ShoppingBag,
  DollarSign,
  PlusCircle,
  Eye,
  Users,
  Trash2,
  Monitor,
  Smartphone,
  Globe,
  ChevronLeft,
  ChevronRight,
  Hash,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router";
import { useLocalStorage } from "react-use";
import { alertConfirm, alertSuccess, alertError } from "../../../lib/alert";
import { useNavigate } from "react-router";

export default function DashboardOverview() {
  const [stats, setStats] = useState({ total: 0, totalPrice: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Inisialisasi state agar tidak crash
  const [visitStats, setVisitStats] = useState({ total_views: 0, unique_visitors: 0 });

  // Visitor List State
  const [visitors, setVisitors] = useState<any[]>([]);
  const [visitorLoading, setVisitorLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_data: 0,
    per_page: 10,
  });

  const [_, setToken] = useLocalStorage("token", "");
  const navigate = useNavigate();

  // Helper removed, using apiClient middleware

  // Helper: Handle 401/403 (token expired)
  async function handleAuthError() {
    await alertError("Sesi anda telah berakhir. Silakan login kembali.");
    setToken("");
    navigate("/admin/login");
  }

  // Fetch visitor list
  async function fetchVisitors(page = 1) {
    setVisitorLoading(true);
    try {
      const { data, error, response } = await api.GET("/visits/list", {
        params: { query: { page, limit: 10 } },
      });
      const body = (data || error) as any;

      if (response.status === 401 || response.status === 403) {
        await handleAuthError();
        return;
      }

      if (response.ok) {
        setVisitors(body.data || []);
        setPagination(body.pagination || pagination);
      }
    } catch (error) {
      console.error("Error fetching visitors:", error);
    } finally {
      setVisitorLoading(false);
    }
  }

  // Hapus satu visitor
  async function handleDeleteVisitor(id: number) {
    if (!(await alertConfirm("Yakin ingin menghapus data pengunjung ini?"))) return;

    try {
      const { data, error, response } = await api.DELETE("/visits/{id}", {
        params: { path: { id } },
      });
      const body = (data || error) as any;

      if (response.status === 401 || response.status === 403) {
        await handleAuthError();
        return;
      }

      if (response.ok) {
        await alertSuccess(body.message);
        // Refresh data: jika halaman saat ini kosong setelah hapus, mundur 1 halaman
        const newPage =
          visitors.length === 1 && pagination.current_page > 1
            ? pagination.current_page - 1
            : pagination.current_page;
        fetchVisitors(newPage);
        // Refresh stats juga
        fetchVisitStats();
      } else {
        await alertError(body.message);
      }
    } catch (error) {
      console.error(error);
      await alertError("Terjadi kesalahan sistem.");
    }
  }

  // Hapus semua visitor
  async function handleDeleteAll() {
    if (!(await alertConfirm("Yakin ingin menghapus SEMUA data pengunjung? Aksi ini tidak bisa dibatalkan.")))
      return;

    try {
      const { data, error, response } = await api.DELETE("/visits/all");
      const body = (data || error) as any;

      if (response.status === 401 || response.status === 403) {
        await handleAuthError();
        return;
      }

      if (response.ok) {
        await alertSuccess(body.message);
        fetchVisitors(1);
        fetchVisitStats();
      } else {
        await alertError(body.message);
      }
    } catch (error) {
      console.error(error);
      await alertError("Terjadi kesalahan sistem.");
    }
  }

  // Fetch visit stats (dipindah ke function sendiri agar bisa dipanggil ulang)
  async function fetchVisitStats() {
    try {
      const { data, response } = await api.GET("/visits/stats");

      if (response.ok) {
        const responseBody = data as any;
        setVisitStats(responseBody.data || responseBody);
      }
    } catch (error) {
      console.error("Error koneksi stats:", error);
    }
  }

  useEffect(() => {
    // 1. Fetch Produk
    api.GET("/products").then(async ({ data, error, response }) => {
      try {
        const res = (data || error) as any;
        if (res.success) {
          const products = res.data;
          const total = products.length;
          const totalPrice = products.reduce((acc: number, curr: any) => acc + parseInt(curr.price || 0), 0);
          setStats({ total, totalPrice });
        }
      } catch (err) {
        console.error("Gagal parse produk", err);
      }
      setIsLoading(false);
    });

    // 2. Fetch Statistik Visit
    fetchVisitStats();

    // 3. Fetch Visitor List
    fetchVisitors(1);
  }, []);

  // Helper: Device icon
  const DeviceIcon = ({ type }: { type: string }) => {
    if (type === "Mobile") return <Smartphone size={14} className="text-blue-500" />;
    return <Monitor size={14} className="text-gray-600" />;
  };

  return (
    <div className="max-w-6xl mx-auto animate-slide-up px-4 pb-20">
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

      {/* ======================================================== */}
      {/* === SECTION BARU: DAFTAR PENGUNJUNG DENGAN PAGINATION === */}
      {/* ======================================================== */}
      <div className="mt-10">
        {/* Header Section */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-[#3E362E] flex items-center gap-2">
              <Globe size={24} className="text-[#8DA399]" />
              Daftar Pengunjung
            </h2>
            <p className="text-sm text-[#6B5E51] italic">
              {pagination.total_data} pengunjung unik tercatat
            </p>
          </div>

          {/* Tombol Hapus Semua */}
          {visitors.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm w-fit">
              <Trash2 size={16} />
              Hapus Semua
            </button>
          )}
        </div>

        {/* === TAMPILAN DESKTOP (TABLE) === */}
        <div className="hidden md:block bg-white rounded-2xl border-4 border-[#3E362E] shadow-[8px_8px_0px_0px_rgba(62,54,46,1)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#EAE7DF] border-b-4 border-[#3E362E]">
                  <th className="p-4 font-bold text-[#3E362E] uppercase text-xs tracking-wider w-12">No</th>
                  <th className="p-4 font-bold text-[#3E362E] uppercase text-xs tracking-wider">Visitor ID</th>
                  <th className="p-4 font-bold text-[#3E362E] uppercase text-xs tracking-wider text-center">OS</th>
                  <th className="p-4 font-bold text-[#3E362E] uppercase text-xs tracking-wider text-center">Device</th>
                  <th className="p-4 font-bold text-[#3E362E] uppercase text-xs tracking-wider text-center">Browser</th>
                  <th className="p-4 font-bold text-[#3E362E] uppercase text-xs tracking-wider text-center">Visits</th>
                  <th className="p-4 font-bold text-[#3E362E] uppercase text-xs tracking-wider">Terakhir</th>
                  <th className="p-4 font-bold text-[#3E362E] uppercase text-xs tracking-wider text-center w-20">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[#EAE7DF]">
                {visitorLoading ? (
                  <tr>
                    <td colSpan={8} className="p-10 text-center text-[#6B5E51]">
                      Memuat data...
                    </td>
                  </tr>
                ) : visitors.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-10 text-center text-[#6B5E51]">
                      Belum ada data pengunjung.
                    </td>
                  </tr>
                ) : (
                  visitors.map((v, index) => (
                    <tr key={v.id} className="hover:bg-[#FDFCF8] transition-colors">
                      <td className="p-4 text-[#6B5E51] text-sm font-mono">
                        {(pagination.current_page - 1) * pagination.per_page + index + 1}
                      </td>
                      <td className="p-4 text-sm font-mono">
                        <span className="text-[#3E362E] font-medium" title={v.visitor_id || v.ip_address}>
                          {v.visitor_id
                            ? `${v.visitor_id.slice(0, 8)}...${v.visitor_id.slice(-4)}`
                            : v.ip_address}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#f3f0e9] rounded-lg text-xs font-bold text-[#3E362E]">
                          {v.os || "—"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold">
                          <DeviceIcon type={v.device_type} />
                          {v.device_type || "—"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-xs font-medium text-[#6B5E51]">{v.browser || "—"}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-lg text-xs font-bold text-blue-600">
                          <RefreshCw size={12} />
                          {v.visit_count || 1}x
                        </span>
                      </td>
                      <td className="p-4 text-xs text-[#6B5E51] font-medium italic">
                        {v.visit_time
                          ? new Date(v.visit_time).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDeleteVisitor(v.id)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                          title="Hapus visitor">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Desktop */}
          {pagination.total_pages > 1 && (
            <div className="flex items-center justify-between p-4 bg-[#FDFCF8] border-t-4 border-[#3E362E]">
              <p className="text-sm text-[#6B5E51]">
                Halaman <span className="font-bold text-[#3E362E]">{pagination.current_page}</span> dari{" "}
                <span className="font-bold text-[#3E362E]">{pagination.total_pages}</span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchVisitors(pagination.current_page - 1)}
                  disabled={pagination.current_page <= 1}
                  className="p-2 rounded-lg border-2 border-[#3E362E] bg-white hover:bg-[#EAE7DF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <ChevronLeft size={18} />
                </button>

                {/* Page numbers */}
                {Array.from({ length: pagination.total_pages }, (_, i) => i + 1)
                  .filter((p) => {
                    // Show first, last, and pages near current
                    return p === 1 || p === pagination.total_pages || Math.abs(p - pagination.current_page) <= 1;
                  })
                  .map((p, idx, arr) => (
                    <span key={p} className="flex items-center gap-1">
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span className="text-[#6B5E51] text-xs px-1">...</span>
                      )}
                      <button
                        onClick={() => fetchVisitors(p)}
                        className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors border-2 ${
                          p === pagination.current_page
                            ? "bg-[#3E362E] text-white border-[#3E362E]"
                            : "bg-white text-[#3E362E] border-[#e5e0d8] hover:bg-[#EAE7DF]"
                        }`}>
                        {p}
                      </button>
                    </span>
                  ))}

                <button
                  onClick={() => fetchVisitors(pagination.current_page + 1)}
                  disabled={pagination.current_page >= pagination.total_pages}
                  className="p-2 rounded-lg border-2 border-[#3E362E] bg-white hover:bg-[#EAE7DF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* === TAMPILAN MOBILE (CARD LIST) === */}
        <div className="md:hidden space-y-3">
          {visitorLoading ? (
            <div className="text-center p-10 text-[#6B5E51] bg-white rounded-xl border-2 border-[#3E362E]">
              Memuat data...
            </div>
          ) : visitors.length === 0 ? (
            <div className="text-center p-10 text-[#6B5E51] bg-white rounded-xl border-2 border-[#3E362E]">
              Belum ada data pengunjung.
            </div>
          ) : (
            visitors.map((v, index) => (
              <div
                key={v.id}
                className="bg-white rounded-2xl border-4 border-[#3E362E] shadow-[4px_4px_0px_0px_rgba(62,54,46,1)] p-4 relative">
                {/* Badge nomor */}
                <div className="absolute top-0 right-0 bg-[#3E362E] text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-xl">
                  #{(pagination.current_page - 1) * pagination.per_page + index + 1}
                </div>

                {/* Visitor ID */}
                <p className="text-xs font-mono text-[#6B5E51] mb-2" title={v.visitor_id || v.ip_address}>
                  <Hash size={12} className="inline text-[#8DA399]" />
                  {v.visitor_id
                    ? `${v.visitor_id.slice(0, 8)}...${v.visitor_id.slice(-4)}`
                    : v.ip_address}
                </p>

                {/* Info Grid */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  <div className="bg-[#f3f0e9] rounded-lg p-2 text-center">
                    <p className="text-[9px] text-[#6B5E51] uppercase font-bold">OS</p>
                    <p className="text-xs font-bold text-[#3E362E]">{v.os || "—"}</p>
                  </div>
                  <div className="bg-[#f3f0e9] rounded-lg p-2 text-center">
                    <p className="text-[9px] text-[#6B5E51] uppercase font-bold">Device</p>
                    <p className="text-xs font-bold text-[#3E362E] flex items-center justify-center gap-1">
                      <DeviceIcon type={v.device_type} />
                      {v.device_type || "—"}
                    </p>
                  </div>
                  <div className="bg-[#f3f0e9] rounded-lg p-2 text-center">
                    <p className="text-[9px] text-[#6B5E51] uppercase font-bold">Browser</p>
                    <p className="text-xs font-bold text-[#3E362E]">{v.browser || "—"}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <p className="text-[9px] text-blue-500 uppercase font-bold">Visits</p>
                    <p className="text-xs font-bold text-blue-600">{v.visit_count || 1}x</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t-2 border-[#EAE7DF]">
                  <span className="text-[10px] text-[#6B5E51] italic">
                    {v.visit_time
                      ? new Date(v.visit_time).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </span>
                  <button
                    onClick={() => handleDeleteVisitor(v.id)}
                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                    title="Hapus">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Pagination Mobile */}
          {pagination.total_pages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => fetchVisitors(pagination.current_page - 1)}
                disabled={pagination.current_page <= 1}
                className="px-4 py-2 rounded-xl border-2 border-[#3E362E] bg-white text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft size={16} className="inline" /> Prev
              </button>
              <span className="text-sm font-bold text-[#3E362E]">
                {pagination.current_page} / {pagination.total_pages}
              </span>
              <button
                onClick={() => fetchVisitors(pagination.current_page + 1)}
                disabled={pagination.current_page >= pagination.total_pages}
                className="px-4 py-2 rounded-xl border-2 border-[#3E362E] bg-white text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed">
                Next <ChevronRight size={16} className="inline" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
