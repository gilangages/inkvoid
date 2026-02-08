import { ShoppingBag, CreditCard, MessageCircle, Download } from "lucide-react";

export const HowToOrder = () => {
  const steps = [
    {
      title: "Pilih Koleksi Digital",
      // Fokus: Menjelaskan produk dengan bahasa baku
      description:
        "Telusuri koleksi lengkap kami. Seluruh paket stiker tersedia dengan harga tetap Rp10.000, mencakup format siap cetak (A4) dan digital (PNG).",
      icon: <ShoppingBag size={20} className="text-[#FDFCF8]" />,
    },
    {
      title: "Selesaikan Pembayaran",
      // Fokus: Instruksi transfer yang sopan
      description: (
        <div className="space-y-4">
          <p>Silakan lakukan transfer sesuai nominal produk (Rp10.000) ke rekening resmi berikut:</p>
          <div className="bg-[#F3F0E9] p-5 rounded-xl border border-[#E5E0D8] relative group hover:border-[#8DA399] hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="font-bold text-[#3E362E] text-xs uppercase tracking-widest">Bank Jago</p>
              <div className="h-2 w-2 rounded-full bg-[#8DA399] animate-pulse"></div>
            </div>
            <p className="text-xl md:text-2xl font-black tracking-wider text-[#3E362E] font-mono mb-1 selection:bg-[#8DA399] selection:text-white">
              5098 4594 4294
            </p>
            <p className="text-xs text-[#6B5E51] font-medium uppercase">a.n Gilang Abdian Anggara</p>
          </div>
        </div>
      ),
      icon: <CreditCard size={20} className="text-[#FDFCF8]" />,
    },
    {
      title: "Konfirmasi Pesanan",
      // Fokus: Arahan verifikasi standar
      description: (
        <div className="space-y-3">
          <p>
            Setelah pembayaran berhasil, mohon klik tombol <b>'Beli via WhatsApp'</b> pada halaman produk untuk
            memverifikasi bukti transfer dengan Admin.
          </p>
          <div className="inline-flex items-center gap-2 bg-[#FDFCF8] border border-[#E5E0D8] px-3 py-2 rounded-lg text-xs font-medium text-[#6B5E51] shadow-sm">
            <span className="text-base">🕒</span>
            <span>Jam Operasional: 07:00 - 22:00 WIB</span>
          </div>
          <p className="text-xs text-[#8C8478] italic leading-relaxed">
            *Pesan yang masuk di luar jam operasional akan diproses pada hari berikutnya.
          </p>
        </div>
      ),
      icon: <MessageCircle size={20} className="text-[#FDFCF8]" />,
    },
    {
      title: "Terima & Unduh",
      // Fokus: Menjelaskan akses produk tanpa bahasa 'marketing' berlebihan
      description:
        "Tautan unduhan pribadi (Google Drive) akan dikirimkan setelah verifikasi selesai. File stiker siap dicetak ulang (Printable) atau digunakan secara digital.",
      icon: <Download size={20} className="text-[#FDFCF8]" />,
    },
  ];

  return (
    <section
      id="howto"
      className="py-24 px-6 max-w-5xl mx-auto relative overflow-hidden bg-gradient-to-b from-transparent to-[#F3F0E9]/30 rounded-[3rem] my-10">
      {/* Header Section */}
      <div className="text-center mb-20 relative z-10">
        <span className="text-[#8DA399] font-bold text-sm tracking-widest uppercase mb-2 block">Panduan Pembelian</span>
        <h2 className="text-3xl md:text-4xl font-black text-[#3E362E] mb-4 tracking-tight">Cara Pemesanan</h2>
        <div className="h-1 w-20 bg-[#3E362E] mx-auto rounded-full mb-6" />
        <p className="text-[#6B5E51] max-w-lg mx-auto text-base leading-relaxed">
          Ikuti empat langkah sederhana berikut untuk mendapatkan koleksi stiker digital premium kami.
        </p>
      </div>

      <div className="relative">
        {/* Garis Vertikal (Timeline Line) */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-[#E5E0D8] transform md:-translate-x-1/2 md:block hidden"></div>
        {/* Garis Mobile */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-[#E5E0D8] md:hidden"></div>

        <div className="space-y-12 md:space-y-24">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col md:flex-row gap-8 md:gap-16 items-start ${
                idx % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}>
              {/* ICON BULAT DI TENGAH */}
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 bg-[#3E362E] rounded-full flex items-center justify-center border-4 border-[#FDFCF8] shadow-[0px_4px_12px_rgba(62,54,46,0.15)] z-10 group transition-transform duration-300 hover:scale-110 hover:rotate-3">
                {step.icon}
              </div>

              {/* KONTEN */}
              <div className="w-full md:w-1/2 pl-16 md:pl-0">
                <div
                  className={`
                    relative group
                    ${idx % 2 === 0 ? "md:text-left" : "md:text-right"}
                  `}>
                  {/* Dekorasi kecil di samping judul */}
                  <div
                    className={`hidden md:block absolute top-3 w-8 h-px bg-[#8DA399] transition-all duration-500 group-hover:w-12
                    ${idx % 2 === 0 ? "-left-12" : "-right-12"}
                  `}></div>

                  <h3 className="text-xl md:text-2xl font-bold text-[#3E362E] mb-3 group-hover:text-[#8DA399] transition-colors">
                    {step.title}
                  </h3>
                  <div className="text-[#6B5E51] text-sm md:text-base leading-relaxed">{step.description}</div>
                </div>
              </div>

              {/* Spacer Kosong untuk Layout Zig-Zag */}
              <div className="hidden md:block w-1/2" />
            </div>
          ))}
        </div>

        {/* Ending Dot */}
        <div className="absolute left-6 md:left-1/2 bottom-0 w-3 h-3 bg-[#8DA399] rounded-full ring-4 ring-[#FDFCF8] transform -translate-x-1/2 translate-y-1" />
      </div>
    </section>
  );
};
