import { CheckCircle2, Star, Zap, Image } from "lucide-react";

export const Benefits = () => {
  const benefits = [
    {
      title: "Desain Orisinil & Unik",
      description:
        "Setiap goresan dibuat manual (hand-drawn), memberikan sentuhan abstrak yang hangat dan tidak pasaran.",
      icon: <Star className="text-[#FDFCF8]" size={24} />,
    },
    {
      title: "Kualitas HD & Tajam",
      description:
        "File asli beresolusi tinggi (300 DPI). Hasil cetak dijamin detail, jernih, dan tidak pecah meski diperbesar.",
      icon: <Image className="text-[#FDFCF8]" size={24} />,
    },
    {
      title: "Format Fleksibel",
      // UPDATE: Menambahkan kata "Cetak" agar pembeli sadar ini bisa diprint
      description:
        "Dual fungsi! Bisa dipakai digital (GoodNotes/Notion) atau dicetak fisik (Printable) untuk dekorasi jurnal kertasmu.",
      icon: <CheckCircle2 className="text-[#FDFCF8]" size={24} />,
    },
    {
      title: "Akses Seumur Hidup",
      // UPDATE: Menambahkan "Bebas Cetak Ulang" (Selling Point Utama)
      description:
        "Sekali bayar, milikmu selamanya. File tersimpan aman dan kamu bebas mencetak ulang (re-print) sesukamu.",
      icon: <Zap className="text-[#FDFCF8]" size={24} />,
    },
  ];

  return (
    <section id="benefits" className="py-24 px-6 max-w-6xl mx-auto">
      {/* JUDUL SECTION */}
      <div className="text-center mb-16">
        <span className="text-[#8DA399] font-bold tracking-widest text-sm uppercase">Spesial Buat Kamu</span>
        <h2 className="text-3xl md:text-4xl font-black text-[#3E362E] mt-2">
          Kenapa Harus Stiker{" "}
          <span className="underline decoration-[#D68C76] decoration-wavy underline-offset-4">Luma?</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {benefits.map((item, idx) => (
          <div
            key={idx}
            className="group bg-[#FDFCF8] p-8 rounded-3xl border-2 border-[#E5E0D8]  hover:border-[#8DA399] transition-all duration-300 hover:-translate-y-2 shadow-[4px_4px_0px_0px_rgba(62,54,46,0.05)] hover:shadow-[8px_8px_0px_0px_rgba(141,163,153,0.2)]">
            <div className="w-14 h-14 bg-[#3E362E] rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 group-hover:scale-110 transition-transform shadow-lg">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold text-[#3E362E] mb-3 group-hover:text-[#8DA399] transition-colors">
              {item.title}
            </h3>
            <p className="text-[#6B5E51] leading-relaxed text-sm font-medium">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
