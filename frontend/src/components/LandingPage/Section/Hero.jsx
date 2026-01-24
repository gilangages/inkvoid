import { Ghost, Cat, Cookie, Bird, Sparkles } from "lucide-react";

export const Hero = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      console.warn(`Element dengan id "${id}" tidak ditemukan. Cek ProductShowcase.jsx`);
    }
  };

  return (
    <section className="pt-44 pb-24 px-6 text-center max-w-6xl mx-auto relative overflow-hidden">
      {/* --- DEKORASI STIKER (POSISI DIPERBAIKI) --- */}
      {/* Sekarang posisinya "left-4" (masuk dkit), bukan "-left-4" (keluar) */}

      {/* 1. Hantu (Kiri Atas - Jauh dari button) */}
      <div className="absolute top-24 left-4 md:top-32 md:left-20 bg-white p-3 rounded-2xl border-2 border-[#E5E0D8] shadow-[3px_3px_0px_0px_rgba(62,54,46,0.1)] rotate-[-6deg] animate-float-slow z-0 opacity-90">
        <Ghost size={28} className="text-[#3E362E] fill-[#EAE7DF]" />
      </div>

      {/* 2. Kucing (Kanan Atas - Jauh dari button) */}
      <div className="absolute top-28 right-4 md:top-40 md:right-20 bg-white p-3 rounded-full border-2 border-[#E5E0D8] shadow-[3px_3px_0px_0px_rgba(62,54,46,0.1)] rotate-[6deg] animate-float-medium z-0 opacity-90 animation-delay-1000">
        <Cat size={28} className="text-[#D68C76] fill-[#D68C76]/20" />
      </div>

      {/* 3. Biskuit (Kiri Bawah - Digeser biar gak kena button di HP) */}
      {/* Di HP kita taruh agak pinggir (left-2), di Desktop agak tengah (left-1/4) */}
      <div className="absolute bottom-10 left-2 md:bottom-20 md:left-[20%] text-[#8DA399] animate-float-fast -z-10 rotate-12 opacity-60">
        <Cookie size={40} />
      </div>

      {/* 4. Burung (Kanan Bawah - Digeser biar gak kena button di HP) */}
      <div className="absolute bottom-12 right-2 md:bottom-24 md:right-[20%] text-[#3E362E]/30 animate-float-slow -z-10 -rotate-12">
        <Bird size={48} />
      </div>

      {/* 5. Sparkle Tambahan (Tengah atas dikit) */}
      <div className="absolute top-40 left-1/2 -translate-x-1/2 -mt-10 text-[#D68C76]/40 animate-pulse -z-10">
        <Sparkles size={32} />
      </div>

      {/* --- BACKGROUND BLOB --- */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#E8D5C4]/40 rounded-full blur-[80px] -z-20 mix-blend-multiply"></div>

      {/* --- KONTEN UTAMA --- */}
      <div className="relative z-10">
        <span className="bg-white border-2 border-[#3E362E] text-[#3E362E] px-4 py-1.5 rounded-lg text-sm font-bold shadow-[4px_4px_0px_0px_rgba(62,54,46,1)] mb-8 inline-block rotate-[-2deg]">
          ✂️ Printable Stickers
        </span>

        <h1 className="text-4xl md:text-6xl font-black text-[#3E362E] mb-6 leading-tight tracking-tight">
          Stiker Lucu Buatan <br />
          <span className="text-[#8DA399] underline decoration-[#D68C76] decoration-wavy decoration-4 underline-offset-4">
            Sendiri.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-[#6B5E51] mb-10 max-w-xl mx-auto leading-relaxed font-medium">
          Hai! Aku hobi gambar stiker. Di sini kamu bisa beli file digitalnya (ZIP), isi stiker transparan & lembaran A4
          siap print. Tinggal print, gunting, tempel deh!
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => scrollToSection("products")}
            className="bg-[#3E362E] text-[#FDFCF8] px-8 py-3.5 rounded-xl font-black tracking-wide hover:bg-[#8DA399] hover:-translate-y-0.5 transition-all shadow-[4px_4px_0px_0px_rgba(141,163,153,1)] border-2 border-[#3E362E] active:translate-y-0 active:shadow-none cursor-pointer">
            Lihat Karyaku 👇
          </button>
        </div>
      </div>
    </section>
  );
};
