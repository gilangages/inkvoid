import { useEffect, useState } from "react";
import { ShoppingBag, User, Mail, Calendar, Tag, CreditCard } from "lucide-react";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_APP_PATH}/payment/admin/transactions`)
      .then((res) => res.json())
      .then((json) => {
        setOrders(json.data || []);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "success":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-red-100 text-red-700 border-red-200";
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-slide-up px-4 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#3E362E] flex items-center gap-3">
          <ShoppingBag className="text-[#8DA399]" size={32} />
          Riwayat Pesanan
        </h1>
        <p className="text-[#6B5E51] mt-1 italic">Pantau semua transaksi masuk di Luma Store.</p>
      </div>

      {/* --- 1. TAMPILAN DESKTOP (TABLE) - Muncul di layar MD ke atas --- */}
      <div className="hidden md:block bg-white rounded-2xl border-4 border-[#3E362E] shadow-[8px_8px_0px_0px_rgba(62,54,46,1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#EAE7DF] border-b-4 border-[#3E362E]">
                <th className="p-4 font-bold text-[#3E362E] uppercase text-xs tracking-wider">Pelanggan</th>
                <th className="p-4 font-bold text-[#3E362E] uppercase text-xs tracking-wider">Produk</th>
                <th className="p-4 font-bold text-[#3E362E] uppercase text-xs tracking-wider text-center">Harga</th>
                <th className="p-4 font-bold text-[#3E362E] uppercase text-xs tracking-wider text-center">Status</th>
                <th className="p-4 font-bold text-[#3E362E] uppercase text-xs tracking-wider">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#EAE7DF]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-[#6B5E51]">
                    Memuat data...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-[#6B5E51]">
                    Belum ada pesanan masuk.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FDFCF8] transition-colors">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#3E362E] flex items-center gap-1">
                          <User size={14} /> {order.customer_name}
                        </span>
                        <span className="text-xs text-[#6B5E51] flex items-center gap-1">
                          <Mail size={12} /> {order.customer_email}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-[#3E362E]">
                      <div className="flex items-center gap-2">
                        <Tag size={14} className="text-[#8DA399]" />
                        {order.product_name || "Produk dihapus"}
                      </div>
                    </td>
                    <td className="p-4 text-center font-black text-[#3E362E]">
                      Rp {parseInt(order.amount).toLocaleString("id-ID")}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border-2 ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-[#6B5E51] font-medium italic">
                      {new Date(order.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- 2. TAMPILAN MOBILE (CARD LIST) - Muncul di layar di bawah MD --- */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="text-center p-10 text-[#6B5E51] bg-white rounded-xl border-2 border-[#3E362E]">
            Memuat data...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center p-10 text-[#6B5E51] bg-white rounded-xl border-2 border-[#3E362E]">
            Belum ada pesanan.
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border-4 border-[#3E362E] shadow-[4px_4px_0px_0px_rgba(62,54,46,1)] p-5 relative overflow-hidden">
              {/* Status Badge di Pojok Kanan Atas */}
              <div className="absolute top-0 right-0 p-2">
                <span
                  className={`px-2 py-0.5 rounded-bl-xl text-[9px] font-black uppercase border-b-2 border-l-2 border-[#3E362E] ${getStatusStyle(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {/* Header: Nama & Email */}
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-[#EAE7DF] p-2 rounded-lg border-2 border-[#3E362E]">
                  <User size={20} className="text-[#3E362E]" />
                </div>
                <div>
                  <h3 className="font-black text-[#3E362E] leading-tight">{order.customer_name}</h3>
                  <p className="text-xs text-[#6B5E51] flex items-center gap-1">
                    <Mail size={12} /> {order.customer_email}
                  </p>
                </div>
              </div>

              {/* Info Detail */}
              <div className="space-y-2 mb-4 bg-[#FDFCF8] p-3 rounded-xl border-2 border-dashed border-[#EAE7DF]">
                <div className="flex items-center gap-2 text-sm text-[#3E362E] font-bold">
                  <Tag size={16} className="text-[#8DA399]" />
                  {order.product_name || "Produk dihapus"}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6B5E51]">
                  <Calendar size={14} />
                  {new Date(order.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              {/* Footer: Harga */}
              <div className="flex justify-between items-center pt-2 border-t-2 border-[#EAE7DF]">
                <span className="text-xs font-bold text-[#6B5E51] uppercase tracking-wider">Total Pembayaran</span>
                <span className="text-lg font-black text-[#3E362E]">
                  Rp {parseInt(order.amount).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
