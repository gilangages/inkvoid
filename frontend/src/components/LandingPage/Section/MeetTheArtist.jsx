import React from "react";

export const MeetTheArtist = () => {
  return (
    <section id="creator" className="py-24 px-4 overflow-hidden relative flex justify-center items-center">
      {/* Container Utama */}
      <div className="relative group z-10">
        {/* Dekorasi Background (Blobs) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-[30rem] md:h-[30rem] bg-[#8DA399]/20 rounded-full blur-[60px] md:blur-[80px] pointer-events-none animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-[25rem] md:h-[25rem] bg-[#D68C76]/15 rounded-full blur-[40px] md:blur-[60px] pointer-events-none mix-blend-multiply"></div>

        {/* Shadow Berlapis */}
        <div className="absolute inset-0 bg-[#3E362E] rounded-[2rem] rotate-[-6deg] opacity-5 scale-95 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-100"></div>
        <div className="absolute inset-0 bg-[#D68C76] rounded-[2rem] rotate-[3deg] opacity-10 scale-95 transition-transform duration-500 group-hover:rotate-[5deg] group-hover:scale-100"></div>

        {/* FRAME FOTO UTAMA */}
        {/* Padding dikurangi sedikit di HP (p-3) agar area foto lebih maksimal */}
        <div className="relative bg-white p-3 md:p-5 rounded-[2rem] shadow-[0_15px_40px_-10px_rgba(62,54,46,0.15)] border-2 border-[#E5E0D8] rotate-[-2deg] transition-all duration-500 ease-out group-hover:rotate-0 group-hover:scale-[1.02] group-hover:shadow-[0_30px_60px_-15px_rgba(62,54,46,0.2)]">
          {/* Area Gambar */}
          {/* PERUBAHAN DISINI: */}
          {/* 1. w-[22rem]: Diperlebar signifikan untuk HP (sebelumnya 18rem) */}
          {/* 2. h-[30rem]: Dipertinggi agar proporsional (sebelumnya 24rem) */}
          {/* 3. max-w-[90vw]: Batas lebar dilonggarkan jadi 90% layar HP (sebelumnya 85%) */}
          <div className="w-[22rem] h-[30rem] md:w-[24rem] md:h-[32rem] max-w-[90vw] rounded-[1.5rem] overflow-hidden bg-[#F3F0E9] relative">
            {/* Tekstur Noise */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-noise z-10"></div>

            <img
              src="./me_black2.png"
              alt="Artist"
              className="w-full h-full object-cover opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-in-out"
            />
          </div>

          {/* Hiasan: Selotip Atas */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-24 h-8 bg-[#D68C76]/20 backdrop-blur-md shadow-sm rotate-2 border border-white/30"></div>

          {/* Hiasan: Selotip Bawah */}
          <div className="absolute -bottom-4 left-6 w-20 h-6 bg-[#8DA399]/20 backdrop-blur-md shadow-sm -rotate-3 border border-white/30"></div>
        </div>
      </div>
    </section>
  );
};
