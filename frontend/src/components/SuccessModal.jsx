import { Check, Mail, Heart } from "lucide-react"; // X tidak dipakai, dihapus aja biar bersih

export const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#3E362E]/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#FDFCF8] w-full max-w-sm rounded-3xl p-8 text-center border-4 border-[#E5E0D8] shadow-2xl relative overflow-hidden animate-bounce-in">
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[#8DA399]"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#D68C76]/20 rounded-full blur-2xl"></div>
        <div className="absolute top-20 -left-10 w-24 h-24 bg-[#8DA399]/20 rounded-full blur-xl"></div>

        {/* Ikon Sukses */}
        <div className="w-20 h-20 bg-[#8DA399] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(62,54,46,0.1)] animate-float-slow">
          <Check size={40} className="text-white stroke-[3]" />
        </div>

        <h2 className="text-2xl font-black text-[#3E362E] mb-2">Yeay! Pembayaran Berhasil</h2>

        <p className="text-[#6B5E51] font-medium mb-6 leading-relaxed">
          Terima kasih banyak sudah jajan stiker di Luma!{" "}
          <Heart size={16} className="inline text-[#D68C76] fill-[#D68C76]" />
        </p>

        {/* Box Info Email (Updated Text) */}
        <div className="bg-[#EAE7DF]/50 rounded-xl p-4 border border-dashed border-[#8DA399] mb-8">
          <div className="flex items-center justify-center gap-2 text-[#3E362E] font-bold mb-1">
            <Mail size={18} />
            <span>Cek Email Kamu</span>
          </div>
          <p className="text-sm text-[#6B5E51] leading-relaxed">
            Link download file ZIP sudah dikirim ke emailmu. Jika tidak muncul di Inbox, mohon periksa folder{" "}
            <span className="font-bold text-[#D68C76]">Spam</span> atau{" "}
            <span className="font-bold text-[#D68C76]">Promotions</span> yaa.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#3E362E] text-[#FDFCF8] font-bold py-3.5 rounded-xl hover:bg-[#8DA399] hover:-translate-y-1 transition-all shadow-lg">
          Siap, Meluncur! 🚀
        </button>
      </div>
    </div>
  );
};
