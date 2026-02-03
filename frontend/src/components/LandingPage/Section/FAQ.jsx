// frontend/src/components/LandingPage/Section/FAQ.jsx

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Apakah stiker ini hanya untuk GoodNotes?",
      answer:
        "Tidak dong! Kamu akan mendapatkan file format .PNG (transparan) yang fleksibel. Jadi bisa dipakai di aplikasi jurnal lain (Notability, Samsung Notes), Notion, atau bahkan hiasan Instagram Story.",
    },
    {
      question: "Bagaimana kualitas gambarnya? Pecah tidak?",
      answer:
        "Tenang saja. Yang kamu lihat di website adalah versi preview (supaya loading cepat). File asli yang kamu terima beresolusi tinggi (High Quality / 300 DPI) sehingga sangat tajam dan tidak pecah.",
    },
    {
      question: "Apakah boleh dicetak fisik?",
      answer:
        "Boleh banget! Karena resolusinya tinggi, kamu bisa mencetaknya untuk ditempel di buku tulis fisik atau dekorasi kamar (penggunaan pribadi/personal use only ya).",
    },
    {
      question: "Cara downloadnya bagaimana?",
      answer:
        "Setelah konfirmasi pembayaran, admin akan mengirimkan link akses Google Drive pribadi ke WhatsApp kamu. Tinggal klik dan download sepuasnya.",
    },
  ];

  return (
    <section id="faq" className="py-24 px-6 max-w-3xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-[#8DA399] font-bold text-sm tracking-widest uppercase mb-2 block">Pojok Tanya</span>
        <h2 className="text-3xl md:text-4xl font-black text-[#3E362E] mb-6">Sering Ditanyakan</h2>
        <p className="text-[#6B5E51]">Jawaban cepat untuk rasa penasaranmu.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="border-2 border-[#E5E0D8] rounded-2xl overflow-hidden bg-[#FDFCF8] transition-all duration-300 hover:border-[#8DA399]">
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none">
              <span className={`font-bold text-lg ${openIndex === idx ? "text-[#8DA399]" : "text-[#3E362E]"}`}>
                {faq.question}
              </span>
              {openIndex === idx ? (
                <Minus className="text-[#8DA399]" size={20} />
              ) : (
                <Plus className="text-[#3E362E]" size={20} />
              )}
            </button>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                openIndex === idx ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}>
              <p className="p-6 pt-0 text-[#6B5E51] leading-relaxed font-medium border-t border-dashed border-[#E5E0D8]">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
