// frontend/src/components/LandingPage/Section/FAQ.jsx

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Apakah produk ini kompatibel dengan aplikasi selain GoodNotes?",
      answer:
        "Ya. File disajikan dalam format .PNG transparan yang bersifat universal. Anda dapat menggunakannya pada berbagai aplikasi pencatat digital (seperti Notability, Samsung Notes, Notion) maupun untuk kebutuhan desain lainnya.",
    },
    {
      question: "Bagaimana dengan kualitas dan resolusi gambar?",
      answer:
        "Gambar yang ditampilkan pada situs web merupakan versi pratinjau untuk optimalisasi kinerja. File asli yang Anda terima memiliki resolusi tinggi (High Quality / 300 DPI) guna menjamin ketajaman visual saat digunakan secara digital maupun dicetak.",
    },
    {
      question: "Apakah file diizinkan untuk dicetak secara fisik?",
      answer:
        "Tentu. Lisensi produk mencakup Penggunaan Pribadi (Personal Use), sehingga Anda diperkenankan mencetak file ini tanpa batasan jumlah untuk kebutuhan dekorasi atau dokumentasi pribadi.",
    },
    {
      question: "Bagaimana prosedur pengiriman file setelah pembelian?",
      answer:
        "Setelah pembayaran terkonfirmasi, tautan akses unduhan (Google Drive) akan dikirimkan secara langsung melalui WhatsApp ke nomor yang terdaftar.",
    },
  ];

  return (
    <section id="faq" className="py-24 px-6 max-w-3xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-[#8DA399] font-bold text-sm tracking-widest uppercase mb-2 block">Pusat Bantuan</span>
        <h2 className="text-3xl md:text-4xl font-black text-[#3E362E] mb-6">Pertanyaan Umum</h2>
        <p className="text-[#6B5E51]">Informasi lengkap mengenai produk dan layanan kami.</p>
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
