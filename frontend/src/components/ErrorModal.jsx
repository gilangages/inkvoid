import { XCircle, AlertTriangle } from "lucide-react";

export const ErrorModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#3E362E]/60 backdrop-blur-sm p-4 animate-fade-in">
      {/* Container Kartu */}
      <div className="bg-[#FFF5F5] w-full max-w-sm rounded-3xl p-8 text-center border-4 border-[#FECACA] shadow-2xl relative overflow-hidden animate-bounce-in">
        {/* Dekorasi Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#EF4444]/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#EF4444]/10 rounded-full blur-xl -ml-5 -mb-5"></div>

        {/* Ikon Error Animasi */}
        <div className="w-20 h-20 bg-[#FEE2E2] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm animate-pulse">
          <XCircle size={40} className="text-[#EF4444] stroke-[2]" />
        </div>

        <h2 className="text-2xl font-black text-[#7F1D1D] mb-2">Waduh, Gagal!</h2>

        {/* Pesan Error Dinamis */}
        <p className="text-[#991B1B] font-medium mb-6 leading-relaxed bg-white/50 p-3 rounded-xl border border-[#FECACA]">
          {message || "Terjadi kesalahan sistem. Coba ulangi lagi ya."}
        </p>

        <button
          onClick={onClose}
          className="w-full bg-[#EF4444] text-white font-bold py-3.5 rounded-xl hover:bg-[#DC2626] hover:-translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(127,29,29,0.2)]">
          Coba Lagi 🔄
        </button>
      </div>
    </div>
  );
};
