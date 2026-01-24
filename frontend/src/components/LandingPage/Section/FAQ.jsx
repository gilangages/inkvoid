import { ChevronDown } from "lucide-react";
import { useState } from "react";

export const FAQ = () => {
  // Kita pakai State untuk tahu mana yang kebuka
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      q: "Ini dikirim fisik atau digital?",
      a: "Ini PRODUK DIGITAL (File) ya. Kamu akan dapat link download file ZIP berisi gambar stiker kualitas tinggi.",
    },
    {
      q: "Gimana cara pakainya?",
      a: "1. Checkout & Bayar. 2. Cek Email & Download. 3. Print filenya di kertas stiker. 4. Gunting sesuai pola.",
    },
    {
      q: "Rekomendasi Kertas?",
      a: "Agar hasil maksimal, gunakan kertas 'Vinyl Sticker Paper' (A4 Glossy).",
    },
    {
      q: "Boleh untuk dijual lagi?",
      a: "Maaf, HANYA UNTUK PEMAKAIAN PRIBADI (Personal Use) ya. Tidak boleh jual file atau hasil cetaknya.",
    },
  ];

  return (
    <section id="faq" className="py-20 px-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-black text-center mb-12 text-[#3E362E]">Sering Ditanyakan 🤔</h2>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border-2 border-[#E5E0D8] overflow-hidden hover:border-[#8DA399] transition-colors">
            {/* Header Pertanyaan */}
            <button
              onClick={() => toggleFAQ(idx)}
              className="w-full flex justify-between items-center p-6 text-left font-bold text-[#3E362E] bg-[#FDFCF8] focus:outline-none">
              <span>{faq.q}</span>
              <span
                className={`transition-transform duration-300 ${openIndex === idx ? "rotate-180 text-[#8DA399]" : ""}`}>
                <ChevronDown />
              </span>
            </button>

            {/* Animasi Mulus pakai Grid CSS */}
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${openIndex === idx ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <div className="px-6 pb-6 text-[#6B5E51] leading-relaxed bg-[#FDFCF8] border-t border-dashed border-[#E5E0D8] text-sm pt-2">
                  {faq.a}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
