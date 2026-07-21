// gilangages/lumasticker/lumasticker-main/frontend/src/components/LandingPage/Section/Hero.jsx

import { Ghost, CloudRain, Zap, Fingerprint, Coffee, Star } from "lucide-react";

export const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="pt-44 md:pt-40 pb-24 px-6 text-center max-w-6xl mx-auto relative overflow-hidden">
      {/* --- ELEMEN DEKORATIF --- */}
      <div className="absolute top-24 left-4 md:top-32 md:left-20 bg-[#1F1F23] p-4 rounded-xl border border-[#8287ac]/20 shadow-2xl rotate-[-8deg] animate-float-slow z-0 opacity-40">
        <Ghost size={32} className="text-[#8287ac]" />
      </div>

      <div className="absolute top-28 right-4 md:top-40 md:right-24 bg-[#1F1F23] p-4 rounded-full border border-[#8287ac]/20 shadow-2xl rotate-[10deg] animate-float-medium z-0 opacity-40">
        <Coffee size={32} className="text-[#8287ac]" />
      </div>

      <div className="absolute bottom-10 left-4 md:bottom-24 md:left-[15%] text-[#8287ac]/20 animate-float-fast -z-10 rotate-[-15deg]">
        <CloudRain size={56} />
      </div>

      <div className="absolute bottom-20 animate-pulse left-48 max-[400px]:left-[45%] md:bottom-24 md:left-[45%] text-[#8287ac]/20 -z-10 rotate-[-15deg]">
        <Star size={40} />
      </div>

      <div className="absolute bottom-28 right-4 md:bottom-32 md:right-[15%] text-[#8287ac]/10 animate-float-slow -z-10 rotate-12">
        <Fingerprint size={64} />
      </div>

      <div className="absolute top-26 left-1/2 -translate-x-1/2 text-[#8287ac]/30 animate-pulse -z-10">
        <Zap size={40} />
      </div>

      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#8287ac]/10 rounded-full blur-[120px] -z-20"></div>

      {/* --- KONTEN UTAMA --- */}
      <div className="relative z-10 mt-20 mb-62 max-[400px]:-mt-7 max-[400px]:mb-0 md:mb-0 md:mt-0">
        <span className="bg-[#1F1F23] border border-[#8287ac]/30 text-[#8287ac] px-5 py-1.5 rounded-full text-xs font-mono tracking-[0.2em] mb-10 inline-block uppercase opacity-80">
          // Arsip Digital //
        </span>

        <h1 className="text-5xl md:text-7xl font-black text-[#E0D7D7] mb-12 leading-[1.1] tracking-tighter">
          Terkadang aku membuat <br />
          <span className="text-[#8287ac] underline decoration-[#1F1F23] decoration-wavy underline-offset-8">
            sticker digital.
          </span>
        </h1>

        {/* <p className="text-lg md:text-xl text-[#B8B3B6] mb-12 max-w-2xl mx-auto leading-relaxed font-light italic opacity-90">
          Hanya kumpulan coretan yang lahir tanpa rencana. Simpan arsipnya, cetak sesukamu, atau biarkan ia sekadar
          menemani ruang sunyimu.
        </p> */}

        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-22">
          <button
            onClick={() => scrollToSection("products")}
            className="group relative bg-[#1F1F23] text-[#E0D7D7] px-10 py-4 rounded-sm font-bold tracking-widest overflow-hidden border border-[#8287ac]/30 transition-all hover:border-[#8287ac]">
            <span className="relative z-10">JELAJAHI ARSIP</span>
            <div className="absolute inset-0 bg-[#8287ac] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="absolute inset-0 z-20 flex items-center justify-center text-[#121214] opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-black">
              BUKA VOID
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
