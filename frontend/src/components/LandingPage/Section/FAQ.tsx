// frontend/src/components/LandingPage/Section/FAQ.jsx

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Bisa dipakai di aplikasi apa saja?",
      answer:
        "Formatnya .PNG transparan, jadi bersifat universal. Bisa langsung dimasukkan ke GoodNotes, Notability, Samsung Notes, atau bahkan Notion dan Canva.",
    },
    {
      question: "Gambarnya pecah nggak kalau dicetak?",
      answer:
        "Yang tampil di sini cuma pratinjau biar loading-nya nggak berat. File asli yang dikirim nanti punya resolusi 300 DPI, jadi tetap tajam dan bersih pas diprint.",
    },
    {
      question: "Boleh dicetak buat dijual lagi?",
      answer:
        "Hanya untuk pemakaian pribadi (Personal Use). Boleh dicetak sebanyak apapun buat dekorasi jurnal atau barang sendiri, tapi nggak buat dikomersialkan lagi.",
    },
    {
      question: "Berapa lama filenya sampai?",
      answer:
        "Begitu bukti transfer dicek, link Google Drive bakal langsung dikirim via WhatsApp. Prosesnya manual, jadi mohon tunggu sebentar kalau sedang di luar jam standby.",
    },
  ];

  return (
    <section id="faq" className="py-24 px-6 max-w-3xl mx-auto border-t border-[#1F1F23]">
      {/* HEADER: Lebih tenang dan tidak kaku */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-black text-[#E0D7D7] mb-4 tracking-tighter uppercase">
          Tanya <span className="text-[#8287ac] italic opacity-80">Jawab.</span>
        </h2>
        <p className="text-[#B8B3B6] font-light opacity-80">Beberapa hal yang mungkin ingin diketahui.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className={`border border-[#8287ac]/10 rounded-none bg-[#1F1F23]/30 transition-all duration-300 ${
              openIndex === idx ? "border-[#8287ac]/40 shadow-2xl" : "hover:border-[#8287ac]/20"
            }`}>
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none group">
              <span
                className={`font-bold text-lg tracking-tight transition-colors ${
                  openIndex === idx ? "text-[#8287ac]" : "text-[#E0D7D7] group-hover:text-[#8287ac]"
                }`}>
                {faq.question}
              </span>
              {openIndex === idx ? (
                <Minus className="text-[#8287ac] shrink-0" size={18} />
              ) : (
                <Plus className="text-[#E0D7D7]/50 shrink-0" size={18} />
              )}
            </button>
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                openIndex === idx ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}>
              <p className="p-6 pt-0 text-[#B8B3B6] leading-relaxed text-sm font-light italic border-t border-[#8287ac]/5 opacity-90">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
