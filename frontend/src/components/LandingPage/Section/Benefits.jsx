import { Printer, Infinity as InfinityIcon, PenTool } from "lucide-react";

export const Benefits = () => {
  const items = [
    {
      icon: <InfinityIcon size={32} />,
      title: "Sekali Beli, Print Selamanya",
      desc: "File digital jadi milikmu selamanya. Mau print 1 kali atau 100 kali? Bebas! Hemat kertas, hemat biaya.",
    },
    {
      icon: <Printer size={32} />,
      title: "Format A4 + File Satuan",
      desc: "Dapat layout siap cetak ukuran A4 (anti ribet setting margin) DAN file PNG satuan transparan untuk digital.",
    },
    {
      icon: <PenTool size={32} />,
      title: "Original Hand-Drawn",
      desc: "Murni coretan tangan sendiri, bukan hasil generate AI. Punya karakter unik yang nggak pasaran.",
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#FDFCF8] p-8 rounded-2xl border-2 border-[#E5E0D8] hover:border-[#8DA399] transition-all duration-300 relative group shadow-sm hover:shadow-[8px_8px_0px_0px_rgba(141,163,153,0.3)]">
            <div className="bg-[#EAE7DF] w-16 h-16 rounded-full flex items-center justify-center text-[#3E362E] mb-6 group-hover:bg-[#8DA399] group-hover:text-white transition-colors border border-[#E5E0D8]">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-[#3E362E]">{item.title}</h3>
            <p className="text-[#6B5E51] leading-relaxed text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
