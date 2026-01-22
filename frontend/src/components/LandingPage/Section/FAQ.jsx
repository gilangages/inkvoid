import { ChevronDown, MessageCircle } from "lucide-react";

export const FAQ = () => {
  const faqs = [
    {
      q: "Ini dikirim fisik atau digital?",
      a: "Ini PRODUK DIGITAL (File) ya. Kamu akan dapat link download file ZIP berisi gambar stiker kualitas tinggi. Jadi tidak ada paket yang dikirim kurir ke rumahmu.",
    },
    {
      q: "Gimana cara pakainya?",
      a: "Gampang! 1. Checkout & Bayar. 2. Cek Email & Download. 3. Print filenya di kertas stiker (HVS Sticker/Vinyl). 4. Gunting sesuai pola.",
    },
    {
      q: "Boleh untuk dijual lagi (Komersial)?",
      a: "Maaf, HANYA UNTUK PEMAKAIAN PRIBADI (Personal Use) ya. Boleh buat jurnal sendiri atau kado teman, tapi tidak boleh jual file atau hasil cetaknya.",
    },
    {
      q: "Kalau file hilang gimana?",
      a: "Tenang, link download di email kamu berlaku selamanya. Simpan emailnya baik-baik ya!",
    },
  ];

  return (
    <section id="faq" className="py-20 px-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-black text-center mb-12 text-[#3E362E]">Sering Ditanyakan 🤔</h2>

      <div className="space-y-4 mb-16">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border-2 border-[#E5E0D8] overflow-hidden hover:border-[#8DA399] transition-colors">
            <details className="group">
              <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-[#3E362E] select-none bg-[#FDFCF8]">
                <span>{faq.q}</span>
                <span className="transition-transform duration-300 group-open:rotate-180 text-[#8DA399]">
                  <ChevronDown />
                </span>
              </summary>
              <div className="text-[#6B5E51] px-6 pb-6 leading-relaxed bg-[#FDFCF8] border-t border-dashed border-[#E5E0D8] text-sm">
                {faq.a}
              </div>
            </details>
          </div>
        ))}
      </div>

      {/* SECTION WHATSAPP */}
      <div className="bg-[#EAE7DF] rounded-2xl p-8 text-center border border-[#E5E0D8]">
        <h3 className="text-xl font-bold text-[#3E362E] mb-2">Masih ada yang bingung?</h3>
        <p className="text-[#6B5E51] mb-6 text-sm">Boleh banget tanya-tanya dulu sebelum beli.</p>

        <a
          href="https://wa.me/6281234567890?text=Halo%20kak,%20mau%20tanya%20soal%20stiker%20Luma..."
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#20bd5a] transition-all hover:-translate-y-1">
          <MessageCircle size={20} />
          Chat WhatsApp
        </a>
      </div>
    </section>
  );
};
