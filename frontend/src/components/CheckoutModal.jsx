import { X, Lock } from "lucide-react";
import { useState } from "react";

const CheckoutModal = ({ isOpen, onClose, product, onSubmit }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(product, name, email);
  };

  return (
    // Overlay Gelap (Backdrop)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-teal-900/40 backdrop-blur-sm p-4 transition-all">
      {/* Container Modal (Kertas Surat) */}
      <div className="bg-[#fffbf0] w-full max-w-md rounded-3xl shadow-2xl border-4 border-white relative overflow-hidden animate-bounce-in">
        {/* Hiasan Atas */}
        <div className="bg-emerald-600 h-3 w-full"></div>

        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-emerald-700 hover:bg-emerald-100 p-2 rounded-full transition">
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-extrabold text-teal-800 mb-2">Form Pemesanan</h3>
            <p className="text-emerald-600 text-sm">Kamu akan membeli:</p>
            <div className="font-bold text-lg text-emerald-900 bg-emerald-100 py-2 px-4 rounded-xl mt-2 inline-block">
              {product?.name}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-teal-700 mb-1 ml-1">Nama Lengkap</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl bg-white border-2 border-emerald-100 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all text-teal-900 placeholder-emerald-200"
                placeholder="Contoh: Chihiro Ogino"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-teal-700 mb-1 ml-1">Email Aktif</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl bg-white border-2 border-emerald-100 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all text-teal-900 placeholder-emerald-200"
                placeholder="email@kamu.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-emerald-500 mt-1 ml-1 flex items-center gap-1">
                <Lock size={12} /> Email akan digunakan untuk mengirim file.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 transform hover:-translate-y-1 transition-all duration-200 mt-4 flex justify-center items-center gap-2">
              Lanjut Pembayaran ✨
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
