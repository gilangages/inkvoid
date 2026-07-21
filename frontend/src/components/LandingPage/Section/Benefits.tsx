// gilangages/lumasticker/lumasticker-main/frontend/src/components/LandingPage/Section/Benefits.jsx
import { PenTool, Printer, FileCode, Clock } from "lucide-react";

export const Benefits = () => {
  const benefits = [
    {
      title: "Apa adanya",
      // Menyesuaikan narasi: tetap menekankan eksekusi manual meski ide dibantu referensi digital/AI
      description:
        "Eksekusi murni tangan. Meski ide bisa datang dari mana saja, setiap garisnya tetap hasil proses manual yang personal.",
      icon: <PenTool className="text-[#8287ac]" size={24} />,
    },
    {
      title: "Bisa diprint",
      description: "Resolusi 300 DPI. Gambarnya tetap tajam saat sudah di atas kertas.",
      icon: <Printer className="text-[#8287ac]" size={24} />,
    },
    {
      title: "File Lengkap",
      description: "Dapat format PNG transparan dan PDF yang siap untuk langsung dicetak.",
      icon: <FileCode className="text-[#8287ac]" size={24} />,
    },
    {
      title: "Milikmu",
      description: "Sekali ambil filenya jadi milikmu. Bebas mau kamu cetak berapa kali pun.",
      icon: <Clock className="text-[#8287ac]" size={24} />,
    },
  ];

  return (
    <section id="benefits" className="py-24 px-6 max-w-6xl mx-auto border-t border-[#1F1F23]">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-black text-[#E0D7D7] tracking-tighter">
          Kenapa <span className="text-[#8287ac] italic opacity-80">InkVoid?</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {benefits.map((item, idx) => (
          <div
            key={idx}
            className="group bg-[#1F1F23]/30 p-8 rounded-none border border-[#8287ac]/10 hover:border-[#8287ac]/40 transition-all duration-300">
            <div className="w-12 h-12 bg-[#121214] flex items-center justify-center mb-8 border border-[#8287ac]/10">
              {item.icon}
            </div>
            <h3 className="text-lg font-bold text-[#E0D7D7] mb-3 tracking-tight">{item.title}</h3>
            <p className="text-[#B8B3B6] leading-relaxed text-sm font-light opacity-70">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
