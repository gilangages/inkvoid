// gilangages/lumasticker/lumasticker-main/frontend/src/components/LandingPage/Section/MeetTheArtist.jsx

import React from "react";

export const MeetTheArtist = () => {
  return (
    <section
      id="creator"
      className="py-24 px-4 overflow-hidden relative flex justify-center items-center border-t border-[#1F1F23]">
      {/* Container Utama */}
      <div className="relative group z-10">
        {/* Dekorasi Background (Blobs) - Diubah ke palet Muted Lavender */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-[30rem] md:h-[30rem] bg-[#8287ac]/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-[25rem] md:h-[25rem] bg-[#121214]/40 rounded-full blur-[40px] md:blur-[60px] pointer-events-none mix-blend-multiply"></div>

        {/* Shadow Berlapis: Menggunakan sudut kaku (InkVoid Style) */}
        <div className="absolute inset-0 bg-[#1F1F23] rounded-none rotate-[-4deg] opacity-40 scale-95 transition-transform duration-700 group-hover:rotate-[-6deg] group-hover:scale-100 border border-[#8287ac]/5"></div>
        <div className="absolute inset-0 bg-[#8287ac]/5 rounded-none rotate-[2deg] opacity-20 scale-95 transition-transform duration-700 group-hover:rotate-[4deg] group-hover:scale-100 border border-[#8287ac]/10"></div>

        {/* FRAME FOTO UTAMA */}
        {/* Mengubah bg-white ke bg-[#1F1F23] dan rounded-none */}
        <div className="relative bg-[#1F1F23] p-3 md:p-5 rounded-none shadow-2xl border border-[#8287ac]/20 rotate-[-1deg] transition-all duration-700 ease-out group-hover:rotate-0 group-hover:scale-[1.01] group-hover:border-[#8287ac]/40">
          {/* Area Gambar: Ukuran tetap sesuai permintaan (w-[22rem], h-[30rem], dll) */}
          <div className="w-[22rem] h-[30rem] md:w-[24rem] md:h-[32rem] max-w-[90vw] rounded-none overflow-hidden bg-[#121214] relative">
            {/* Tekstur Noise halus khas Lo-Fi */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-noise z-10"></div>

            <img
              src="./me-ghilbi.gif"
              alt="Artist"
              className="w-full h-full object-cover opacity-70 grayscale-[30%] group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-in-out"
            />
          </div>

          {/* Hiasan: Selotip Atas (Diubah ke warna gelap/transparan) */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-8 bg-[#121214]/60 backdrop-blur-md rotate-1 border border-[#8287ac]/10 group-hover:bg-[#8287ac]/10 transition-colors duration-500"></div>

          {/* Hiasan: Selotip Bawah */}
          <div className="absolute -bottom-3 left-8 w-24 h-6 bg-[#121214]/60 backdrop-blur-md -rotate-2 border border-[#8287ac]/10 group-hover:bg-[#8287ac]/10 transition-colors duration-500"></div>

          {/* Badge Nama Artist (Opsional untuk mempertegas identitas) */}
          {/* <div className="absolute bottom-6 right-6 z-20">
            <span className="text-[10px] font-mono tracking-[0.4em] text-[#E0D7D7] opacity-40 bg-[#121214]/80 px-2 py-1 uppercase">
              Q
            </span>
          </div> */}
        </div>
      </div>
    </section>
  );
};
